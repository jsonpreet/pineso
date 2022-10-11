import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getTrendingTagsWithFeed, FetchTrendingTagsWithFeed } from '@app/data'
import { withCSR } from '@lib/utils'
import { Loader, ErrorLoader } from '@components/loader'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TrendingTags = ({ isSingle, isSearch }) => {
    const router = useRouter();
    const { data: feed, isLoading, isFetching, isFetched, error, isError } = FetchTrendingTagsWithFeed()
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isSearch && isLoading) {
        return ( <Loader className={`h-7 w-7 text-[#ec05ad]`}/>  )
    }
    const isTagPage = router.pathname === '/hashtag/[slug]' ? true : false
    const currentTag = isTagPage ? router.query.slug : null
    if (isFetched) {
        return (
            <div>
                <div className={`grid grid-cols-2 lg:grid-cols-5 ${isSearch ? `gap-2`: `gap-5`} p-2 mb-4 w-full`}>
                    {feed?.length > 0 && feed.map((post, index) => {
                        const link = post?.tag?.Hashtag.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
                            return hashtags.substring(1).toLowerCase()
                        })
                        const bgImage = post?.ImageURLs[0]
                        return (
                            <Link href={`/hashtag/${link}`} key={index} style={{ backgroundImage: `url(${bgImage})`}} className={`bg-cover bg-no-repeat bg-center group relative flex flex-col items-center justify-center w-50 h-24 text-sm px-4 rounded-xl duration-75 delay-75 bg-black text-white hover:bg-[#5634ee]'} font-semibold shadow-xl`}>
                                    <span className='text-white font-semibold text-lg z-10 relative'>{post?.tag?.Hashtag}</span>
                                    <div className='bg-black/40 group-hover:bg-black/50 absolute rounded-xl left-0 right-0 w-full h-full duration-75 delay-75'></div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default TrendingTags


export const getServerSideProps = withCSR(async (ctx) => {
    const queryClient = new QueryClient();
    let isError = false;

    try {
        await queryClient.prefetchQuery(['trending-tags-feed'], getTrendingTagsWithFeed);
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