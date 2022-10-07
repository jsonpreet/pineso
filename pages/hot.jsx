import Head from 'next/head'
import FrontPage from '@app/components/FrontPage'
import { Layout } from '@app/components/layout'

const HotPage = () => {
  return (
    <>
      <Head>
        <title>Pineso</title>
        <meta name="description" content="Build with Deso Blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <FrontPage/>
      </Layout>
    </>
  )
}

export default HotPage
