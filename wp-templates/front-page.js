import * as MENUS from 'constants/menus';

import { useQuery, gql } from '@apollo/client';
import styles from 'styles/pages/_Home.module.scss';
import {
  Main,
  HomepageWelcome,
  HomepageVideo,
  HomepageSurveyPopup,
  NavigationMenu,
  SEO,
  Header,
  Footer,
  Posts,
  Testimonials,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';

const postsPerPage = 3;

export default function Component() {
  const { data, loading } = useQuery(Component.query, {
    variables: Component.variables(),
  });

  if (loading) return null;

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};

  const primaryMenu = data?.headerMenuItems?.nodes ?? [];

  // Footer menus
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const quickLinks = data?.quickFooterMenuItems?.nodes ?? [];
  const aboutLinks = data?.aboutFooterMenuItems?.nodes ?? [];
  const navOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const navTwo = data?.footerTertiaryMenuItems?.nodes ?? [];
  const resources = data?.resourcesFooterMenuItems?.nodes ?? [];

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <HomepageSurveyPopup />

      <HomepageVideo />

      <Main className={styles.home}>
        {/* <EntryHeader image={mainBanner} /> */}
        <div className="container">
          <HomepageWelcome />
        </div>
      </Main>

      <Footer
        title={siteTitle}
        menuItems={footerMenu}
        quickLinksMenuItems={quickLinks}
        navOneMenuItems={navOne}
        navTwoMenuItems={navTwo}
        resourcesMenuItems={resources}
        aboutMenuItems={aboutLinks}
        testimonials={data?.testimonials?.nodes}
      />
    </>
  );
}

const safeEnum = (v) => (typeof v === 'string' && v.length ? v : null);

Component.variables = () => {
  const header = safeEnum(MENUS.PRIMARY_LOCATION);
  const footer = safeEnum(MENUS.FOOTER_LOCATION);
  const quick = safeEnum(MENUS.QUICK_FOOTER_LOCATION);
  const about = safeEnum(MENUS.ABOUT_FOOTER_LOCATION);
  const sec = safeEnum(MENUS.FOOTER_SECONDARY_LOCATION);
  const tert = safeEnum(MENUS.FOOTER_TERTIARY_LOCATION);
  const res = safeEnum(MENUS.RESOURCES_FOOTER_LOCATION);

  return {
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

    first: postsPerPage,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${Posts.fragments.entry}
  ${Testimonials.fragments.entry}
  query GetPageData(
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

    $first: Int
  ) {
    posts(first: $first) {
      nodes {
        ...PostsItemFragment
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

    quickFooterMenuItems: menuItems(
      where: { location: $quickFooterLocation }
      first: 100
    ) @include(if: $hasQuickFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    aboutFooterMenuItems: menuItems(
      where: { location: $aboutFooterLocation }
      first: 100
    ) @include(if: $hasAboutFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    footerSecondaryMenuItems: menuItems(
      where: { location: $footerSecondaryLocation }
      first: 100
    ) @include(if: $hasFooterSecondaryMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    footerTertiaryMenuItems: menuItems(
      where: { location: $footerTertiaryLocation }
      first: 100
    ) @include(if: $hasFooterTertiaryMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }

    resourcesFooterMenuItems: menuItems(
      where: { location: $resourcesFooterLocation }
      first: 100
    ) @include(if: $hasResourcesFooterMenu) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;
