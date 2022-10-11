import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { HiHome, HiOutlineUserCircle, HiSearch } from 'react-icons/hi'
import useApp from "@app/stores/store";
import { useRouter } from "next/router";
import { IoDiamondOutline } from "react-icons/io5";
import { BsArrowRightShort, BsPatchQuestionFill } from "react-icons/bs";
import { FaTimes, FaTwitter } from "react-icons/fa";
import { useDetectClickOutside } from "react-detect-click-outside";
import Deso from "deso-protocol";
import Image from "next/future/image";
import { getSingleProfile } from "@app/data";

const Footer = () => {
    const router = useRouter();
    const { user, isLoggedIn, setLoggedIn, setUser } = useApp((state) => state);
    const [showHelpPopUp, setShowHelpPopUp] = useState(false);
    const [loggedIn, setUserLoggedIn] = useState()
    const [account, setAccount] = useState()
    const [deso, setDeso] = useState();
    const closeHelpPopUp = () => {
        setShowHelpPopUp(false);
    }
    const helpRef = useDetectClickOutside({ onTriggered: closeHelpPopUp, triggerKeys: ['Escape', 'x'], });

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
    return (
        <>
            {showHelpPopUp ? (
                <>
                    <style jsx global>
                    {`
                        body {
                            overflow:hidden;
                        }
                    `}
                    </style>
                    
                </>
            ) : null}
            <div className={` ${showHelpPopUp ? `visible` : `hidden`} fixed left-0 top-0 w-full h-screen bg-black/70 z-50`} />
        
            <div className='lg:hidden fixed bottom-6 left-0 z-50 right-0 max-auto px-16'>
                <div className='flex flex-row justify-between items-center bg-white border rounded-full shadow-xl border-gray-200 py-4 px-6'>
                    <div className='flex flex-col items-center'>
                        <Link href='/'>
                            <HiHome className='text-2xl text-gray-500' size={30} />
                        </Link>
                    </div>
                    <div className='flex flex-col items-center'>
                        <Link href='/search'>
                            <HiSearch className='text-2xl text-gray-500' size={30} />
                        </Link>
                    </div>
                    <div className='flex flex-col items-center'>
                        {!isLoggedIn ? <HiOutlineUserCircle onClick={() => login()} className='text-2xl text-gray-500' size={34} />
                            :
                            (
                                <Link href={`/${user?.profile?.Username}`} passHref>
                                    {/* <UserImage username={user?.profile?.Username} profile={user?.profile} classes={'w-10 h-10 shadow-xl border border-gray-200 '} /> */}
                                    <Image
                                        className={`rounded-full w-10 h-10 border border-gray-200`}
                                        alt={`${user?.profile?.Username}'s profile picture`}
                                        src={user?.profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${user?.profile?.PublicKeyBase58Check}`}
                                        width={40}
                                        height={40}
                                    />
                            </Link>
                            )
                        }
                    </div>
                    <div className='flex flex-col items-center' ref={helpRef}>
                        <BsPatchQuestionFill onClick={() => setShowHelpPopUp(true)}  className="hover:text-[#5634ee] delay-75 duration-75 text-[#ec05ad]" size={28} />
                        {showHelpPopUp &&
                            <div className="flex flex-col justify-center fixed bottom-0 max-h-48 right-12 left-12 m-auto top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                                <button className="cursor-pointer absolute right-0 -top-8 hover:bg-black hover:text-white duration-75 delay-75 bg-gray-200 p-[6px] rounded-full" onClick={() => setShowHelpPopUp(false)}>
                                    <FaTimes size={12} />
                                </button>
                                <h3 className="text-gray-500 px-4 pb-2">Follow</h3>
                                <a href='https://twitter.com/pinesoio' target='_blank' className='flex flex-row duration-75 delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                    <FaTwitter className='mr-1 text-[#1da1f2]' size={17} />
                                    <span>Twitter</span>
                                </a>
                                <a href='https://diamondapp.com/u/Pineso' target='_blank' className='flex flex-row duration-75 group delay-75 hover:bg-gray-100 cursor-pointer px-4 py-2'>
                                    <IoDiamondOutline className='text-blue-500 mr-1 duration-75 delay-75' size={17} />
                                    <span>Diamond</span>
                                </a>
                                <Link href='/page/about' className="flex flex-row duration-75 delay-75 hover:text-pink-600 hover:bg-gray-100 cursor-pointer px-4 pt-2">
                                    <BsArrowRightShort className="mr-1" size={20} />
                                    <span>About</span>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer