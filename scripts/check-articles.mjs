import fs from 'node:fs';
import assert from 'node:assert/strict';
const home = fs.readFileSync('dist/index.html', 'utf8');
const original = fs.readFileSync('src/content/homepage.html', 'utf8');
const links = [...home.matchAll(/class="article-read-link" href="([^"]+)"/g)];
assert.equal(links.length, 65);
assert.equal((home.match(/<summary[^>]*>閱讀/g) || []).length, 0);
for (const [, link] of links) {
  const html = fs.readFileSync(`dist${link}index.html`, 'utf8');
  assert(html.includes('返回手札列表'));
  assert(html.includes('article-body'));
  for (const [, src] of html.matchAll(/(?:src|poster)="([^"]+)"/g)) {
    if (src.startsWith('/') && !src.startsWith('//')) assert(fs.existsSync(`dist${src}`), src);
  }
  const slug = link.split('/')[2];
  const sourceArticle = [...original.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].find(m => m[1].includes(`id="${slug}"`));
  const body = sourceArticle[2].match(/<details\b[^>]*>\s*<summary[^>]*>[\s\S]*?<\/summary>([\s\S]*?)<\/details>/)[1];
  const words = s => s.replace(/<[^>]*>/g, '').replace(/\s/g, '');
  assert(words(html).includes(words(body)), `Missing content: ${slug}`);
}
console.log('Verified 65 standalone pages: complete original text, local media, and return links. No inline reading summaries remain.');
