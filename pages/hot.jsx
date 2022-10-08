import Head from 'next/head'
import FrontPage from '@app/components/HotPage'
import { Layout } from '@app/components/layout'

const HotPage = () => {
  return (
    <>
      <Layout>
        <FrontPage/>
      </Layout>
    </>
  )
}

export default HotPage
