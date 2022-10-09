import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getTrendingTags, FetchTrendingTags } from '@app/data'
import { withCSR } from '@lib/utils'
import { Loader, ErrorLoader } from '@components/loader'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TrendingTags = ({ isSingle }) => {
    const router = useRouter();
    const { data: tags, isLoading, isFetching, isFetched, error, isError } = FetchTrendingTags()
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    const isTagPage = router.pathname === '/hashtag/[slug]' ? true : false
    const currentTag = isTagPage ? router.query.slug : null
    if (isFetched) {
        return (
            <>
                <div className={`flex flex-row items-center justify-center ${!isSingle ? `animate-background bg-[length:150%_100%] bg-gradient-to-r from-[#ec05ad] via-[#ff0071] to-[#5634ee]` : ''} p-2 mb-4 w-full`}>
                    {tags?.length > 0 && tags.map((tag, index) => {
                        const link = tag.Hashtag.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
                            return hashtags.substring(1).toLowerCase()
                        })
                        return (
                            <Link href={`/hashtag/${link}`} key={index}>
                                <a className={`py-2 text-sm px-4  mr-2 rounded-full duration-75 delay-75 
                                    ${!isSingle ? isTagPage && currentTag === link ? `text-white bg-black hover:bg-[#5634ee]` : `hover:bg-black hover:text-white text-black bg-white`
                                        :
                                        'bg-black text-white hover:bg-[#5634ee]'} font-semibold shadow-xl`}>
                                    {tag.Hashtag}
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </>
        )
    }
}

export default TrendingTags


export const getServerSideProps = withCSR(async (ctx) => {
    const queryClient = new QueryClient();
    let isError = false;

    try {
        await queryClient.prefetchQuery(['trending-tags'], getTrendingTags);
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