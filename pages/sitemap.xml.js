import { getSitemapEntries } from 'lib/wordpressSeo';
import { getSiteUrl } from 'utilities';

function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSitemapXml(entries) {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : '';

      return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}</url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export async function getServerSideProps({ res }) {
  const siteUrl = getSiteUrl();
  const entries = siteUrl ? await getSitemapEntries(siteUrl) : [];

  res.setHeader('Content-Type', 'application/xml');
  res.write(buildSitemapXml(entries));
  res.end();

  return {
    props: {},
  };
}

export default function SitemapXml() {
  return null;
}
