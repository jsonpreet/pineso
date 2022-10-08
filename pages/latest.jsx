import Head from 'next/head'
import LatestPage from '@app/components/LatestPage'
import { Layout } from '@app/components/layout'

const Latest = () => {
  return (
    <>
      <Layout>
        <LatestPage/>
      </Layout>
    </>
  )
}

export default Latest
