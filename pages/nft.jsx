import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import Head from 'next/head';
import { BASE_URL } from "@app/lib/constants"

const NFTPage = dynamic(() => import('@app/components/pages/NFT'), {
  suspense: true,
})

const NFT = () => {
  return (
    <>
      <Head>
          <title>Pineso</title>
          <meta property="og:url" content={BASE_URL} />
          <meta property="og:title" content="Pineso" />
          <meta property="og:description" content="Build with Deso Blockchain" />
        <meta property="og:image" content={`${BASE_URL}/images/icons/icon-512x512.png`} />
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
