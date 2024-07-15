import React, { FC, ReactNode, StrictMode, useEffect, useState } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import '@/styles/globals.css'
import '@/styles/react-slick.css'
import '../config/locale/i18n';
import { Provider } from 'react-redux'
import { store } from '@/store'
import { META_DATA } from '@/constant';
import 'moment/locale/vi';
import moment from 'moment';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { AuthProvider } from '@/contexts/JWTContext';
import 'devextreme/dist/css/dx.light.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { LoaingAnimation } from '@/components/loading';
import '@/styles/loading.css'
import { Box, Button, Typography, useTheme } from "@mui/material";
import { LoadingAnimation } from '@/components/loading';
import useAuth from '@/hooks/useAuth';
import 'dayjs/locale/en';
import dayjs from 'dayjs';


export default function App({ Component, pageProps }: AppProps) {
  moment.locale('en')
  dayjs.locale('en');
const theme=useTheme()
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
        {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
        <title>{META_DATA.title}</title>
        <link rel="icon" href={META_DATA.icon} />
      </Head>

      <Provider store={store}>
        <ConfigProvider>
          <AuthProvider>
          <LoadingAnimation>
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme.palette.mode}
            />
             </LoadingAnimation>
          </AuthProvider>
        </ConfigProvider>
      </Provider>
    </>
  )
}
