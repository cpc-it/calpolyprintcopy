function getWordPressGraphqlUrl() {
  const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  if (!wordpressUrl) return '';

  try {
    return new URL('/graphql', wordpressUrl).toString();
  } catch {
    return '';
  }
}

async function fetchWordPressGraphQL(query) {
  const endpoint = getWordPressGraphqlUrl();
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`WordPress GraphQL request failed with ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors) {
    throw new Error('WordPress GraphQL returned errors');
  }

  return payload.data;
}

function toAbsoluteSiteUrl(siteUrl, uri = '/') {
  try {
    return new URL(uri, siteUrl).toString();
  } catch {
    return `${siteUrl}${uri}`;
  }
}

function normalizeEntries(siteUrl, nodes = []) {
  return nodes
    .filter((node) => node?.uri)
    .map((node) => ({
      loc: toAbsoluteSiteUrl(siteUrl, node.uri),
      lastmod: node.modified || undefined,
    }));
}

export async function getSitemapEntries(siteUrl) {
  const staticEntries = [
    { loc: toAbsoluteSiteUrl(siteUrl, '/') },
    { loc: toAbsoluteSiteUrl(siteUrl, '/posts') },
    { loc: toAbsoluteSiteUrl(siteUrl, '/projects') },
  ];

  try {
    const data = await fetchWordPressGraphQL(`
      query SeoSitemapData {
        pages(first: 500) {
          nodes {
            uri
            modified
          }
        }
        posts(first: 500) {
          nodes {
            uri
            modified
          }
        }
        projects(first: 500) {
          nodes {
            uri
            modified
          }
        }
        categories(first: 500) {
          nodes {
            uri
          }
        }
        tags(first: 500) {
          nodes {
            uri
          }
        }
      }
    `);

    const contentEntries = [
      ...normalizeEntries(siteUrl, data?.pages?.nodes),
      ...normalizeEntries(siteUrl, data?.posts?.nodes),
      ...normalizeEntries(siteUrl, data?.projects?.nodes),
      ...normalizeEntries(siteUrl, data?.categories?.nodes),
      ...normalizeEntries(siteUrl, data?.tags?.nodes),
    ];

    const uniqueEntries = Array.from(
      new Map(
        [...staticEntries, ...contentEntries].map((entry) => [entry.loc, entry])
      ).values()
    );

    return uniqueEntries;
  } catch {
    return staticEntries;
  }
}
