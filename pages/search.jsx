import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BASE_URL } from '@app/lib/constants';

const SearchPage = dynamic(() => import('@app/components/pages/Search'), {
    ssr: false
})

const Search = () => {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Pineso</title>
                <meta property="og:url" content={BASE_URL} />
                <meta property="og:title" content="Pineso" />
                <meta property="og:description" content="Build with Deso Blockchain" />
                <meta property="og:image" content={`${BASE_URL}/meta.png`} />
            </Head>
            <Layout>
                <SearchPage />
            </Layout>
        </>
    )
}

export default Search
