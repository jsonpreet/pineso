import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getHotFeed, FetchHotFeed } from '@data/hot-feed'
import { withCSR } from '@lib/utils'
import { config } from '@app/lib/constants'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'

const HotPage = () => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchHotFeed()
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader/> )
    }
    if (isFetching) {
        return ( <FetchingLoader /> )
    }
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

export default HotPage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery(['hotfeed'], getHotFeed);
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