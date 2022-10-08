import { Layout } from '@app/components/layout'
import { useRouter } from 'next/router'

const Profile = () => {
    const router = useRouter();
    if (!router) return null
    const username = router.query.profile;
    console.log(username)
    return (
        <>
        <Layout>
                <div className='mt-4'>
                    {username}
                </div>
        </Layout>
        </>
    )
}

export default Profile
