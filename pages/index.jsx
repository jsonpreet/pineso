import Head from 'next/head'
import FrontPage from '@app/components/FrontPage'
import { Layout } from '@app/components/layout'
import useApp from '@app/stores/store'
import HotPage from '@app/components/HotPage'

const Home = () => {
  const user = useApp((state) => state.user)
  const isLoggedIn = useApp((state) => state.isLoggedIn)
  return (
    <>
      <Layout>
        { isLoggedIn ? <FrontPage/> : <HotPage/> }
      </Layout>
    </>
  )
}

export default Home
