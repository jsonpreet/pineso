import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import {getSearchPage, FetchSearch, getSearch, FetchExchangeRate, FetchTrendingTagsWithFeed } from '@app/data'
import { removeDuplicates, withCSR } from '@lib/utils'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ProfileCard } from '@components/ui/cards'
import Link from "next/link";
import { useDetectClickOutside } from 'react-detect-click-outside'
import Deso from 'deso-protocol'
import useApp from '@app/stores/store'
import { useDebounce } from '@app/lib/hooks'
import { BsArrowRightShort, BsFileArrowDown, BsPatchCheckFill, BsPatchQuestionFill, BsQuestion } from "react-icons/bs";
import { BiExit, BiSearch } from "react-icons/bi";
import UserImage from '@components/ui/UserImage';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { FaTimes, FaTwitter } from "react-icons/fa";

const SearchPage = () => {
    const router = useRouter()
    const searchQuery = router.query.query
    const [mobileResults, setMobileResults] = useState([])
    const [showMobileResults, setMobileShowResults] = useState(false)
    const [mobileTabs, setMobileTabs] = useState(false)
    const [active, setActive] = useState({ explore: false, profiles: true })
    const { user, isLoggedIn, setLoggedIn, setUser,setSearch, recentSearches, resetSearch } = useApp((state) => state);
    const [account, setAccount] = useState()
    const [deso, setDeso] = useState();
    const [mobileShowSuggestions, setMobileShowSuggestions] = useState(true)
    const [query, setQuery] = useState("")
    const debouncedFilter = useDebounce(query, 1200);
    const [loader, setLoader] = useState(false)

    const { data: searchResults, isLoading: searchIsLoading, isFetching, isFetched: searchIsFetched } = FetchSearch(searchQuery)
    const { data: feed, isLoading: feedLoading, isFetched: feedFetched } = FetchTrendingTagsWithFeed()

    const { data: exchange } = FetchExchangeRate();

    const { data: profiles, isLoading, isSuccess, isFetched } = useQuery(
        [['search', debouncedFilter], debouncedFilter],
        () => getSearch(debouncedFilter),
        { enabled:Boolean(debouncedFilter)}
    );


    useEffect(() => {
        if (isFetched && profiles) {
            setLoader(false)
            setMobileShowResults(true);
            setMobileResults(profiles);
        } else {
            setMobileShowResults(false);
            setMobileResults();
        }
    }, [isFetched, profiles]);

    useEffect(() => {
        const isdeso = new Deso();
        if (isdeso) {
            setDeso(isdeso)
        }
    }, [])

    useEffect(() => {
        if(!isMobile) {
            router.push('/')
        }
    }, [isMobile]); 

    useEffect(() => {
        if(isMobile && router.query !== null && router.query.query !== undefined) {
            setMobileTabs(true)
            setMobileShowResults(false)
        } else if(isMobile) {
            setMobileShowSuggestions(true)
        }
    }, [router, isMobile]); 

    
    useEffect(() => {
        if (query.length > 0) {
            if (recentSearches?.length > 0) {
                recentSearches.filter((search) => {
                    if (search !== query) {
                        let s = removeDuplicates([...recentSearches, query])
                        setSearch(s);
                    }
                })
            } else {
                setSearch([query]);
            }
        }
    }, [debouncedFilter]);

    const onSearch = ((e) => {
        if (e.target.value.length > 0) {
            setLoader(true)
            setMobileShowResults(true);
            setQuery(e.target.value);
            setMobileShowSuggestions(false);
        } else {
            setLoader(false)
            setMobileShowSuggestions(true);
            setMobileShowResults(false);
            setQuery('');
        }
    });

    const resetRecentSearch = () => {
        resetSearch();
        setMobileShowSuggestions(true)
    }

    const isShowSuggestions = () => {
        if (query.length > 0) {
            setMobileShowSuggestions(false)
            setMobileShowResults(true)
        } else {
            setMobileShowSuggestions(true)
            setShowResults(false)
        }
    }

    const exchangeRate = exchange?.USDCentsPerDeSoExchangeRate / 100
    
    
    if (searchIsLoading || feedLoading) { 
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
    
    return (
        <>
            <MobileView>
            <div className="sm:hidden flex flex-col flex-1 sm:mx-4 relative justify-center items-center">
                <div className="w-full flex flex-row ">
                    <div className='relative w-full'>
                        <input
                            className="bg-gray-100 outline-0 w-full focus:shadow-none focus:ring-4 focus:ring-[#5634ee]/50 px-4 h-[50px] rounded-full"
                            onChange={(e) => onSearch(e)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    router.push('/search?query='+e.target.value)
                                }
                            }}
                            value={query || searchQuery}
                            type="text"
                            placeholder="Search"
                        />
                        <BiSearch className="absolute top-[15px] text-gray-500 right-4" size={24}/>
                    </div>
                </div>
                
                <div className="relative mt-6 w-full">
                    {loader && <div className="flex flex-row items-center py-8 justify-center"><Loader className={`h-7 w-7 text-[#ec05ad]`} /></div>}
                    {showMobileResults && (
                        <div className="flex flex-col" >
                            {mobileResults?.ProfilesFound?.length > 0 && mobileResults.ProfilesFound.map((search) => {

                                const userCoinPrice = (search?.CoinPriceDeSoNanos / 1000000000) * exchangeRate;
                                return (
                                    <div key={search.PublicKeyBase58Check} className="flex flex-row items-center py-2">
                                        <Link href={`/${search.Username}`} passHref>
                                            <a className='flex flex-row w-full items-start hover:bg-gray-100 py-2 px-4'>
                                                <div>
                                                    <UserImage classes='w-10 shadow h-10' username={search.Username} profile={search} />
                                                </div>
                                                <div className="ml-2 flex flex-col flex-auto items-start">
                                                    <div className="flex flex-row items-start">
                                                        <span className="mr-1 text-black font-semibold duration-75 delay-75 hover:text-[#ec05ad] leading-none">{search.Username}</span>
                                                        {search.IsVerified && <span><BsPatchCheckFill className="text-[#ec05ad]" size={16} /></span>}
                                                    </div>
                                                    <div className='flex flex-row items-start'>
                                                        <span className='text-[#ec05ad] mr-2'>≈${userCoinPrice.toFixed(2)} USD</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div> )
                    }
                    <div className="flex flex-col">
                        {(recentSearches?.length > 0) ? (
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-center items-center px-4 pt-8">
                                    <p className="tracking-wide">Recent Searches</p>
                                    <button className="cursor-pointer ml-3 hover:bg-black hover:text-white duration-75 delay-75 bg-gray-200 p-[6px] rounded-full" onClick={() => resetRecentSearch()}><FaTimes size={12}/></button>
                                </div>
                                <div className="flex flex-row w-full items-center pt-2 px-4">
                                    {
                                        recentSearches.map((search, index) => {
                                            return (
                                                <Link href={`/search?query=${search}`} key={search} shallow={true} onClick={() => setShowSuggestions(false)} className="font-semibold mr-2 bg-gray-200 px-4 py-1 rounded-full hover:bg-black hover:text-white duration-75 delay-75">
                                                    <a><span>{search}</span></a>
                                                </Link>    
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        ): null}
                            {(!showMobileResults && mobileShowSuggestions) &&
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-center items-center">
                                        <p className="tracking-wide">Trending on Deso</p>
                                    </div>
                                    <div className="flex flex-col justify-center items-center pb-2 pt-4">
                                        <div className={`grid grid-cols-2 gap-4 mb-4 w-full`}>
                                            {feedFetched && feed?.length > 0 && feed.map((post, index) => {
                                                const link = post?.tag?.Hashtag.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
                                                    return hashtags.substring(1).toLowerCase()
                                                })
                                                const bgImage = post?.ImageURLs[0]
                                                return (
                                                    <Link href={`/hashtag/${link}`} key={post?.tag?.Hashtag}>
                                                        <a style={{ backgroundImage: `url(${bgImage})`}} className={`bg-cover bg-no-repeat bg-center group relative flex flex-col items-center justify-center w-50 h-24 text-sm px-4 rounded-xl duration-75 delay-75 bg-black text-white hover:bg-[#5634ee]'} font-semibold shadow-xl`}>
                                                            <span className='text-white font-semibold z-10 relative'>{post?.tag?.Hashtag}</span>
                                                            <div className='bg-black/50 group-hover:bg-black/50 absolute rounded-xl left-0 right-0 w-full h-full duration-75 delay-75'></div>
                                                        </a>
                                                    </Link>
                                                )
                                            })}
                                            {feedLoading && <Loader className={`h-7 w-7 text-[#ec05ad]`}/>}
                                        </div>
                                    </div>
                                </div>
                            }
                    </div>
                </div>
            </div>
            {mobileTabs && <div className='flex flex-col items-center justify-center w-full'>
                <div className='sticky top-[0px] z-50 w-full'>
                    <div className='tabs rounded-xl bg-white pt-[20px] pb-[20px] backdrop-blur-3xl backdrop-xl bg-opacity-50 w-full z-20 flex flex-row items-center justify-center'>
                        <div className='tab mr-4'>
                            <h3 onClick={exploreTab} className={`${active.explore ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Explore</h3>
                        </div>
                        <div className='tab'>
                            <h3 onClick={profilesTab} className={`${active.profiles ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Profiles</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-14'>
                    {active.profiles &&
                        <div className='w-full flex flex-row items-center justify-center'>
                            
                            {searchResults && searchResults?.length === 0 && <div className='text-center text-[#ec05ad] font-bold text-xl'>No Profiles</div>}
                            {searchResults && searchResults?.length > 0 &&
                                <div className='w-full grid grid-cols-2 gap-4 sm:mt-10'>
                                    {searchResults.map((result, index) => {
                                        
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
                </div>} 
            </MobileView>
        </>
    )
}

export default SearchPage
