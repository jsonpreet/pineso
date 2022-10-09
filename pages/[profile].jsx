import { Layout } from '@app/components/layout'
import ProfilePage from '@app/components/ProfilePage';
import { useRouter } from 'next/router'

const Profile = () => {
    const router = useRouter();
    if (!router) return null
    const username = router.query.profile;
    return (
        <>
        <Layout>
                <ProfilePage/>
        </Layout>
        </>
    )
}

export default Profile
