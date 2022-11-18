import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getGlobalFeed, FetchGlobalFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { config } from '@app/lib/constants'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import useApp from '@app/stores/store'
import Grid from '@components/ui/Grid'

const GlobalPage = () => {
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchGlobalFeed()
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader message="Loading Global Pins for you."/> )
    }
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }
    if (isFetched) {
        return (
            <>
                {posts?.length > 0 && <Grid posts={posts} />}
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