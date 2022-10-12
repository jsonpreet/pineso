import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import { useRouter } from 'next/router';

const SearchPage = dynamic(() => import('@app/components/pages/Search'), {
    ssr: false
})

const Search = () => {
    const router = useRouter()
    return (
        <>
            <Layout>
                <SearchPage />
            </Layout>
        </>
    )
}

export default Search
