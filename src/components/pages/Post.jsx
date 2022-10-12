import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { withCSR } from '@lib/utils'
import reactImageSize from 'react-image-size'
import { FetchSinglePost, getSinglePost, getFollows, getIsFollowing } from '@app/data';
import { ErrorLoader, FetchingLoader, LoadingLoader } from '@app/components/loader';
import { Layout } from '@app/components/layout';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { UserCard, ShareCard, MetaCard } from '@app/components/ui/cards';
import useApp from '@app/stores/store';
import { useEffect, useRef, useState } from 'react';
import { Comments } from '@app/components/post';
import { RelativePosts } from '@app/components/post';
import TrendingTags from '@app/components/ui/TrendingTags';
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { LinkifyOptions } from "@app/lib/utils";
import Head from 'next/head';
import { BASE_URL } from '@app/lib/constants';
import { BsArrowLeftCircle, BsArrowLeftCircleFill } from 'react-icons/bs';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const PostPage = () => {
    const router = useRouter();
    if (!router) return null
    const slug = router.query.slug;
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const rootRef = useRef();
    const [imageSize, setSize] = useState({ width: 0, height: 0 })
    const { data: post, isLoading, isFetching, isFetched, error, isError } = FetchSinglePost({ slug });
    

    useEffect(() => {
        if (post) {
            const loadSize = async (url) => {
                const { width, height } = await reactImageSize(url);
                setSize({width, height});
            }
            loadSize(post.ImageURLs[0])
        }
    }, [post])

    const profileID = post?.ProfileEntryResponse.PublicKeyBase58Check;
    const userID = user?.profile?.PublicKeyBase58Check;
    // const { data: following, isLoading: followingLoading, isFetched: followingFetched } = FetchIsFollowing({ publicKey: user.publicKeyBase58Check, followingKey: post.ProfileEntryResponse.PublicKeyBase58Check });
    // Then get the user's projects
    const { status: followingStatus, fetchStatus: followingFetchStatus, data: isFollowing } = useQuery([['is-following', `${userID}-${profileID}`], { publicKey: userID, followingKey: profileID }], getIsFollowing, { enabled: !!userID, })

    const { status: followsStatus, fetchStatus: followsFetchStatus, data: follows } = useQuery([['follows', profileID], { publicKey: profileID }], getFollows, { enabled: !!profileID, })
    
    // const { data: numOfFollows, isLoading: followsLoading, isFetched: followsFetched } = FetchFollows({ publicKey: post.ProfileEntryResponse.PublicKeyBase58Check });

    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (!isLoggedIn && (isLoading || followsStatus === 'loading')) { 
        return ( <LoadingLoader message='Loading Pin for you.'/> )
    }
    if (isLoggedIn && (isLoading || followingStatus === 'loading' || followsStatus === 'loading')) { 
        return ( <LoadingLoader message='Loading Pin for you.'/> )
    }
    
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }

    const Output = () => {
        return (
            <>
                <Head>
                    <meta name="description" content={post.Body}/>
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`${BASE_URL}/pin/${post.PostHashHex}`} />
                    <meta property="og:title" content={`Pin by ${post.ProfileEntryResponse.Username} on Pineso`} />
                    <meta property="og:description" content={post.Body}/>
                    <meta property="og:image" content={post.ImageURLs[0]}/>
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content={`${BASE_URL}/pin/${post.PostHashHex}`} />
                    <meta property="twitter:title" content={`Pin by ${post.ProfileEntryResponse.Username} on Pineso`} />
                    <meta property="twitter:description" content={post.Body}/>
                    <meta property="twitter:image" content={post.ImageURLs[0]} />
                </Head>
                <Layout>
                    <div className='mt-20 sm:mt-0 flex-none'>
                        <BrowserView>
                            <div className='flex flex-col items-center relative justify-center'>
                                <button className='absolute top-0 left-0 z-10 duration-75 delay-75 hover:text-[#ec05ad] text-gray-400' onClick={() => router.back()}> <BsArrowLeftCircleFill size={32}/> </button>
                            </div>
                        </BrowserView>
                        {/* <div ref={rootRef} className='hidden' style={{ width: `${imageSize?.width}px`, height: `${imageSize?.height}px`, backgroundImage: `url(${post.ImageURLs[0]})`}}/> */}
                        <div className='w-full max-w-[1024px] shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-3xl mx-auto'>
                            <div className='flex flex-col lg:flex-row'>
                                <div className='image w-full lg:w-2/4 relative overflow-hidden border border-white/50 h-100 rounded-3xl sm:rounded-bl-3xl sm:rounded-tl-3xl flex flex-col items-center justify-center p-4'>
                                    <div style={{ backgroundImage: `url(${post.ImageURLs[0]})`, filter: 'blur(3px)', opacity: '.2'}} className='w-full h-full backdrop-xl backdrop-blur-md p-4 absolute top-0 left-0 rounded-bl-3xl rounded-tl-3xl'/>    
                                    <LazyLoadImage
                                        className='rounded-3xl shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] object-cover'
                                        alt={`Pin by ${post.ProfileEntryResponse.Username}`}
                                        effect="blur"
                                        wrapperProps={{ className: 'flex flex-col z-10 rounded-3xl items-center justify-center ' }}
                                        src={post.ImageURLs[0]}
                                        />
                                </div>
                                <div className='content flex flex-col w-full lg:w-2/4 pt-8 pb-4 px-8'>
                                    <ShareCard rootRef={rootRef} post={post} />
                                    <UserCard user={user.profile} profile={post.ProfileEntryResponse} follows={follows} isFollowing={isFollowing} />
                                    <div className='mt-4 break-words body'>
                                        <Linkify options={LinkifyOptions}>
                                            {post.Body}
                                        </Linkify>
                                    </div>
                                    <MetaCard post={post} />
                                    <Comments post={post}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-10 text-center'>
                        <div className='max-w-6xl mx-auto'>
                            <TrendingTags isSingle={true} isSearch={false} />
                        </div>
                    </div>
                    <RelativePosts parent={post}/>
                </Layout>
            </>
        )
    }

    if (isLoggedIn && isFetched && followsStatus === 'success' && followingStatus === 'success') {
        return <Output />
    }

    if (!isLoggedIn && isFetched && followsStatus === 'success') {
        return <Output />
    }
}
export default PostPage

export const getServerSideProps = withCSR(async (ctx) => {
    
    const { slug } = ctx.params;

    const queryClient = new QueryClient();

    let isError = false;
    
    try {
        await queryClient.prefetchQuery([['single-post', slug], { slug }], getSinglePost);
    } catch (error) {
        console.log(error);
        isError = true
        ctx.res.statusCode = error.response.status;
    }
    return {
        props: {
            isError,
            dehydratedState: dehydrate(queryClient),
        },
    }
})
