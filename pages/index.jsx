import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import useApp from '@app/stores/store';
import Head from 'next/head';
import { BASE_URL } from "@app/lib/constants"

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
          <meta property="og:url" content={BASE_URL} />
          <meta property="og:title" content="Pineso" />
          <meta property="og:description" content="Build with Deso Blockchain" />
          <meta property="og:image" content={`${BASE_URL}/meta.png`} />
      </Head>
      <Layout>
          <Suspense fallback={<LoadingLoader message={`Loading Hot Pins for you.`} />}>
          {/* {isLoggedIn ? <FrontPage /> : <HotPage />} */}
          <HotPage />
          </Suspense>
      </Layout>
    </>
  )
}

export default Home
