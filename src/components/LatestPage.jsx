import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getLatestFeed, FetchLatestFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import { config } from '@app/lib/constants'

const LatestPage = () => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchLatestFeed({ limit: 200 });
    
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

export default LatestPage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery(['latest-feed'], getLatestFeed({ limit: 200 }));
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