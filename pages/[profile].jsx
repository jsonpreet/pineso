import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';
import { useRouter } from 'next/router';
import { withCSR } from '@app/lib/utils';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSingleProfilebyUsername } from '@app/data';

const ProfilePage = dynamic(() => import('@app/components/pages/Profile'), {
    suspense: true,
})

const Profile = () => {
    const router = useRouter()
    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingLoader />}>
                    <ProfilePage />
                </Suspense>
            </Layout>
        </>
    )
}

export default Profile

// export const getServerSideProps = withCSR(async (ctx) => {
//     let page = 1;
//     if (ctx.query.page) {
//         page = parseInt(ctx.query.page);
//     }
//     const username = ctx.query.profile;

//     const queryClient = new QueryClient();

//     let isError = false;
//     try {
//         await queryClient.prefetchQuery([['single-profile', username], { username }], getSingleProfilebyUsername);
//     } catch (error) {
//         isError = true
//         ctx.res.statusCode = error.response.status;
//     }
//     return {
//         props: {
//             //also passing down isError state to show a custom error component.
//             isError,
//             dehydratedState: dehydrate(queryClient),
//         },
//     }
// })