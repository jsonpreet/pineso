import Head from 'next/head'
import FrontPage from '@app/components/FrontPage'
import { Layout } from '@app/components/layout'

const Home = () => {
  return (
    <>
      <Layout>
        <FrontPage/>
      </Layout>
    </>
  )
}

export default Home
