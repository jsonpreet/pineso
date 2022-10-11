
import NextNProgress from 'nextjs-progressbar';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Devtools from '@app/components/devtools';
import '@styles/globals.css';
import '@styles/app.scss';
import { config } from '@app/lib/constants';
import { Suspense, useState } from 'react';
import Head from 'next/head';
import { NextUIProvider } from '@nextui-org/react';


function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient(config));
  return (
    <>
      <Head>
          <title>Pineso</title>
      </Head>
      <NextNProgress color="#5634ee" showOnShallow={true} />
      <ThemeProvider enableSystem={true} attribute="class">
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <NextUIProvider>
              <Component {...pageProps} />
            </NextUIProvider>
            <Devtools />
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp
