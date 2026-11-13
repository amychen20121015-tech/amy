import original from './homepage.html?raw';

// Each Markdown file contains one card, including its original HTML formatting.
const migrated = import.meta.glob('./articles/*.md', { eager: true, query: '?raw', import: 'default' });
const firstFiles = ['first-grade-mom.md', 'emotions-before-numbers.md', 'little-prince-2024.md'];
const migratedByPosition = new Map();
for (const [path, markup] of Object.entries(migrated)) {
  const filename = path.split('/').pop();
  const firstPosition = firstFiles.indexOf(filename);
  const position = firstPosition >= 0 ? firstPosition + 1 : Number(filename.match(/^(\d{3})-/)?.[1]);
  if (!position || migratedByPosition.has(position)) throw new Error(`Invalid article filename: ${filename}`);
  migratedByPosition.set(position, markup);
}
let position = 0;
const source = original.replace(/<article\b[^>]*\bdata-category="[^"]+"[^>]*>[\s\S]*?<\/article>/g, () => {
  position += 1;
  const markup = migratedByPosition.get(position);
  if (!markup) throw new Error(`Missing article file at position ${position}`);
  return markup;
});
if (position !== migratedByPosition.size) throw new Error('Article file count does not match the homepage');

// Derive cards and full pages from the same article content.
export const articles = [];
export const homepage = source.replace(/<article\b([^>]*)>([\s\S]*?)<\/article>/g, (markup, attributes, content) => {
  const id = attributes.match(/\bid="([^"]+)"/)?.[1];
  const details = content.match(/<details\b[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/);
  const title = content.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1];
  if (!id || !details || !title) return markup;
  const prefix = content.slice(0, details.index);
  const heading = prefix.match(/<p class="category">[\s\S]*?<\/p>/)?.[0] ?? '';
  const media = prefix.replace(/<h3\b[^>]*>[\s\S]*?<\/h3>/, '').replace(heading, '');
  articles.push({ id, title, heading, media, body: details[2] });
  return markup.replace(details[0], `<a class="article-read-link" href="/articles/${id}/">${details[1]}</a>`);
});

export function absoluteLinks(html) {
  return html.replace(/\b(src|href|poster)="([^"\s]+)"/g, (match, attribute, value) => {
    if (/^(?:[a-z]+:|\/)/i.test(value)) return match;
    return `${attribute}="/${value}"`;
  });
}

export const siteHeader = absoluteLinks(original.match(/<header>[\s\S]*?<\/header>/)?.[0] ?? '');
