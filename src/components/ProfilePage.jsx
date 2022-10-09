import UserImage from '@app/components/ui/UserImage';
import { FetchSingleProfilebyUsername, getSingleProfilebyUsername } from '@app/data/single-profile';
import { withCSR } from '@app/lib/utils';
import useApp from '@app/stores/store';
import { useRouter } from 'next/router';
import { HiCheckCircle } from 'react-icons/hi';
import { ErrorLoader, LoadingLoader } from '@components/loader';

const ProfilePage = () => {
    const router = useRouter();
    if (!router) return null
    const username = router.query.profile;
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const { data: profile, isLoading, isFetching, isFetched, error, isError } = FetchSingleProfilebyUsername({ username: username });
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) {
        return ( <LoadingLoader message={`Loading Profile`}/> )
    }
    return (
        <div className='mt-4 flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
                <UserImage classes={'shadow-lg w-34 h-34'} username={profile?.Username} profile={profile} />
                <div className='flex flex-row items-center mt-2 justify-center'>
                    <h1 className='text-2xl font-bold text-black'>{profile.Username}</h1>
                    {profile?.IsVerified && <span><HiCheckCircle className="ml-1 text-[#ec05ad]" size={18} /></span>}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }
    const username = ctx.query.profile;

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery([['single-profile', username], { username }], getSingleProfilebyUsername);
    } catch (error) {
        isError = true
        ctx.res.statusCode = error.response.status;
    }
    return {
        props: {
            //also passing down isError state to show a custom error component.
            isError,
            dehydratedState: dehydrate(queryClient),
        },
    }
})