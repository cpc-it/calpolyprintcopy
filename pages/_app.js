import '../faust.config';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { FaustProvider } from '@faustwp/core';
import 'normalize.css/normalize.css';
import '../styles/main.scss';
import ThemeStyles from 'components/ThemeStyles/ThemeStyles';
import useMediaTextReveal from 'hooks/useMediaTextReveal';
import { GA_MEASUREMENT_ID, pageview } from 'lib/gtag';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useMediaTextReveal([router.asPath]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    pageview(router.asPath);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
      <ThemeStyles />
      <FaustProvider pageProps={pageProps}>
        <Component {...pageProps} key={router.asPath} />
      </FaustProvider>
    </>
  );
}
