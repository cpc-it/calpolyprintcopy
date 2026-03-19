import Link from 'next/link';
import { LoadingSearchResult } from 'components';
import { FaSearch } from 'react-icons/fa';

import styles from './SearchResults.module.scss';

const SNIPPET_RADIUS = 130;
const SNIPPET_MIN = 200;
const SNIPPET_MAX = 300;

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const decodeHtmlEntities = (value) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const stripHtml = (value) =>
  decodeHtmlEntities(
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const findMatch = (text, query) => {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!terms.length) return null;

  const lowerText = text.toLowerCase();
  let bestIndex = -1;
  let bestTerm = '';

  terms.forEach((term) => {
    const idx = lowerText.indexOf(term.toLowerCase());
    if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
      bestIndex = idx;
      bestTerm = term;
    }
  });

  if (bestIndex === -1) return null;

  return { index: bestIndex, term: bestTerm };
};

const buildSnippet = (html, query) => {
  const plain = stripHtml(html ?? '');
  if (!plain) return '';

  const trimmedLength = clamp(plain.length, SNIPPET_MIN, SNIPPET_MAX);
  if (!query?.trim()) {
    const needsEllipsis = plain.length > trimmedLength;
    const snippet = plain.slice(0, trimmedLength);
    return `${escapeHtml(snippet)}${needsEllipsis ? '&hellip;' : ''}`;
  }

  const match = findMatch(plain, query);
  if (!match) {
    const needsEllipsis = plain.length > trimmedLength;
    const snippet = plain.slice(0, trimmedLength);
    return `${escapeHtml(snippet)}${needsEllipsis ? '&hellip;' : ''}`;
  }

  const start = Math.max(0, match.index - SNIPPET_RADIUS);
  const end = Math.min(
    plain.length,
    match.index + match.term.length + SNIPPET_RADIUS
  );
  const snippet = plain.slice(start, end);
  const matchStart = match.index - start;
  const matchEnd = matchStart + match.term.length;

  const prefix = escapeHtml(snippet.slice(0, matchStart));
  const hit = escapeHtml(snippet.slice(matchStart, matchEnd));
  const suffix = escapeHtml(snippet.slice(matchEnd));

  const leadingEllipsis = start > 0 ? '&hellip;' : '';
  const trailingEllipsis = end < plain.length ? '&hellip;' : '';

  return `${leadingEllipsis}${prefix}<mark>${hit}</mark>${suffix}${trailingEllipsis}`;
};

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @returns {React.ReactElement} The SearchResults component.
 */
export default function SearchResults({ searchResults, isLoading, searchQuery }) {
  if (!isLoading && searchResults === undefined) {
    return null;
  }

  if (!isLoading && !searchResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    );
  }

  return (
    <>
      {searchResults?.map((node) => (
        <div key={node.databaseId} className={styles.result}>
          <Link href={node.uri}>
            <h2 className={styles.title}>{node.title}</h2>
          </Link>

          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{
              __html: buildSnippet(node.excerpt || node.content, searchQuery),
            }}
          />
        </div>
      ))}

      {isLoading === true && (
        <>
          <LoadingSearchResult />
          <LoadingSearchResult />
          <LoadingSearchResult />
        </>
      )}
    </>
  );
}
