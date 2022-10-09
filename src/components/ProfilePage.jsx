import UserImage from '@app/components/ui/UserImage';
import { FetchSingleProfilebyUsername, getSingleProfilebyUsername } from '@app/data';
import { nFormatter, withCSR } from '@app/lib/utils';
import useApp from '@app/stores/store';
import { useRouter } from 'next/router';
import { ErrorLoader, LoadingLoader } from '@components/loader';
import { BsPatchCheckFill } from 'react-icons/bs';
import Linkify from 'linkify-react';
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { LinkifyOptions } from "@app/lib/utils";
import { getFollowings, getFollows, getIsFollowing } from '@app/data/user';
import { useQuery } from '@tanstack/react-query';
import { EXTERNAL_LINK } from '@app/lib/constants';
import { IoDiamondOutline } from 'react-icons/io5';

const ProfilePage = () => {
    const router = useRouter();
    if (!router) return null
    const username = router.query.profile;
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const user = useApp((state) => state.user)

    const { data: profile, isLoading, isFetching, isFetched, error, isError } = FetchSingleProfilebyUsername({ username: username });

    const profileID = profile?.PublicKeyBase58Check;
    const userID = user?.profile?.PublicKeyBase58Check;
    const { data: isFollowing } = useQuery([['is-following', `${userID}-${profileID}`], { publicKey: userID, followingKey: profileID }], getIsFollowing, { enabled: !!userID, })

    const { data: follows } = useQuery([['total-follows', profileID], { publicKey: profileID }], getFollows, { enabled: !!profileID, })

    const { data: followings } = useQuery([['total-followings', profileID], { publicKey: profileID }], getFollowings, { enabled: !!profileID, })

    const onFollow = () => {
        
        toast.warning('Follow is no enabled!', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: false,
            draggable: false,
            closeButton: false,
            progress: undefined,
            theme: "dark",
            icon: false
        });
    }
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) {
        return ( <LoadingLoader message={`Loading Profile`}/> )
    }
    const coverImage = profile.ExtraData.FeaturedImageURL ? profile.ExtraData.FeaturedImageURL : '';
    return (
        <div className='py-12 flex relative flex-col items-center justify-center'>
            <div className='z-10 w-full flex flex-row items-start justify-start max-w-[600px]'>
                <UserImage classes={'shadow-lg w-40 h-40 border border-gray-200'} username={profile?.Username} profile={profile} />
                <div className='flex flex-col ml-4 flex-auto'>
                    <div className='flex flex-row items-start mt-4'>
                        <div className='flex-auto'>
                            <h1 className='text-3xl font-bold leading-none capitalize text-black'>{profile.Username}</h1>
                            {profile?.IsVerified && <span><BsPatchCheckFill className="ml-1 text-[#ec05ad]" size={22} /></span>}
                        </div>
                        <div className=''>
                        {isLoggedIn ? 
                            
                            (isFollowing) ?
                                <button onClick={() => onFollow()} className='bg-[#5634ee] hover:bg-[#ec05ad] text-white duration-75 delay-75 rounded-full px-4 py-1'>Following</button> :
                                <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>Follow</button>
                            :
                            <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>Follow</button>
                        }
                        </div>
                    </div>
                    <div className='flex flex-row items-start mt-3 justify-start'>
                        <Linkify options={LinkifyOptions}>
                            {profile.Description}
                        </Linkify>
                    </div>
                    <div className='flex flex-row items-start mt-3 justify-start'>
                        <div>
                            <a className='flex group flex-row items-center' href={`${EXTERNAL_LINK}/u/${profile.Username}`} target="_blank">
                                <IoDiamondOutline className='text-blue-500 duration-75 delay-75 group-hover:text-[#ec05ad]' size={17} />
                                <span className='text-blue-500 duration-75 delay-75 ml-1 group-hover:text-[#ec05ad] text-md font-semibold'>@{profile.Username}</span>
                            </a>
                        </div>
                        <div className='ml-4'>{nFormatter(follows, 1)} Followers</div>
                        <div className='ml-4'>{nFormatter(followings, 1)} Following</div>
                    </div>
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