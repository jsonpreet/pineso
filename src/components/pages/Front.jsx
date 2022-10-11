import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getFollowingFeed, FetchFollowingFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { Post } from '@components/post'
import { LoadingLoader, ErrorLoader } from '@components/loader'
import useApp from '@app/stores/store'

const FrontPage = () => {
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchFollowingFeed(user.profile.PublicKeyBase58Check)
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader message={`Loading Hot Pins for you.`}/> )
    }
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }
    if (isFetched) {
        return (
            <>
                <div className='w-full lg:columns-7 sm:columns-3 gap-4'>
                    {posts?.length > 0 && posts.map((post, index) => {
                        return <Post post={post} key={index} />
                    })}
                </div>
            </>
        )
    }
}

export default FrontPage

export const getServerSideProps = withCSR(async (ctx) => {
    
    const user = useApp((state) => state.user)
    const publicKey = user.profile.PublicKeyBase58Check;
    
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const queryClient = new QueryClient();
    let isError = false;

    try {
        await queryClient.prefetchQuery([['following-feed', publicKey], {publicKey}], getFollowingFeed);
    } catch (error) {
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