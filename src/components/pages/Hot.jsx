import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getHotFeed, FetchHotFeed, FetchInfiniteHotFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import Grid from '@components/ui/Grid'
import { useInView } from 'react-cool-inview'
import { nanoid } from 'nanoid'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Post } from '@components/post'

const HotPage = () => {
    //const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchHotFeed()
    const { isError, isLoading, error, isSuccess, isFetched, hasNextPage, isFetchingNextPage, fetchNextPage, data: posts } = FetchInfiniteHotFeed(-1);

    const { observe } = useInView({
        rootMargin: "200px 0px",
        onEnter: () => {
            fetchNextPage()
        },
    });
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader message="Loading Hot Pins for you."/> )
    }
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }
    console.log(posts.pages.length)
    return (
        <>
            {isSuccess ? (
                <>
                    <div className='min-h-[600px]'>
                        <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 3, 900: 7}}>
                            <Masonry gutter='10px'>
                            {posts.pages.map(page => {
                                return page.map(post => {
                                    let k = nanoid()
                                    return <Post post={post} key={`${k}_${post.PostHashHex}`} />
                                })
                                //return <Grid isLoading={isLoading} isError={isError} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} key={index} posts={page} />
                            }
                                
                                // page.map(post => {
                                //     return <Post post={post} key={post.PostHashHex} />
                                // })
                                // return <Grid key={index} posts={page} />
                                    )}
                            </Masonry>
                        </ResponsiveMasonry>
                    </div>
                </>
            ) : (
                <div className='flex justify-center p-10'>
                    <p className='text-gray-500 dark:text-gray-400'>
                    No more posts
                    </p>
                </div>
            )}
                
            {isFetched && hasNextPage ? (
                <span className='flex justify-center p-10'>
                    <Loader />
                </span>
                ) : (
                <div className='flex justify-center p-10'>
                    <p className='text-gray-500 dark:text-gray-400'>
                    No more posts
                    </p>
                </div>
            )}
            
            
            {/* {posts?.length > 0 && <Grid posts={posts} />} */}
            
        </>
    )
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