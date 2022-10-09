import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import Logo from "./Logo";
import Deso from 'deso-protocol';
import useApp from "@app/stores/store";
import { useRouter } from "next/router";
import { Menu, Transition, Switch } from '@headlessui/react'
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { BsFileArrowDown } from "react-icons/bs";
import { classNames } from "@app/lib/utils";
import UserImage from "@components/ui/UserImage";
import { getSingleProfile } from "@app/data/single-profile";

const Header = () => {
    const router = useRouter()
    const user = useApp((state) => state.user)
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const setUser = useApp((state) => state.setUser)
    const setLoggedIn = useApp((state) => state.setLoggedIn)
    const [loggedIn, setUserLoggedIn] = useState()
    const [account, setAccount] = useState()
    const [deso, setDeso] = useState();

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
    
    // useEffect(() => {
    //     window.addEventListener('scroll', isSticky);
    //     return () => {
    //         window.removeEventListener('scroll', isSticky);
    //     };
    // },[]); 
    // /* Method that will fix header after a specific scrollable */
    // const isSticky = (e) => {
    //     const header = document.querySelector('.header-section');
    //     const scrollTop = window.scrollY;
    //     scrollTop >= 250 ? header.classList.add('fixed') : header.classList.remove('fixed');
    // };
    
    return (
        <div className={`header-section fixed z-20 flex top-0 left-0 w-full bg-opacity-50 flex-row h-[70px] box-border py-2 px-4 bg-white backdrop-blur-3xl`}>
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
            <div className="flex flex-row flex-1 mx-4 justify-center items-center">
                <div className="relative w-full">
                    <input className="bg-gray-100 w-full px-4 h-[50px] rounded-full" type="text" placeholder="Search" />
                    <BiSearch className="absolute top-[15px] text-gray-500 right-4" size={24}/>
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
    )
}

export default Header