
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const TagPage = dynamic(() => import('@app/components/pages/Tag'), {
  suspense: true,
})
// import { TagPage } from '@app/components/pages';

const Tag = () => {
    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingLoader/>}>
                    <TagPage />
                </Suspense>
            </Layout>
        </>
    )
}
export default Tag