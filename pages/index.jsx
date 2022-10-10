import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import useApp from '@app/stores/store';

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
      <Layout>
        {isLoggedIn ? (
          <Suspense fallback={<LoadingLoader />}>
            <FrontPage />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingLoader />}>
            <HotPage />
          </Suspense>
        )}
        
      </Layout>
    </>
  )
}

export default Home
