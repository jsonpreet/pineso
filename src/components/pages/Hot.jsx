import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getHotFeed, FetchHotFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { config } from '@app/lib/constants'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Grid from '@components/ui/Grid'

const HotPage = () => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchHotFeed()
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader message="Loading Hot Pins for you."/> )
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