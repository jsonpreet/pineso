import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const ProfilePage = dynamic(() => import('@app/components/pages/Profile'), {
  suspense: true,
})

const Profile = () => {
    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingLoader/>}>
                    <ProfilePage />
                </Suspense>
            </Layout>
        </>
    )
}

export default Profile
