import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getNFTFeed, FetchNFTFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import { config } from '@app/lib/constants'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Grid from '@components/ui/Grid'

const NFTPage = () => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchNFTFeed();
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) {
        return ( <LoadingLoader message="Loading NFT's for you."/> )
    }
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }
    if (isFetched) {
        return (
            <>
                <div className='w-full lg:columns-7 sm:columns-3 gap-4'>
                    {posts?.length > 0 && <Grid posts={posts} />}
                </div>
                
            </>
        )
    }
}

export default NFTPage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery(['nft-feed'], getNFTFeed);
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