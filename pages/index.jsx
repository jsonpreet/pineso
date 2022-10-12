import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import useApp from '@app/stores/store';
import Head from 'next/head';

const HotPage = dynamic(() => import('@app/components/pages/Hot'), {
  suspense: true,
})

const FrontPage = dynamic(() => import('@app/components/pages/Front'), {
  suspense: true,
})

const Home = () => {
  const isLoggedIn = useApp((state) => state.isLoggedIn)
  return (
    <>
      <Head>
          <title>Pineso</title>
          <meta property="og:url" content="https://pineso.io" />
          <meta property="og:title" content="Pineso" />
          <meta property="og:description" content="Build with Deso Blockchain" />
          <meta property="og:image" content="https://pineso.io/images/icon-512x512.png" />
      </Head>
      <Layout>
          <Suspense fallback={<LoadingLoader message={`${isLoggedIn ? `Loading Following Pins for you.` : `Loading Hot Pins for you.`}`} />}>
            {isLoggedIn ? <FrontPage /> : <HotPage />}
          </Suspense>
      </Layout>
    </>
  )
}

export default Home
