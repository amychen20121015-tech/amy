import original from './homepage.html?raw';

// Keep the original copy in one place; derive cards and full pages together.
export const articles = [];
export const homepage = original.replace(/<article\b([^>]*)>([\s\S]*?)<\/article>/g, (markup, attributes, content) => {
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
