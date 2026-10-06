## Update staging env.local
# Cal Poly Print & Copy

This repository contains the Next.js frontend for the Cal Poly Print & Copy website. It is a headless WordPress application built with Faust.js: WordPress provides content over GraphQL, and this app renders the public site.

## What The Project Does

The frontend currently provides:

- A WordPress-driven homepage via the `front-page` template
- Dynamic WordPress page rendering through Faust catch-all routes
- Blog post listing and single-post pages
- A custom `Project` content type archive and single template
- Archive pages for content types, categories, and tags
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
- `pages/posts` and `pages/projects` are custom Next.js routes with explicit GraphQL queries
- `faust.config.js` registers custom Faust plugins:
  - `ProjectTemplatePlugin` adds the `project` template for `Project` nodes
  - `RelayStylePaginationPlugin` enables Apollo relay-style pagination for posts and projects
- `constants/menus.js` defines the WordPress menu locations the app expects

## Prerequisites

- Node.js `22.x`
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
  - WP Engine selects Node.js from `engines.node` in `package.json`. This project uses `22.x`, one of the builder's supported versions (`22` and `24`).
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
| `NEXT_PUBLIC_SITE_URL` | Required for production-quality SEO metadata | Used in `components/SEO/SEO.js`, `wp-templates/page.js`, and `wp-templates/front-page.js` to build canonical URLs and structured-data URLs. Documented in `.env.local.sample`. |

## Landing Page Source Of Truth (Single-Page Site)

This site is being positioned as a single landing page for Cal Poly Print & Copy that routes users to a third-party online ordering system.

- Canonical landing URL: `https://calpolyprintcopy.com/`
- Primary conversion URL (third-party ordering): `https://calpoly.webdeskprint.com/PSP/app/`
- Indexed business name: `Cal Poly Print & Copy`
- Address:
  - Robert E. Kennedy Library
  - 1 Grand Ave., Building 35
  - San Luis Obispo, CA 93407
- Contact email: `calpolyprints@calpoly.edu`
- Hours (current): Tuesday - Thursday, 9:00 AM - 1:00 PM
- Service area wording: On-campus, San Luis Obispo, and countywide (San Luis Obispo County)
- Audience priority: students, faculty/staff, public
- Services:
  - Basic Copies
  - Banners
  - Booklets/Programs
  - Brochures
  - Graphic Design Only
  - NCR / Carbonless
  - Post Cards
  - Posters
  - Signage
- Brand messaging baseline:
  - Cal Poly Print & Copy is your print solutions center. Conveniently located in Building 35, we specialize in small and large format prints for presentations, events, and the classroom. With easy online ordering and flexible hours, Cal Poly Print & Copy is the premier solution for your printing needs.
- Primary image/logo used in metadata and schema:
  - `/logo.png` (served on canonical domain)

All of this is centralized in `constants/landingPageSeo.js`.

## SEO, AEO, And GEO Implementation

### SEO (Search Engine Optimization)

- Homepage title, description, canonical URL, image, and OG/Twitter metadata are provided via `SEO` on `wp-templates/front-page.js`.
- `components/SEO/SEO.js` supports multiple JSON-LD blocks and renders them into `<head>`.
- `NEXT_PUBLIC_SITE_URL` is used as the authoritative base URL for canonical and schema URLs.

### AEO (Answer Engine Optimization)

- 40 operational customer Q&A entries are defined in `LANDING_PAGE_FAQS` in `constants/landingPageSeo.js`.
- FAQ answers are rendered visibly in `components/HomepageAnswers/HomepageAnswers.js` using semantic `<details>/<summary>` blocks.
- FAQ schema is emitted as `FAQPage` in `buildLandingSchemas`.

### GEO (Generative Engine Optimization)

- Entity, location, and service details are normalized in `LANDING_PAGE` and reused across UI and schema.
- Structured schema graph includes:
  - `WebPage`
  - `LocalBusiness` with geo, address, opening hours, service area, and service catalog
  - `FAQPage`
- A dedicated citation-ready quick facts block (`LANDING_PAGE_CITATION_FACTS`) is rendered in `HomepageAnswers` as "Quick Facts For AI Citations" to improve extractability for generative systems.

### Conversion Tracking And Attribution

- Order links are UTM-tagged via `withOrderUtm` in `constants/landingPageSeo.js`:
  - `utm_source=calpolyprintcopy.com`
  - `utm_medium=referral`
  - `utm_campaign=landing_page`
  - `utm_content=<button-placement>`
- Outbound order CTA clicks fire GA4 events (`order_click`) from:
  - `components/HomepageAnswers/HomepageAnswers.js` (`event_label: answers_section`)

## Important Directories And Files

- `pages/`
  - Next.js routes, including Faust catch-all routes and `/api/faust`
- `wp-templates/`
  - React templates used by Faust for WordPress nodes
- `components/`
  - Shared UI, including header, footer, posts/projects lists, SEO, and the Formspree contact form
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
- The app uses `fallback: 'blocking'` for WordPress catch-all routes in `pages/[...wordpressNode].js`

## Known Gaps And Verified TODOs

- `Footer` currently renders `menuItems`, `navTwoMenuItems`, `resourcesMenuItems`, and `testimonials`, but some templates query additional footer menu groups (`quick`, `about`, `navOne`) that are not rendered
- Several templates pass `title={siteTitle}` into `Footer`, while `Footer` expects `siteTitle`; on those routes it falls back to the hardcoded text `Cal Poly Print and Copy`
- Homepage content is centralized in `constants/landingPageSeo.js` and rendered in React components; this content is not sourced from WordPress
- The contact form’s Formspree form ID is hardcoded rather than configured via environment variables
- Linting runs successfully, but `npm run lint` reports Next.js warnings about `Link` usage (`passHref`) and page-level custom font tags in `components/SEO/SEO.js`

## What Is Still Unclear

- The exact production deployment target and release process are not documented in this repo
- I did not verify the live WordPress schema or content, so this README only describes what the frontend code expects
