import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import { useRouter } from 'next/router';

const ProfilePage = dynamic(() => import('@app/components/pages/Profile'), {
  suspense: true,
})

const SearchPage = dynamic(() => import('@app/components/pages/Search'), {
  suspense: true,
})

const Profile = () => {
    const router = useRouter()
    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingLoader/>}>
                    {router.query.profile === 'search' ? <SearchPage /> : <ProfilePage />}
                </Suspense>
            </Layout>
        </>
    )
}

export default Profile
