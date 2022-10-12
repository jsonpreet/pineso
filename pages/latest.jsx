import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import Head from 'next/head';

const LatestPage = dynamic(() => import('@app/components/pages/Latest'), {
  suspense: true,
})

const Latest = () => {
  return (
    <>
      
      <Head>
          <title>Pineso</title>
          <meta property="og:url" content={BASE_URL} />
          <meta property="og:title" content="Pineso" />
          <meta property="og:description" content="Build with Deso Blockchain" />
          <meta property="og:image" content="/images/icon-512x512.png" />
      </Head>
      <Layout>
        <Suspense fallback={<LoadingLoader/>}>
          <LatestPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default Latest
