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
          <Suspense fallback={<LoadingLoader message={`${isLoggedIn ? `Loading Following Pins for you.` : `Loading Hot Pins for you.`}`} />}>
            {isLoggedIn ? <FrontPage /> : <HotPage />}
          </Suspense>
      </Layout>
    </>
  )
}

export default Home
