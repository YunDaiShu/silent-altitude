// Publishes the project to GitHub through the REST API (no git, no github.com):
//   main      -> project source (this is what visitors read on the repo page)
//   gh-pages  -> built site, and Pages serves from this branch
// Usage:  set GITHUB_TOKEN=...  then: node scripts/deploy-gh.mjs [repoName]
import fs from 'node:fs/promises';
import path from 'node:path';

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) { console.error('GITHUB_TOKEN is not set'); process.exit(2); }

const REPO = process.argv[2] ?? 'silent-altitude';
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const API = 'https://api.github.com';
const H = {
  Authorization: 'Bearer ' + TOKEN,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'dsh-deploy',
};

const call = async (method, url, body) => {
  const res = await fetch(API + url, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text.slice(0, 300) }; }
  if (!res.ok) {
    const err = new Error(method + ' ' + url + ' -> ' + res.status + ' ' + (data && data.message ? data.message : text.slice(0, 200)));
    err.status = res.status;
    throw err;
  }
  return data;
};

const me = await call('GET', '/user');
const owner = me.login;
const siteUrl = 'https://' + owner.toLowerCase() + '.github.io/' + REPO + '/';
console.log('user=' + owner);

let repo;
try {
  repo = await call('GET', '/repos/' + owner + '/' + REPO);
  console.log('repo exists: ' + repo.full_name);
} catch (e) {
  if (e.status !== 404) throw e;
  repo = await call('POST', '/user/repos', {
    name: REPO,
    description: '静默海拔 · Silent Altitude — 黑金静奢风个人作品集（Vite + React + three.js）',
    homepage: siteUrl,
    private: false,
    auto_init: false,
  });
  console.log('repo created: ' + repo.full_name);
}

const walk = async (dir, prefix = '') => {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    const abs = path.join(dir, entry.name);
    const rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) out.push(...(await walk(abs, rel)));
    else out.push({ abs, rel });
  }
  return out;
};

// Source tree: an explicit whitelist, so node_modules / dist / build mirrors never leak in.
const SOURCE_FILES = [
  'index.html', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'vite.config.js',
  'README.md', '.gitignore', 'build.cmd', 'dev.cmd', 'single.cmd', 'rebuild.cmd',
];
const SOURCE_DIRS = ['src', 'public', 'docs', 'scripts'];

const collectSource = async () => {
  const files = [];
  for (const name of SOURCE_FILES) {
    const abs = path.join(ROOT, name);
    try { await fs.access(abs); files.push({ abs, rel: name }); } catch { /* optional */ }
  }
  for (const dir of SOURCE_DIRS) {
    const abs = path.join(ROOT, dir);
    try { await fs.access(abs); files.push(...(await walk(abs, dir))); } catch { /* optional */ }
  }
  return files.sort((a, b) => a.rel.localeCompare(b.rel));
};

const collectDist = async () => (await walk(DIST)).sort((a, b) => a.rel.localeCompare(b.rel));

const headOf = async (branch) => {
  const ref = await call('GET', '/repos/' + owner + '/' + REPO + '/git/ref/heads/' + branch)
    .catch((e) => (e.status === 404 || e.status === 409 ? null : Promise.reject(e)));
  return ref ? ref.object.sha : null;
};

/** Commits a full snapshot to one branch (an empty repo cannot take blobs, so seed first). */
const commitBranch = async (branch, files, message, extra = []) => {
  let parent = await headOf(branch);

  if (!parent) {
    // The blob API answers 409 "Git Repository is empty" until a branch has one commit,
    // so seed it with a throwaway marker that the real commit then removes.
    const seed = await call('PUT', '/repos/' + owner + '/' + REPO + '/contents/.seed', {
      message: 'chore: initialise ' + branch,
      content: Buffer.from('init\n').toString('base64'),
      ...(branch === repo.default_branch ? {} : { branch }),
    });
    parent = seed.commit.sha;
    console.log(branch + ': seeded at ' + parent.slice(0, 7));
  }

  const start = parent;
  const tree = [];
  for (const f of files) {
    const buf = await fs.readFile(f.abs);
    const blob = await call('POST', '/repos/' + owner + '/' + REPO + '/git/blobs', { content: buf.toString('base64'), encoding: 'base64' });
    tree.push({ path: f.rel, mode: '100644', type: 'blob', sha: blob.sha });
  }
  for (const e of extra) {
    const blob = await call('POST', '/repos/' + owner + '/' + REPO + '/git/blobs', { content: Buffer.from(e.content).toString('base64'), encoding: 'base64' });
    tree.push({ path: e.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const rootTree = await call('POST', '/repos/' + owner + '/' + REPO + '/git/trees', { tree });
  const commit = await call('POST', '/repos/' + owner + '/' + REPO + '/git/commits', {
    message,
    tree: rootTree.sha,
    parents: start ? [start] : [],
  });
  if (start) {
    await call('PATCH', '/repos/' + owner + '/' + REPO + '/git/refs/heads/' + branch, { sha: commit.sha, force: true });
  } else {
    await call('POST', '/repos/' + owner + '/' + REPO + '/git/refs', { ref: 'refs/heads/' + branch, sha: commit.sha });
  }
  console.log(branch + ': ' + (tree.length) + ' files, commit ' + commit.sha.slice(0, 7));
  return { sha: commit.sha, count: tree.length };
};

const main = await commitBranch('main', await collectSource(), 'chore: project source ' + new Date().toISOString().slice(0, 10));
const pages = await commitBranch('gh-pages', await collectDist(), 'deploy: built site ' + new Date().toISOString(), [{ path: '.nojekyll', content: '\n' }]);

// Point Pages at the built branch (PUT updates an existing configuration).
const pagesBody = { source: { branch: 'gh-pages', path: '/' } };
try {
  await call('POST', '/repos/' + owner + '/' + REPO + '/pages', pagesBody);
  console.log('pages enabled from gh-pages');
} catch (e) {
  if (e.status === 409) {
    await call('PUT', '/repos/' + owner + '/' + REPO + '/pages', pagesBody);
    console.log('pages repointed to gh-pages');
  } else {
    console.log('pages setup failed: ' + e.message);
  }
}

await call('PATCH', '/repos/' + owner + '/' + REPO, {
  description: '静默海拔 · Silent Altitude — 黑金静奢风个人作品集（Vite + React + three.js）',
  homepage: siteUrl,
}).catch((e) => console.log('about update skipped: ' + e.message));

const status = await call('GET', '/repos/' + owner + '/' + REPO + '/pages').catch(() => null);
console.log(JSON.stringify({
  repo: owner + '/' + REPO,
  repoUrl: 'https://github.com/' + owner + '/' + REPO,
  siteUrl,
  pagesBranch: status && status.source ? status.source.branch : 'gh-pages',
  pagesStatus: status ? status.status : 'unknown',
  sourceFiles: main.count,
  siteFiles: pages.count,
}, null, 2));
