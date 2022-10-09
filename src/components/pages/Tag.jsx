import { dehydrate, QueryClient } from '@tanstack/react-query'
import { FetchSingleTagFeed, getSingleTagFeed } from '@app/data';
import { withCSR } from '@lib/utils'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import { useRouter } from 'next/router';

const TagPage = () => {
    const router = useRouter();
    if (!router) return null
    const slug = router.query.slug;
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchSingleTagFeed({ slug });
    
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

export default TagPage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }
    const { slug } = ctx.params;

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery([['single-tag', slug], { slug }], getSingleTagFeed);
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