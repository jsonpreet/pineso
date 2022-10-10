import { dehydrate, QueryClient } from '@tanstack/react-query'
import {getSearchPage, FetchSearch } from '@app/data'
import { withCSR } from '@lib/utils'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ProfileCard } from '@components/ui/cards'

const SearchPage = () => {
    const router = useRouter()
    const slug = router.query.query
    const { data: results, isLoading, isFetching, isFetched, error, isError } = FetchSearch(slug)
    const [active, setActive] = useState({ explore : false, profiles : true})
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) { 
        return ( <LoadingLoader message='Getting search for you.'/> )
    }
    // if (isFetching) {
    //     return ( <FetchingLoader /> )
    // }

    const exploreTab = () => {
        setActive({ explore : true, profiles : false})
    }

    const profilesTab = () => {
        setActive({ explore : false, profiles : true})
    }
    if (isFetched) {
        return (
            <>                
                <div className='flex flex-col items-center justify-center w-full'>
                    <div className='tabs rounded-xl sticky top-[0px] pt-[20px] pb-[20px] bg-white backdrop-blur-3xl backdrop-xl bg-opacity-50 w-full z-20 flex flex-row items-center justify-center'>
                        <div className='tab mr-4'>
                            <h3 onClick={exploreTab} className={`${active.explore ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Explore</h3>
                        </div>
                        <div className='tab'>
                            <h3 onClick={profilesTab} className={`${active.profiles ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Profiles</h3>
                        </div>
                    </div>
                    <div className='w-full mt-14'>
                        {active.profiles &&
                            <div className='w-full flex flex-row items-center justify-center'>
                                {/* {userPostsIsLoading && <Loader className={`h-7 w-7 text-[#ec05ad]`} />} */}
                                {results && results?.length === 0 && <div className='text-center text-[#ec05ad] font-bold text-xl'>No Profiles</div>}
                                {results && results?.length > 0 &&
                                    <div className='w-full grid grid-cols-5 max-w-7xl gap-4 mt-10'>
                                        {results.map((result, index) => {
                                            
                                            return <ProfileCard profile={result} key={result.PublicKeyBase58Check} />
                                        })}
                                    </div>
                                }
                            </div>
                        }
                        {active.explore &&
                            <div className='w-full'>
                                <div className='text-center text-[#ec05ad] font-bold text-xl'>No Pins</div>
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default SearchPage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }

    const search = ctx.query.query

    const queryClient = new QueryClient();

    let isError = false;

    try {
        await queryClient.prefetchQuery([['search', search], {search}], getSearchPage);
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