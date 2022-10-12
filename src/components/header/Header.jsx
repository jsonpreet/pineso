import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Deso from 'deso-protocol';
import useApp from "@app/stores/store";
import { useRouter } from "next/router";
import { Menu, Transition, Switch } from '@headlessui/react'
import { classNames, removeDuplicates, withCSR } from "@app/lib/utils";
import UserImage from "@components/ui/UserImage";
import { FetchExchangeRate, FetchTrendingTagsWithFeed, getSearch, getSingleProfile, getTrendingTagsWithFeed } from "@app/data";
import { useDebounce } from "@lib/hooks";
import { useQuery } from "@tanstack/react-query";
import TrendingTags from "@components/ui/TrendingTags";
import { useDetectClickOutside } from 'react-detect-click-outside';
import { Loader } from "@components/loader";
import Image from "next/image";
import { IoChevronDownCircleOutline, IoDiamondOutline } from "react-icons/io5";
import { BsArrowRightShort, BsFileArrowDown, BsPatchCheckFill, BsPatchQuestionFill, BsQuestion } from "react-icons/bs";
import { BiExit, BiSearch } from "react-icons/bi";
import { HiHome, HiOutlineUserCircle, HiSearch } from 'react-icons/hi'
import { FaTimes, FaTwitter } from "react-icons/fa";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const Header = () => {
    const router = useRouter()
    
    const { user, isLoggedIn, setLoggedIn, setUser,setSearch, recentSearch, resetSearch } = useApp((state) => state);
    const [loggedIn, setUserLoggedIn] = useState()
    const [account, setAccount] = useState()
    const [deso, setDeso] = useState();
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState("")
    const debouncedFilter = useDebounce(query, 1200);
    const [loader, setLoader] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [showHelpPopUp, setShowHelpPopUp] = useState(false);
    const { data: feed, isLoading: feedLoading } = FetchTrendingTagsWithFeed()

    const { data: exchange } = FetchExchangeRate();

    const { data: profiles, isLoading, isSuccess, isFetched } = useQuery(
        [['search', debouncedFilter], debouncedFilter],
        () => getSearch(debouncedFilter),
        { enabled:Boolean(debouncedFilter)}
    );

    useEffect(() => {
        if (isFetched && profiles) {
            setLoader(false)
            setShowResults(true);
            setResults(profiles);
        } else {
            setShowResults(false);
            setResults();
        }
    }, [isFetched, profiles]);

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

    useEffect(() => {
        if (isBrowser) {
            window.addEventListener('scroll', isSticky);
            return () => {
                window.removeEventListener('scroll', isSticky);
            };
        }
    },[isBrowser]); 

    useEffect(() => {
        if(router.pathname !== '/search' && router.query !== null && router.query.query !== undefined) {
            setQuery(router.query.query)
        }
    }, [router]); 
    
    useEffect(() => {
        if (query.length > 0) {
            if (recentSearch?.length > 0) {
                recentSearch.filter((search) => {
                    if (search !== query) {
                        let s = removeDuplicates([...recentSearch, query])
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
            setShowResults(true);
            setQuery(e.target.value);
            setShowSuggestions(false);
        } else {
            setLoader(false)
            setShowSuggestions(true);
            setShowResults(false);
            setQuery('');
        }
    });

    const login = async () => {
        const request = 3;
        if (deso) {
            const response = await deso.identity.login(request);
                console.log(response);
            if (response) {
                const data = await getSingleProfile(response?.key);
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
                setShowHelpPopUp(false);
            } else {
                console.log(response);
                setShowHelpPopUp(false);
            }
        }
    }

    const closeSearch = () => {
        setShowSuggestions(false)
        setShowResults(false)
    }
    const closeHelpPopUp = () => {
        setShowHelpPopUp(false);
    }
    const helpRef = useDetectClickOutside({ onTriggered: closeHelpPopUp, triggerKeys: ['Escape', 'x'], });
    const searchRef = useDetectClickOutside({ onTriggered: closeSearch, triggerKeys: ['Escape', 'x'], });

    const resetRecentSearch = () => {
        resetSearch();
        setShowSuggestions(true)
    }
    /* Method that will fix header after a specific scrollable */
    const isSticky = (e) => {
        const header = document.querySelector('.header-section');
        const scrollTop = window.scrollY;
        scrollTop >= 70 ? header.classList.add('backdrop-blur-3xl') : header.classList.remove('backdrop-blur-3xl');
        scrollTop >= 70 ? header.classList.add('bg-opacity-50') : header.classList.remove('bg-opacity-50');
    };

    const isShowSuggestions = () => {
        if (query.length > 0) {
            setShowSuggestions(false)
            setShowResults(true)
        } else {
            setShowSuggestions(true)
            setShowResults(false)
        }
    }

    const exchangeRate = exchange?.USDCentsPerDeSoExchangeRate / 100
    return (
        <>
            <BrowserView>
                {(showSuggestions || showResults) &&
                        <style jsx global>
                        {`
                            body {
                                overflow:hidden;
                            }
                        `}
                        </style>
                        
                }
                <div className={` ${(showSuggestions || showResults) ? `visible` : `hidden`} fixed left-0 top-0 w-full h-screen bg-black/70 z-10`} />
                <div className={`header-section flex fixed z-40 top-0 left-0 w-full flex-row h-[70px] box-border py-2 px-4 bg-white`}>
                    <div>
                        <Link href="/" className="cursor-pointer">
                            <a><Logo/></a>
                        </Link>
                    </div>
                    <div className="flex flex-row ml-4 justify-center items-center">
                        <Link href="/" passHref>
                        <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Home</a>
                        </Link>
                        <Link href="/global" passHref>
                            <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/global' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Global</a>
                        </Link>
                        <Link href="/latest" passHref>
                            <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/latest' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>Latest</a>
                        </Link>
                        <Link href="/nft" passHref>
                            <a className={`px-4 py-2 mr-1 text-md font-semibold ${router.pathname === '/nft' ? `bg-black text-white hover:bg-[#5634ee]` : `hover:bg-black hover:text-white`} rounded-full duration-75 delay-75`}>NFT's</a>
                        </Link>
                    </div>
                    <div className="flex flex-col flex-1 mx-4 relative justify-center items-center" ref={searchRef}>
                        <div className="relative w-full flex flex-row">
                            <input
                                className="bg-gray-100 outline-0 w-full focus:shadow-none focus:ring-4 focus:ring-[#5634ee]/50 px-4 h-[50px] rounded-full"
                                onChange={(e) => onSearch(e)}
                                onClick={() => isShowSuggestions()}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        router.push('/search?query='+e.target.value)
                                    }
                                }}
                                value={query}
                                type="text"
                                placeholder="Search"
                            />
                            <BiSearch className="absolute top-[15px] text-gray-500 right-4" size={24}/>
                        </div>
                        
                        <div className="absolute top-[60px] w-full bg-white rounded-br-xl rounded-bl-xl shadow-2xl">
                            {loader && <div className="flex flex-row items-center py-8 justify-center"><Loader className={`h-7 w-7 text-[#ec05ad]`} /></div>}
                            {showResults &&
                                <div className="flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll" >
                                    {results?.ProfilesFound?.length > 0 && results.ProfilesFound.map((search) => {

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
                                </div>
                            }
                            {showSuggestions &&
                                <div className="flex flex-col">
                                    {(recentSearch?.length > 0) &&
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center px-4 pt-4">
                                                <p className=" font-semibold">Recent Searches</p>
                                                <button className="cursor-pointer ml-3 hover:bg-black hover:text-white duration-75 delay-75 bg-gray-200 p-[6px] rounded-full" onClick={() => resetRecentSearch()}><FaTimes size={12}/></button>
                                            </div>
                                            <div className="flex flex-row w-full items-center pt-2 px-4">
                                                {
                                                    recentSearch.map((search, index) => {
                                                        return (
                                                            <Link href={`/search?query=${search}`} key={search} shallow={true}>
                                                                <a onClick={() => setShowSuggestions(false)} className="font-semibold mr-2 bg-gray-200 px-4 py-1 rounded-full hover:bg-black hover:text-white duration-75 delay-75">
                                                                    <span>{search}</span>
                                                                </a>
                                                            </Link>    
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between items-center px-4 pt-4">
                                            <p className="font-semibold">Trending on Deso</p>
                                        </div>
                                        <div className="flex flex-row max-w-[80%] justify-center items-center pb-0 px-2">
                                            <div className='grid grid-cols-5 gap-2 p-2 mb-4 w-full'>
                                                {feed?.length > 0 && feed.map((post, index) => {
                                                    const link = post?.tag?.Hashtag.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
                                                        return hashtags.substring(1).toLowerCase()
                                                    })
                                                    const bgImage = post?.ImageURLs[0]
                                                    return (
                                                        <Link href={`/hashtag/${link}`} key={post?.tag?.Hashtag}>
                                                            <a style={{ backgroundImage: `url(${bgImage})`}} className='bg-cover bg-no-repeat bg-center group relative flex flex-col items-center justify-center w-50 h-24 text-sm px-4 rounded-xl duration-75 delay-75 bg-black text-white hover:bg-[#5634ee] font-semibold shadow-xl'>
                                                                <span className='text-white font-semibold text-lg z-10 relative'>{post?.tag?.Hashtag}</span>
                                                                <span className='bg-black/40 group-hover:bg-black/50 absolute rounded-xl left-0 right-0 w-full h-full duration-75 delay-75'></span>
                                                            </a>
                                                        </Link>
                                                    )
                                                })}
                                                {feedLoading && <Loader className={`h-7 w-7 text-[#ec05ad]`}/>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-row relative mr-4 justify-end items-center">
                        {loggedIn ? 
                            <div className="flex flex-row relative items-center justify-end">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="inline-flex w-full justify-center focus:outline-none">
                                                <Image
                                                    className={`rounded-full w-10 h-10 border border-gray-200`}
                                                    alt={`${user?.profile?.Username}'s profile picture`}
                                                    src={user?.profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${user?.profile?.PublicKeyBase58Check}`}
                                                    width={40}
                                                    height={40}
                                                />
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
                                                    <Link href={`/${user?.profile?.Username}`}>
                                                        <a className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'flex flex-row items-center duration-75 delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'
                                                        )}>
                                                            <BsArrowRightShort className="mr-2" size={20} />
                                                            <span>My Profile</span>
                                                        </a>
                                                    </Link>
                                                )}
                                                </Menu.Item>
                                            </div>
                                            <div className="py-1">
                                                <Menu.Item>
                                                {({ active }) => (
                                                    <a onClick={() => logout()}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'flex flex-row items-center duration-75 delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'
                                                    )}>
                                                        <BiExit className='text-black mr-1' size={17} />
                                                        <span>Log out</span>
                                                    </a>
                                                )}
                                                </Menu.Item>
                                            </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                            </div>
                            :
                            <div className="flex flex-row items-center justify-end">
                                <a onClick={() => login()} className="cursor-pointer px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Login</a>
                            </div>    
                        }            
                        <div className="flex flex-row items-center justify-end">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="ml-2 flex w-full justify-center items-center shadow-none focus:outline-none">
                                        <BsPatchQuestionFill className="hover:text-[#5634ee] delay-75 duration-75 text-[#ec05ad]" size={24} />
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
                                            <Menu.Item disabled>
                                                <span className="block px-4 py-2 text-sm">Follow</span>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a href='https://twitter.com/pinesoio' rel="noreferrer" target='_blank' className='flex flex-row items-center duration-75 delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                                    <FaTwitter className='mr-1 text-[#1da1f2]' size={17} />
                                                    <span>Twitter</span>
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a href='https://diamondapp.com/u/Pineso' rel="noreferrer" target='_blank' className='flex flex-row items-center duration-75 group delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                                    <IoDiamondOutline className='text-blue-500 mr-1 duration-75 delay-75' size={17} />
                                                    <span>Diamond</span>
                                                </a>
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                <Link href='/about'>
                                                    <a className="flex flex-row items-center duration-75 delay-75 hover:text-pink-600 hover:bg-gray-100 cursor-pointer px-4 py-2">
                                                        <BsArrowRightShort className="mr-2" size={20} />
                                                        <span>About</span>
                                                    </a>
                                                </Link>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>    
                    </div>
                </div>
            </BrowserView>    
            <MobileView>
                {(showHelpPopUp) && (
                    <style jsx global>
                    {`
                        body {
                            overflow:hidden;
                        }
                    `}
                    </style>
                )}
                <div className='fixed bottom-6 left-0 z-50 right-0 max-auto'>
                    <div className='flex flex-row justify-between items-center max-w-[300px] mx-auto bg-white border rounded-full shadow-xl border-gray-200 py-2 px-6'>
                        <div className='flex flex-col items-center'>
                            <Link href='/' passHref>
                                <a className='text-2xl text-gray-500 duration-75 delay-75 hover:text-[#ec05ad]'><HiHome size={30} /></a>
                            </Link>
                        </div>
                        <div className='flex flex-col items-center'>
                            <Link href='/search' passHref>
                                <a className='text-2xl text-gray-500 duration-75 delay-75 hover:text-[#ec05ad]'><HiSearch size={30} /></a>
                            </Link>
                        </div>
                        <div className='flex flex-col items-center'>
                            {loggedIn ?
                                <Link href={`/${user?.profile?.Username}`} passHref>
                                    <a>
                                        <Image
                                            className={`rounded-full w-10 h-10 border border-gray-200`}
                                            alt={`${user?.profile?.Username}'s profile picture`}
                                            src={user?.profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${user?.profile?.PublicKeyBase58Check}`}
                                            width={40}
                                            height={40}
                                        />
                                    </a>
                                </Link>
                                : <a onClick={() => login()} className='text-2xl text-gray-500 duration-75 delay-75 hover:text-[#ec05ad]'><HiOutlineUserCircle size={34} /></a>
                            }
                        </div>
                        <div className='flex flex-col items-center' ref={helpRef}>
                            <BsPatchQuestionFill onClick={() => setShowHelpPopUp(true)}  className="hover:text-[#5634ee] delay-75 duration-75 text-[#ec05ad]" size={28} />
                            {showHelpPopUp &&
                                <div>
                                    <div className={`fixed left-0 top-0 w-full h-full bg-black/70 z-50`} />
                                    <div className="flex z-50 flex-col justify-center fixed bottom-0 max-h-56 right-12 left-12 m-auto top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                                        <button className="cursor-pointer absolute right-0 -top-8 hover:bg-black hover:text-white duration-75 delay-75 bg-gray-200 p-[6px] rounded-full" onClick={() => setShowHelpPopUp(false)}>
                                            <FaTimes size={12} />
                                        </button>
                                        <h3 className="text-gray-500 px-4 pb-2">Follow</h3>
                                        <a href='https://twitter.com/pinesoio' rel="noreferrer" target='_blank' className='flex flex-row duration-75 delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                            <FaTwitter className='mr-1 text-[#1da1f2]' size={17} />
                                            <span>Twitter</span>
                                        </a>
                                        <a href='https://diamondapp.com/u/Pineso' rel="noreferrer" target='_blank' className='flex flex-row duration-75 group delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                            <IoDiamondOutline className='text-blue-500 mr-1 duration-75 delay-75' size={17} />
                                            <span>Diamond</span>
                                        </a>
                                        <Link href='/about' passHref>
                                            <a className="flex flex-row duration-75 delay-75 hover:text-pink-600 hover:bg-gray-100 cursor-pointer px-4 py-2">
                                                <BsArrowRightShort className="mr-1" size={20} />
                                                <span>About</span>
                                            </a>
                                        </Link>
                                        {isLoggedIn ?
                                            <a onClick={() => logout()} className='flex flex-row duration-75 group delay-75 hover:bg-gray-100 cursor-pointer px-4 pb-2'>
                                                <BiExit className='text-black mr-1' size={17} />
                                                <span>Log out</span>
                                            </a>
                                            :
                                            <a onClick={() => login()} className='flex flex-row duration-75 group delay-75 hover:bg-gray-100 cursor-pointer px-4 pb-2'>
                                                <BiExit className='text-black mr-1' size={17} />
                                                <span>Log In</span>
                                            </a>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </MobileView>
        </>
    )
}

export default Header

    
    
    
  
    