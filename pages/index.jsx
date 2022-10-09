import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const HotPage = dynamic(() => import('@app/components/pages/Hot'), {
  suspense: true,
})

const Home = () => {
  return (
    <>
      <Layout>
        <Suspense fallback={<LoadingLoader/>}>
          <HotPage />
        </Suspense>
      </Layout>
    </>
  )
}

export default Home
