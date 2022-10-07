
import NextNProgress from 'nextjs-progressbar';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Devtools from '@app/components/devtools';
import '@styles/globals.css';
import '@styles/app.scss';
import { config } from '@app/lib/constants';
import { Suspense, useState } from 'react';


function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient(config));
  return (
    <>
      <NextNProgress color="#5634ee" showOnShallow={true} />
      <ThemeProvider enableSystem={true} attribute="class">
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Suspense fallback={<div>Loading...</div>}> 
              <Component {...pageProps} />
            </Suspense>
            <Devtools />
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp
