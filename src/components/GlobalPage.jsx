import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getGlobalFeed, FetchGlobalFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { config } from '@app/lib/constants'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import useApp from '@app/stores/store'

const GlobalPage = () => {
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchGlobalFeed()
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader/> )
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

export default GlobalPage

export const getServerSideProps = withCSR(async (ctx) => {
    
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery(['global-feed'], getGlobalFeed);
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