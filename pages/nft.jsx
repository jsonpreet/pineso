import Head from 'next/head'
import NFTPage from '@app/components/NFTPage'
import { Layout } from '@app/components/layout'

const NFT = () => {
  return (
    <>
      <Layout>
        <NFTPage/>
      </Layout>
    </>
  )
}

export default NFT
