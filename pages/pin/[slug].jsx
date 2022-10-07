import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { withCSR } from '@lib/utils'
import { config } from '@app/lib/constants'
import { FetchSinglePost, getSinglePost } from '@app/data/single-post';
import { ErrorLoader, FetchingLoader, LoadingLoader } from '@app/components/loader';
import Head from 'next/head';
import { Layout } from '@app/components/layout';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Single = () => {
    const router = useRouter();
    if (!router) return null
    const slug = router.query.slug;
    const { data: post, isLoading, isFetching, isFetched, error, isError } = FetchSinglePost({ slug });
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
                <Head>
                    <title>Pineso</title>
                    <meta name="description" content="Build with Deso Blockchain" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>
                    <div className='w-2/4 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-3xl mx-auto'>
                        <div className='flex flex-row'>
                            <div className='image flex rounded-bl-3xl rounded-tl-3xl'>
                                <LazyLoadImage
                                    className='rounded-bl-3xl rounded-tl-3xl'
                                    alt='Picture of the author'
                                    effect="blur"
                                    src={post.ImageURLs[0]}
                                />
                            </div>
                            <div className='content p-4'>
                                {post.Body}
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        )
    }
}
export default Single

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
