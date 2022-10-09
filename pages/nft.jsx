import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const NFTPage = dynamic(() => import('@app/components/pages/NFT'), {
  suspense: true,
})

const NFT = () => {
  return (
    <>
      <Layout>
        <Suspense fallback={<LoadingLoader/>}>
          <NFTPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default NFT
