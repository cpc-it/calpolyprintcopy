function decodeHtmlEntities(value = '') {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function stripHtml(value = '') {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildMetaDescription(value, fallback = '', maxLength = 160) {
  const source = stripHtml(value) || stripHtml(fallback);

  if (!source) return '';
  if (source.length <= maxLength) return source;

  return `${source.slice(0, maxLength).trimEnd()}...`;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
}

export function absoluteUrl(path = '') {
  const siteUrl = getSiteUrl();
  if (!siteUrl || !path) return path;

  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return path;
  }
}
