import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import Head from 'next/head';

const NFTPage = dynamic(() => import('@app/components/pages/NFT'), {
  suspense: true,
})

const NFT = () => {
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
        <Suspense fallback={<LoadingLoader/>}>
          <NFTPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default NFT
