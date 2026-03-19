import { getSiteUrl } from 'utilities';

export async function getServerSideProps({ res }) {
  const siteUrl = getSiteUrl();
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /search',
  ];

  if (siteUrl) {
    lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  }

  res.setHeader('Content-Type', 'text/plain');
  res.write(`${lines.join('\n')}\n`);
  res.end();

  return {
    props: {},
  };
}

export default function RobotsTxt() {
  return null;
}
