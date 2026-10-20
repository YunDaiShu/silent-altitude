// Builds a truly double-clickable single-file page: no server, no sibling files.
// Strategy: one JS chunk (inlineDynamicImports), CSS not split, then inline both
// plus the three card images as data URLs into one HTML document.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, '.single-tmp');

await build({
  configFile: false,
  root,
  base: './',
  plugins: [react()],
  logLevel: 'warn',
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: { output: { inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: 'app.[ext]' } },
  },
});

const html = await fs.readFile(path.join(outDir, 'index.html'), 'utf8');
let js = await fs.readFile(path.join(outDir, 'app.js'), 'utf8');
const css = await fs.readFile(path.join(outDir, 'app.css'), 'utf8');

// Config values are runtime strings, so Vite never rewrites these absolute
// public paths. In a file:// document they must be relative to the HTML.
js = js.split('"/media/').join('"./media/').split("'/media/").join("'./media/");

for (const name of ['card-front.png', 'card-back.png', 'strap.png']) {
  const b64 = (await fs.readFile(path.join(root, 'public', 'lanyard', name))).toString('base64');
  const data = 'data:image/png;base64,' + b64;
  // matches 'lanyard/x.png', './lanyard/x.png' and '/lanyard/x.png' alike
  js = js.split('lanyard/' + name).join(data);
}

// Index-based replacement: attribute order and spacing in the emitted tags vary,
// so a regex over the whole tag is brittle.
const cut = (text, openAt, closeToken) => {
  const start = text.indexOf(openAt);
  if (start < 0) return null;
  const end = text.indexOf(closeToken, start);
  if (end < 0) return null;
  return { start, end: end + closeToken.length };
};

let out = html;
const scriptSpan = cut(out, '<script', '</script>');
if (!scriptSpan) throw new Error('no script tag in built html');
out = out.slice(0, scriptSpan.start) + '<script type="module">\n' + js.replace(/<\/script/gi, '<\\/script') + '\n</script>' + out.slice(scriptSpan.end);

const linkSpan = cut(out, '<link rel="stylesheet"', '>');
if (!linkSpan) throw new Error('no stylesheet link in built html');
out = out.slice(0, linkSpan.start) + '<style>\n' + css + '\n</style>' + out.slice(linkSpan.end);

if (out.includes('src="./app.js"') || out.includes('href="./app.css"')) throw new Error('inlining incomplete');

// Video cannot be inlined into a single HTML document, so the media folder is
// mirrored next to the output file and the './media/...' paths resolve there.
for (const [from, to] of [['media', 'media'], ['lanyard', 'lanyard']]) {
  const src = path.join(root, 'public', from);
  const dst = path.join(root, to);
  const files = await fs.readdir(src).catch(() => []);
  for (const name of files) {
    if (name === '.gitkeep') continue;
    await fs.mkdir(dst, { recursive: true });
    await fs.copyFile(path.join(src, name), path.join(dst, name));
  }
}

const target = path.join(root, 'silent-altitude.html');
await fs.writeFile(target, out, 'utf8');
await fs.rm(outDir, { recursive: true, force: true });
console.log('OK ' + target + ' ' + Math.round(out.length / 1024) + 'KB');
