import * as MENUS from 'constants/menus';

import { gql } from '@apollo/client';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import { buildMetaDescription, pageTitle } from 'utilities';

import {
  Header,
  Footer,
  Main,
  ContentWrapper,
  EntryHeader,
  NavigationMenu,
  FeaturedImage,
  HomepageSurveyPopup,
  SEO,
  Testimonials,
} from '../components';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';

// Client-only form to avoid SSR/client mismatch
const ContactForm = dynamic(() => import('components/ContactForm'), { ssr: false });

const TOKEN = '<!-- FORMSPREE_CONTACT -->';
const SLOT_HTML = '<div id="contact-form-slot"></div>';

// Portals the ContactForm into the placeholder div after mount.
function ContactFormIntoSlot() {
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(document.getElementById('contact-form-slot'));
  }, []);

  if (!slot) return null;

  return createPortal(<ContactForm />, slot);
}

export default function Component(props) {
  const router = useRouter();

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;

  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];

  // Footer menus
  const footerMenu  = props?.data?.footerMenuItems?.nodes ?? [];
  const quickLinks  = props?.data?.quickFooterMenuItems?.nodes ?? [];
  const aboutLinks  = props?.data?.aboutFooterMenuItems?.nodes ?? [];
  const navOne      = props?.data?.footerSecondaryMenuItems?.nodes ?? [];
  const navTwo      = props?.data?.footerTertiaryMenuItems?.nodes ?? [];
  const resources   = props?.data?.resourcesFooterMenuItems?.nodes ?? [];

  // Testimonials (for Footer)
  const testimonials = props?.data?.testimonials?.nodes ?? [];

  const page = props?.data?.page ?? { title: '' };
  const { title, content, featuredImage, seo: s } = page;
  const shouldShowSurveyPopup =
    page?.slug === 'submit-print-online' || page?.uri === '/submit-print-online/';

  const htmlWithSlot = (content ?? '').split(TOKEN).join(SLOT_HTML);

  // ---- Yoast → SEO props with smart fallbacks ----
  const computedTitle =
    s?.title ||
    pageTitle(
      props?.data?.generalSettings,
      title,
      props?.data?.generalSettings?.title
    );

  const computedDescription =
    s?.metaDesc ||
    buildMetaDescription(content, siteDescription) ||
    'Official site for Cal Poly Print & Copy.';

  const computedImageUrl =
    s?.opengraphImage?.mediaItemUrl ||
    featuredImage?.node?.sourceUrl ||
    '/static/banner.jpeg';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const computedCanonical =
    s?.canonical ||
    (baseUrl && router?.asPath ? `${baseUrl}${router.asPath}` : undefined);

  const ogType = s?.opengraphType || 'website';
  const ogSiteName = s?.opengraphSiteName || siteTitle;
  const noindex = Boolean(s?.metaRobotsNoindex);
  const nofollow = Boolean(s?.metaRobotsNofollow);

  return (
    <>
      <SEO
        title={computedTitle}
        description={computedDescription}
        imageUrl={computedImageUrl}
        url={computedCanonical}
        type={ogType}
        siteName={ogSiteName}
        noindex={noindex}
        nofollow={nofollow}
      />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      {shouldShowSurveyPopup && <HomepageSurveyPopup />}

      <Main>
        <EntryHeader title={title} image={featuredImage?.node} />

        <div className="container">
          <ContentWrapper content={htmlWithSlot} />
          <ContactFormIntoSlot />
        </div>
      </Main>

      <Footer
        siteTitle={siteTitle}
        menuItems={footerMenu}
        quickLinksMenuItems={quickLinks}
        navOneMenuItems={navOne}
        navTwoMenuItems={navTwo}
        resourcesMenuItems={resources}
        aboutMenuItems={aboutLinks}
        testimonials={testimonials}
      />
    </>
  );
}

const safeEnum = (v) => (typeof v === 'string' && v.length ? v : null);

Component.variables = ({ databaseId }, ctx) => {
  const header = safeEnum(MENUS.PRIMARY_LOCATION);
  const footer = safeEnum(MENUS.FOOTER_LOCATION);
  const quick = safeEnum(MENUS.QUICK_FOOTER_LOCATION);
  const about = safeEnum(MENUS.ABOUT_FOOTER_LOCATION);
  const sec = safeEnum(MENUS.FOOTER_SECONDARY_LOCATION);
  const tert = safeEnum(MENUS.FOOTER_TERTIARY_LOCATION);
  const res = safeEnum(MENUS.RESOURCES_FOOTER_LOCATION);

  return {
    databaseId,

    headerLocation: header,
    footerLocation: footer,
    quickFooterLocation: quick,
    aboutFooterLocation: about,
    footerSecondaryLocation: sec,
    footerTertiaryLocation: tert,
    resourcesFooterLocation: res,

    hasHeaderMenu: !!header,
    hasFooterMenu: !!footer,
    hasQuickFooterMenu: !!quick,
    hasAboutFooterMenu: !!about,
    hasFooterSecondaryMenu: !!sec,
    hasFooterTertiaryMenu: !!tert,
    hasResourcesFooterMenu: !!res,

    asPreview: !!ctx?.asPreview,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  ${Testimonials.fragments.entry}

  query GetPageData(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $quickFooterLocation: MenuLocationEnum
    $aboutFooterLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
    $resourcesFooterLocation: MenuLocationEnum

    $hasHeaderMenu: Boolean! = false
    $hasFooterMenu: Boolean! = false
    $hasQuickFooterMenu: Boolean! = false
    $hasAboutFooterMenu: Boolean! = false
    $hasFooterSecondaryMenu: Boolean! = false
    $hasFooterTertiaryMenu: Boolean! = false
    $hasResourcesFooterMenu: Boolean! = false

    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      slug
      uri
      content
      ...FeaturedImageFragment
      seo {
        title
        metaDesc
        canonical
        opengraphType
        opengraphSiteName
        opengraphImage {
          mediaItemUrl
        }
        metaRobotsNoindex
        metaRobotsNofollow
      }
    }

    testimonials {
      nodes {
        ...TestimonialsFragment
      }
    }

    generalSettings {
      ...BlogInfoFragment
    }

    headerMenuItems: menuItems(where: { location: $headerLocation }, first: 100)
      @include(if: $hasHeaderMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    footerMenuItems: menuItems(where: { location: $footerLocation }, first: 100)
      @include(if: $hasFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    quickFooterMenuItems: menuItems(where: { location: $quickFooterLocation }, first: 100)
      @include(if: $hasQuickFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    aboutFooterMenuItems: menuItems(where: { location: $aboutFooterLocation }, first: 100)
      @include(if: $hasAboutFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    footerSecondaryMenuItems: menuItems(where: { location: $footerSecondaryLocation }, first: 100)
      @include(if: $hasFooterSecondaryMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    footerTertiaryMenuItems: menuItems(where: { location: $footerTertiaryLocation }, first: 100)
      @include(if: $hasFooterTertiaryMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    resourcesFooterMenuItems: menuItems(where: { location: $resourcesFooterLocation }, first: 100)
      @include(if: $hasResourcesFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;
