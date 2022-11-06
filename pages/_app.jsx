
import NextNProgress from 'nextjs-progressbar';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Devtools from '@app/components/devtools';
import '@styles/globals.css';
import '@styles/app.scss';
import { config, FEEDER_PROJECT_ID } from '@app/lib/constants';
import { Suspense, useState } from 'react';
import Head from 'next/head';
import { NextUIProvider } from '@nextui-org/react';
import loadable from "@loadable/component";
const Feedback = loadable(() => import("feeder-react-feedback/dist/Feedback"));

import { Analytics } from '@vercel/analytics/react';


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
            <Feedback primaryColor='#ec05ad' hoverBorderColor='#ec05ad' projectId={FEEDER_PROJECT_ID} />
            <Devtools />
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default MyApp
