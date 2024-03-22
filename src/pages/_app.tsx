import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import '@/styles/globals.css'
import '@/styles/react-slick.css'
import '../config/locale/i18n';
import ThemeCustomization from '@/config/theme'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { META_DATA } from '@/constant';
import 'moment/locale/vi';
import moment from 'moment';

export default function App({ Component, pageProps }: AppProps) {
  moment.locale('vi')

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1FC7D4" />
        <meta name="twitter:title" content={META_DATA.title} />
        <meta name="twitter:image" content={META_DATA.image} />
        <meta name="description" content={META_DATA.description} />
        <meta name="msapplication-navbutton-color" content="#fbfbfb" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#fbfbfb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:title" content={META_DATA.title} />
        <meta property="og:description" content={META_DATA.description} />
        <meta property="og:image" content={META_DATA.image} />
        <meta property="og:url" content={META_DATA.url} />
        <title>{META_DATA.title}</title>
        <link rel="icon" href={META_DATA.icon} />
      </Head>
      <Provider store={store}>
        <ThemeCustomization>
         
            <Component {...pageProps} />
        
        </ThemeCustomization>
      </Provider>
    </>
  )
}
