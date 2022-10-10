import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import Logo from "./Logo";
import Deso from 'deso-protocol';
import useApp from "@app/stores/store";
import { useRouter } from "next/router";
import { Menu, Transition, Switch } from '@headlessui/react'
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { BsFileArrowDown } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { classNames, withCSR } from "@app/lib/utils";
import UserImage from "@components/ui/UserImage";
import { FetchTrendingTagsWithFeed, getSearch, getSingleProfile, getTrendingTagsWithFeed } from "@app/data";
import { useDebounce } from "@lib/hooks";
import { useQuery } from "@tanstack/react-query";
import TrendingTags from "@components/ui/TrendingTags";
import { useDetectClickOutside } from 'react-detect-click-outside';

const Header = () => {
    const router = useRouter()
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const setUser = useApp((state) => state.setUser)
    const setLoggedIn = useApp((state) => state.setLoggedIn)
    const recentSearches = useApp((state) => state.recentSearch)
    const setSearch = useApp((state) => state.setSearch)
    const resetSearch = useApp((state) => state.resetSearch)
    const [loggedIn, setUserLoggedIn] = useState()
    const [account, setAccount] = useState()
    const [deso, setDeso] = useState();
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [query, setQuery] = useState("")
    const debouncedFilter = useDebounce(query, 1200);
    const [loader, setLoader] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const { data: feed, isLoading, isFetching, isFetched, error, isError } = FetchTrendingTagsWithFeed()

    // const { data, isLoading, isSuccess, isFetched } = useQuery(
    //     [['search', debouncedFilter], debouncedFilter],
    //     () => getSearch(debouncedFilter),
    //     { enabled:Boolean(debouncedFilter)}
    // );

    // useEffect(() => {
    //     if (isFetched && data) {
    //         setLoader(false);
    //         setShowResults(true);
    //     } else {
    //         setLoader(true);
    //         setShowResults(false);
    //     }
    // }, [isFetched, debouncedFilter, data]);

    useEffect(() => {
        const isdeso = new Deso();
        if (isdeso) {
            setDeso(isdeso)
        }
    }, [])

    useEffect(() => {
        setAccount(user);
        setUserLoggedIn(isLoggedIn);
    }, [isLoggedIn])

    const login = async () => {
        const request = {
            "publicKey": "",
            "transactionSpendingLimitResponse": {
                "GlobalDESOLimit": 100000000000,
                "TransactionCountLimitMap": {
                "SUBMIT_POST": 100000,
                "FOLLOW": 100000
                },
            }
        };
        if (deso) {
            const response = await deso.identity.derive(request);
            if (response) {
                const data = await getSingleProfile(response.publicKeyBase58Check);
                setUser({profile: data, data: response});
                setLoggedIn(true)
            } else {
                console.log(response);
            }
        }
    }

    const logout = async () => {
        const request = user?.profile?.PublicKeyBase58Check;
        if (deso) {
            const response = await deso.identity.logout(request);
            if (response) {
                setUser({})
                setLoggedIn(false)
            } else {
                console.log(response);
            }
        }
    }
            
    
    useEffect(() => {
        if (query.length > 0) {
            if (recentSearches?.length > 0) {
                recentSearches.filter((search) => {
                    if (search !== query) {
                        setSearch(debouncedFilter);
                    }
                })
            } else {
                setSearch(debouncedFilter);
            }
        }
    }, [debouncedFilter]);
    
    const onSearch = useCallback((e) => {
        if(e.target.value.length > 0){
            setQuery(e.target.value);
            setShowSuggestions(false)
        } else {
            setShowResults(false);
            setQuery('');
            setShowSuggestions(true);
            setLoader(false);
        }
    });

    const closeSearch = () => {
        setShowSuggestions(false)
    }

    const resetRecentSearch = () => {
        resetSearch();
        setShowSuggestions(true)
    }

    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    },[]); 
    /* Method that will fix header after a specific scrollable */
    const isSticky = (e) => {
        const header = document.querySelector('.header-section');
        const scrollTop = window.scrollY;
        scrollTop >= 70 ? header.classList.add('backdrop-blur-3xl') : header.classList.remove('backdrop-blur-3xl');
        scrollTop >= 70 ? header.classList.add('bg-opacity-50') : header.classList.remove('bg-opacity-50');
    };

    const searchRef = useDetectClickOutside({ onTriggered: closeSearch, triggerKeys: ['Escape', 'x'], });
    
    return (
        <>
            {showSuggestions && (
                <>
                    <style jsx global>
                    {`
                        body {
                            overflow:hidden;
                        }
                    `}
                    </style>
                    <div className="fixed left-0 top-0 w-full h-screen bg-black/70 z-10" />
                </>
            )}
            <div className={`header-section fixed z-20 flex top-0 left-0 w-full flex-row h-[70px] box-border py-2 px-4 bg-white`}>
                <div>
                    <Link href="/" className="cursor-pointer">
                        <a><Logo/></a>
                    </Link>
                </div>
                <div className="flex flex-row ml-4 justify-center items-center">
                    <Link href="/">
                        <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Home</a>
                    </Link>
                    <Link href="/global">
                        <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/global' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Global</a>
                    </Link>
                    <Link href="/latest">
                        <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/latest' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Latest</a>
                    </Link>
                    <Link href="/nft">
                        <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/nft' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>NFT's</a>
                    </Link>
                </div>
                <div className="flex flex-col flex-1 mx-4 relative justify-center items-center" ref={searchRef}>
                    <div className="relative w-full flex flex-row">
                        <input className="bg-gray-100 outline-0 w-full focus:shadow-none focus:ring-4 focus:ring-[#5634ee]/50 px-4 h-[50px] rounded-full" onChange={(e) => onSearch(e)} onClick={() => setShowSuggestions(true)} type="text" placeholder="Search" />
                        <BiSearch className="absolute top-[15px] text-gray-500 right-4" size={24}/>
                    </div>
                    
                    <div className="absolute top-[60px] w-full bg-white rounded-lg shadow-lg">
                        {showSuggestions && ( 
                            <div className="flex flex-col">
                                {(recentSearches?.length > 0) ? (
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center px-4 pt-8">
                                            <p className=" font-semibold">Recent Searches</p>
                                            <button className="cursor-pointer ml-3 hover:bg-black hover:text-white duration-75 delay-75 bg-gray-200 p-[6px] rounded-full" onClick={() => resetRecentSearch()}><FaTimes size={12}/></button>
                                        </div>
                                        <div className="flex flex-row items-center pt-2 px-4">
                                            {
                                                recentSearches.map((search, index) => {
                                                    return (
                                                        <Link href={`/search?query=${search}`} key={search}>
                                                            <a className="font-semibold bg-gray-200 px-4 py-1 rounded-full hover:bg-black hover:text-white duration-75 delay-75">
                                                                <span>{search}</span>
                                                            </a>
                                                        </Link>    
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                ): null}
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between items-center px-4 pt-8">
                                        <p className=" font-semibold">Trending on Deso</p>
                                    </div>
                                    <div className="flex flex-row max-w-[80%] justify-center items-center pb-2 px-2">
                                        <div className={`grid grid-cols-5 gap-2 p-2 mb-4 w-full`}>
                                            {feed?.length > 0 && feed.map((post, index) => {
                                                const link = post?.tag?.Hashtag.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
                                                    return hashtags.substring(1).toLowerCase()
                                                })
                                                const bgImage = post?.ImageURLs[0]
                                                return (
                                                    <Link href={`/hashtag/${link}`} key={post?.tag?.Hashtag}>
                                                        <a style={{ backgroundImage: `url(${bgImage})`}} className={`bg-cover bg-no-repeat bg-center group relative flex flex-col items-center justify-center w-50 h-24 text-sm px-4 rounded-xl duration-75 delay-75 bg-black text-white hover:bg-[#5634ee]'} font-semibold shadow-xl`}>
                                                            <span className='text-white font-semibold text-lg z-10 relative'>{post?.tag?.Hashtag}</span>
                                                            <div className='bg-black/40 group-hover:bg-black/50 absolute rounded-xl left-0 right-0 w-full h-full duration-75 delay-75'></div>
                                                        </a>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                
                </div>
                <div className="flex flex-row relative mr-4 justify-end items-center">
                    {loggedIn ? 
                        <div className="flex flex-row relative items-center justify-end">
                            <div>
                                <div className="flex items-center justify-center mr-2">
                                    <Link href={`/${user?.profile?.Username}`} passHref>
                                        <a>
                                            <UserImage username={user?.profile?.Username} profile={user?.profile} classes={'w-10 h-10 shadow-xl border border-gray-200 rounded-full'} />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex w-full justify-center hover:bg-gray-200 p-2 rounded-full duration-75 delay-75 items-center shadow-none text-sm font-medium text-gray-700 focus:outline-none">
                                            <BsFileArrowDown className="h-6 w-6" aria-hidden="true" />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                            {({ active }) => (
                                                <Link href="/">
                                                <a
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}>Support</a>
                                                </Link>
                                            )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                            {({ active }) => (
                                                <button onClick={() => logout()}
                                                type="button"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 w-full text-left text-sm'
                                                )}
                                                >
                                                Log out
                                                </button>
                                            )}
                                            </Menu.Item>
                                        </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                        :
                        <a onClick={() => login()} className="cursor-pointer px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Login</a>
                    }                
                </div>
            </div>
        </>
    )
}

export default Header

    
    
    
  
    