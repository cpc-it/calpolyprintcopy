# Cal Poly Print & Copy

This repository contains the Next.js frontend for the Cal Poly Print & Copy website. It is a headless WordPress application built with Faust.js: WordPress provides content over GraphQL, and this app renders the public site.

## What The Project Does

The frontend currently provides:

- A WordPress-driven homepage via the `front-page` template
- Dynamic WordPress page rendering through Faust catch-all routes
- Blog post listing and single-post pages
- A custom `Project` content type archive and single template
- Archive pages for content types, categories, and tags
- A client-side search page backed by the WordPress GraphQL `contentNodes` query
- Faust preview and API routes under `pages/api/faust`

In addition to WordPress content, some homepage messaging is hardcoded in React components, including operating hours, closure notices, and the homepage CTA text.

## Stack And Architecture

- Next.js 14
- React 18
- FaustWP / `@faustwp/core`
- Apollo Client + GraphQL
- Sass modules + global SCSS
- Formspree for the embedded contact form

High-level architecture:

- `pages/index.js` and `pages/[...wordpressNode].js` hand routing off to `WordPressTemplate`
- `wp-templates/` maps WordPress template types to React templates (`front-page`, `page`, `single`, `project`, `archive`)
- `pages/posts`, `pages/projects`, and `pages/search` are custom Next.js routes with explicit GraphQL queries
- `faust.config.js` registers custom Faust plugins:
  - `ProjectTemplatePlugin` adds the `project` template for `Project` nodes
  - `RelayStylePaginationPlugin` enables Apollo relay-style pagination for posts, projects, and search results
- `constants/menus.js` defines the WordPress menu locations the app expects

## Prerequisites

- Node.js `20.x`
- npm `10.x`
- A WordPress backend reachable at `NEXT_PUBLIC_WORDPRESS_URL`
- A WordPress setup compatible with Faust.js and the GraphQL queries used here
- If you are creating or refreshing the backend content model, `DEVELOPMENT.md` documents importing `acm-blueprint.zip` into WordPress with Atlas Content Modeler and Faust

From the code, this frontend expects WordPress content and schema for:

- Standard pages and posts
- A `Project` content type with `projectFields`
- A `Testimonial` content type with `testimonialFields`
- Menu locations named `PRIMARY`, `FOOTER`, `FOOTER_SECONDARY`, `FOOTER_TERTIARY`, `RESOURCES_FOOTER`, `QUICK_FOOTER`, and `ABOUT_FOOTER`

## Install And Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local env file from the sample:

   ```bash
   cp .env.local.sample .env.local
   ```

3. Set the required environment variables in `.env.local`
4. Start the local development server:

   ```bash
   npm run dev
   ```

If the WordPress backend does not already contain the expected content types and menus, use the instructions in `DEVELOPMENT.md` to import the bundled blueprint into WordPress.

## Local Development Commands

```bash
npm run dev           # start Faust/Next development server
npm run build         # production build
npm run start         # start the production server after build
npm run generate      # regenerate GraphQL possibleTypes.json
npm run lint          # run Faust/Next linting
npm run format        # run Prettier write
npm run format:check  # run Prettier check
npm run clean         # remove .next and node_modules
```

## Build, Test, And Deploy

- Build: `npm run build`
- Production start: `npm run start`
- WP Engine build alias: `npm run wpe-build`
  - This is currently just an alias for `faust build`
- Tests:
  - There is no `test` script or automated test suite configured in `package.json`
- Deploy:
  - I did not find deployment automation, CI workflows, or host-specific config files in this repo
  - The presence of `wpe-build` suggests an external platform may call that script, but the deployment process itself is not documented here

## Environment Variables

Variables verified from the repo:

| Variable | Status | Used For |
| --- | --- | --- |
| `NEXT_PUBLIC_WORDPRESS_URL` | Required | Faust/WordPress backend URL. Present in `.env.local.sample`. |
| `FAUST_SECRET_KEY` | Required for Faust preview/API flows | Present in `.env.local.sample`; used by the Faust integration and preview/API route setup. |
| `NEXT_PUBLIC_SITE_URL` | Used by the app, but missing from `.env.local.sample` | Used in `components/SEO/SEO.js` and `wp-templates/page.js` to build canonical URLs and structured-data URLs. If omitted, canonical URLs and some schema URLs are not generated. |

## Important Directories And Files

- `pages/`
  - Next.js routes, including Faust catch-all routes and `/api/faust`
- `wp-templates/`
  - React templates used by Faust for WordPress nodes
- `components/`
  - Shared UI, including header, footer, posts/projects lists, SEO, and the Formspree contact form
- `queries/GetSearchResults.js`
  - Search GraphQL query used by `/search`
- `plugins/`
  - Custom Faust plugins for template selection and Apollo pagination
- `constants/menus.js`
  - WordPress menu location constants
- `app.config.js`
  - Pagination sizes, image-preload thresholds, theme color, and social links
- `faust.config.js`
  - Faust configuration and plugin registration
- `next.config.js`
  - Next.js config, Faust wrapper, image domains, and i18n
- `.env.local.sample`
  - Sample environment file
- `DEVELOPMENT.md`
  - WordPress blueprint import/export workflow
- `acm-blueprint.zip`
  - Bundled Atlas Content Modeler blueprint export

## Runtime Notes

- The page template injects the React contact form into WordPress page content when the page HTML contains `<!-- FORMSPREE_CONTACT -->`
- The contact form submits to Formspree using a hardcoded form ID in `components/ContactForm/ContactForm.js`
- Search is client-side and only runs after a user enters a query
- The app uses `fallback: 'blocking'` for WordPress catch-all routes in `pages/[...wordpressNode].js`

## Known Gaps And Verified TODOs

- `.env.local.sample` does not document `NEXT_PUBLIC_SITE_URL`, even though the code references it for SEO/canonical behavior
- `Footer` currently renders `menuItems`, `navTwoMenuItems`, `resourcesMenuItems`, and `testimonials`, but some templates query additional footer menu groups (`quick`, `about`, `navOne`) that are not rendered
- Several templates pass `title={siteTitle}` into `Footer`, while `Footer` expects `siteTitle`; on those routes it falls back to the hardcoded text `Cal Poly Print and Copy`
- Homepage business notices and the CTA target are hardcoded in `components/HomepageVideo/HomepageVideo.js`, not sourced from WordPress content
- The contact form’s Formspree form ID is hardcoded rather than configured via environment variables
- Linting runs successfully, but `npm run lint` reports Next.js warnings about `Link` usage (`passHref`) and page-level custom font tags in `components/SEO/SEO.js`

## What Is Still Unclear

- The exact production deployment target and release process are not documented in this repo
- I did not verify the live WordPress schema or content, so this README only describes what the frontend code expects
