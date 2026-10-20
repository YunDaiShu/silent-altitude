/**
 * Single content source for the template.
 * Swap the values here; no other file carries copy.
 */
const site = {
  name: 'Yun Daishu',
  nameCn: '云戴舒',
  role: 'Independent Art Director',
  roleCn: '独立艺术指导 · 影像与品牌叙事',
  year: '2026',

  bio:
    '以克制为方法，替品牌与空间梳理叙事。镜头与字距是我仅有的两种语汇：' +
    '前者记录光的走向，后者安放阅读的呼吸。长期停驻深圳，每年只接受少量委托。',

  heroTitle: 'SILENT ALTITUDE',

  quote: {
    cn: '大成若缺，其用不弊。大盈若冲，其用不穷。',
    en: 'What is perfect seems flawed, yet its use never wears out. What is full seems empty, yet its use never ends.',
    source: '《道德经》第四十五章',
  },

  works: [
    { index: '01', title: 'Quiet Frame', category: 'Brand Identity', year: '2026' },
    { index: '02', title: '北岸光影', category: 'Spatial Narrative', year: '2025' },
    { index: '03', title: 'Salt & Silence', category: 'Editorial Design', year: '2025' },
    { index: '04', title: '归舟小记', category: 'Film & Motion', year: '2024' },
    { index: '05', title: 'Aurum Study', category: 'Art Direction', year: '2024' },
  ],

  posts: [
    {
      title: '关于留白的三则笔记',
      date: '2026.08.14',
      excerpt: '留白不是空缺，是尚未被命名的秩序。',
    },
    {
      title: '在深圳拍了一场无声的雨',
      date: '2026.06.02',
      excerpt: '把机器的温度调低两度，光才愿意停下来。',
    },
    {
      title: '黑金之后，我选择了更少的颜色',
      date: '2026.03.21',
      excerpt: '当颜色减到一个，剩下的是材质、比例与呼吸。',
    },
  ],

  contact: {
    email: 'studio@zhaoyu.design',
    github: 'https://github.com/zhaoyu',
    x: 'https://x.com/zhaoyu',
  },

  assets: {
    // Relative on purpose: the same build works at a domain root and under a
    // sub-path (GitHub Pages project sites, CloudBase, EdgeOne Pages).
    heroVideo: 'media/hero.webm',
    heroVideoFallback: 'media/hero.mp4',
    heroPoster: 'media/hero-poster.jpg',
    lanyardFront: 'lanyard/card-front.png',
    lanyardBack: 'lanyard/card-back.png',
    lanyardStrap: 'lanyard/strap.png',
  },

  signature: '二〇二六年秋 题于深圳',
};

export default site;
