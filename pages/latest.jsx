import Head from 'next/head'
import LatestPage from '@app/components/LatestPage'
import { Layout } from '@app/components/layout'

const Latest = () => {
  return (
    <>
      <Head>
        <title>Pineso</title>
        <meta name="description" content="Build with Deso Blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <LatestPage/>
      </Layout>
    </>
  )
}

export default Latest
