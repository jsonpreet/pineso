import { useEffect, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import Logo from "./Logo";
import Deso from 'deso-protocol';
import useApp from "@app/stores/store";

const Header = () => {

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

    const login = async () => {
        if (deso) {
            const response = await deso.identity.derive(request);
            if (response) {
                setUser(response)
                setLoggedIn(true)
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
        <div className={`header-section fixed flex top-0 left-0 w-full bg-opacity-50 z-10 flex-row h-[70px] box-border py-2 px-4 bg-white backdrop-blur-3xl`}>
            <div>
                <Link href="/" className="cursor-pointer">
                    <a><Logo/></a>
                </Link>
            </div>
            <div className="flex flex-row ml-4 justify-center items-center">
                <Link href="/">
                    <a className="px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Home</a>
                </Link>
                <Link href="/hot">
                    <a className="px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Hot</a>
                </Link>
                <Link href="/latest">
                    <a className="px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Latest</a>
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
                    <a className="px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Logout</a>
                    :
                    <a onClick={() => login()} className="px-4 py-2 text-md font-semibold hover:bg-black rounded-full hover:text-white duration-75 delay-75">Login</a>
                }                
            </div>
        </div>
    )
}

export default Header