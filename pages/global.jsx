import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const GlobalPage = dynamic(() => import('@app/components/pages/Global'), {
  suspense: true,
})

const HotPage = () => {
  return (
    <>
      <Layout>
        <Suspense fallback={<LoadingLoader/>}>
          <GlobalPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default HotPage
