import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const LatestPage = dynamic(() => import('@app/components/pages/Latest'), {
  suspense: true,
})

const Latest = () => {
  return (
    <>
      <Layout>
        <Suspense fallback={<LoadingLoader/>}>
          <LatestPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default Latest
