
import { exportPNG } from '@app/lib/downloader'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import useApp from '@app/stores/store'
import { useEffect, useState } from 'react'
import { HiDotsHorizontal, HiOutlineDownload, HiOutlineLink, HiOutlinePaperAirplane, HiShare } from 'react-icons/hi'
import { BASE_URL } from '@app/lib/constants';
 import { toast } from 'react-toastify';
import { savePost } from '@app/data/save';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { BsArrowLeftCircleFill, BsArrowLeftShort, BsTwitter, BsWhatsapp } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon, EmailShareButton, EmailIcon } from 'next-share';
import { Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const ShareCard = ({ rootRef, post }) => {
    const router = useRouter()
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const [isSaved, setIsSaved] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false)
    const user = useApp((state) => state.user)
    const copied = () => {
        setIsCopied(true);
        toast.success('Copied link to your clipboard to share', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: false,
            draggable: false,
            closeButton: false,
            progress: undefined,
            theme: "dark",
            icon: false
        });
    }

    const saveIt = async (post, user) => {
        console.log('save it')
        toast.warning('Save is no enabled!', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: false,
            draggable: false,
            closeButton: false,
            progress: undefined,
            theme: "dark",
            icon: false
        });
        //const response = await savePost(post, user);
    }

    const closeSharePopUp = () => {
        setSharePopUpOpen(false)
    }
    const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

    const shareLink = BASE_URL+'/pin/'+post.PostHashHex

    const tweetURL = 'Look at this... 👀'+shareLink

    return (
        <>
            <BrowserView>
                <div className='w-full z-20 backdrop-blur-3xl bg-opacity-50 top-0 flex flex-row justify-between items-center border-b border-gray-50 pb-4 mb-4 relative'>
                    <div className='flex flex-row items-center justify-center'>
                        <div className='flex back mr-4 lg:hidden'>
                            <button className='duration-75 delay-75 hover:text-[#ec05ad] text-gray-400' onClick={() => router.back()}> <BsArrowLeftCircleFill size={48}/> </button>
                        </div>
                        <div className='options mr-4'>
                            <Tooltip content={"Download Image"} rounded color="invert" placement="bottom">
                                <button onClick={() => exportPNG({ rootRef })} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                    <HiOutlineDownload size={30} />
                                </button>
                            </Tooltip>
                        </div>
                        <div className='share mr-4'>
                            <Tooltip content={"Share It"} rounded color="invert" placement="bottom">
                                <button ref={shareRef} onClick={() => setSharePopUpOpen(!sharePopUpOpen)} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                    <HiOutlinePaperAirplane size={24} />
                                </button>
                            </Tooltip>
                            {sharePopUpOpen && (
                                <div className='absolute z-50 top-16 max-w-sm w-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 px-4 py-4'>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row justify-between items-center'>
                                            <div>
                                                <Tooltip content={"Share on Facebook"} rounded color="invert" placement="bottom">
                                                    <FacebookShareButton
                                                        url={shareLink}
                                                        hashtag={'#pinesoio'}>
                                                        <FacebookIcon size={50} round />
                                                    </FacebookShareButton>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <Tooltip content={"Share on Facebook"} rounded color="invert" placement="bottom">
                                                    <TwitterShareButton
                                                        url={tweetURL}
                                                        hashtags={['pinesoio', 'deso', 'desoprotocol', 'web3', 'decentralized', 'web3socialmedia']}
                                                        via='pinesoio'>
                                                        <TwitterIcon size={50} round />
                                                    </TwitterShareButton>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <Tooltip content={"Share on WhatsApp"} rounded color="invert" placement="bottom">
                                                    <WhatsappShareButton
                                                        url={tweetURL}
                                                        separator=":: "
                                                        >
                                                        <WhatsappIcon size={50} round />
                                                    </WhatsappShareButton>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <Tooltip content={"Send Email"} rounded color="invert" placement="bottom">
                                                    <EmailShareButton
                                                        url={shareLink}
                                                        subject='Look at this... 👀 From Pineso.io'
                                                        body='Look at this... 👀'>
                                                        <EmailIcon size={50} round />
                                                    </EmailShareButton>
                                                </Tooltip>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <CopyToClipboard text={`${BASE_URL}/pin/${post.PostHashHex}`} onCopy={() => copied()}>
                                                    <Tooltip content={"Copy Link"} rounded color="invert" placement="bottom">
                                                        <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                                            <HiOutlineLink size={24} />
                                                        </button>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='link'>
                            <CopyToClipboard text={`${BASE_URL}/pin/${post.PostHashHex}`} onCopy={() => copied()}>
                                <Tooltip content={"Copy Link"} rounded color="invert" placement="bottom">
                                    <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                        <HiOutlineLink size={24} />
                                    </button>
                                </Tooltip>
                            </CopyToClipboard>
                        </div>
                    </div>
                    <div className='save flex flex-row'>
                        {post.IsNFT && <span className="bg-[#5634ee] text-white px-4 py-1 rounded-full shadow mr-2">NFT</span>}
                        {isLoggedIn ?
                            (isSaved) ?
                                <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#5634ee] hover:bg-black text-white duration-75 delay-75 rounded-full px-4 py-1'>Saved</button> :
                                <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#ec05ad] hover:bg-black text-white duration-75 delay-75 rounded-full px-4 py-1'>Save</button>
                            :
                            <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#ec05ad] text-white hover:bg-black duration-75 delay-75 rounded-full px-4 py-1'>Save</button>
                        }
                    </div>
                </div>
            </BrowserView>
            <MobileView>
            <div className='w-full z-50 bg-white left-0 px-4 pt-4 fixed backdrop-blur-3xl bg-opacity-50 top-0 flex flex-row justify-between items-center pb-4 mb-4'>
                <div className='flex flex-row items-center justify-center'>
                    <div className='flex back mr-4 lg:hidden'>
                        <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full' onClick={() => router.back()}> <BsArrowLeftShort size={48}/> </button>
                    </div>
                    <div className='options mr-4'>
                        <Tooltip content={"Download Image"} rounded color="invert" placement="bottom">
                            <button onClick={() => exportPNG({ rootRef })} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                <HiOutlineDownload size={30} />
                            </button>
                        </Tooltip>
                    </div>
                    <div className='share mr-4'>
                        <Tooltip content={"Share It"} rounded color="invert" placement="bottom">
                            <button ref={shareRef} onClick={() => setSharePopUpOpen(true)} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                <HiOutlinePaperAirplane size={24} />
                            </button>
                        </Tooltip>
                        {sharePopUpOpen && (
                            <div className='absolute z-20 top-16 max-w-sm w-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 px-4 py-4'>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div>
                                            <Tooltip content={"Share on Facebook"} rounded color="invert" placement="bottom">
                                                <FacebookShareButton
                                                    url={shareLink}
                                                    hashtag={'#pinesoio'}>
                                                    <FacebookIcon size={50} round />
                                                </FacebookShareButton>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <Tooltip content={"Share on Facebook"} rounded color="invert" placement="bottom">
                                                <TwitterShareButton
                                                    url={tweetURL}
                                                    hashtags={['pinesoio', 'deso', 'desoprotocol', 'web3', 'decentralized', 'web3socialmedia']}
                                                    via='pinesoio'>
                                                    <TwitterIcon size={50} round />
                                                </TwitterShareButton>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <Tooltip content={"Share on WhatsApp"} rounded color="invert" placement="bottom">
                                                <WhatsappShareButton
                                                    url={tweetURL}
                                                    separator=":: "
                                                    >
                                                    <WhatsappIcon size={50} round />
                                                </WhatsappShareButton>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <Tooltip content={"Send Email"} rounded color="invert" placement="bottom">
                                                <EmailShareButton
                                                    url={shareLink}
                                                    subject='Look at this... 👀 From Pineso.io'
                                                    body='Look at this... 👀'>
                                                    <EmailIcon size={50} round />
                                                </EmailShareButton>
                                            </Tooltip>
                                        </div>
                                        <div className='flex flex-col items-center'>
                                            <CopyToClipboard text={`${BASE_URL}/pin/${post.PostHashHex}`} onCopy={() => copied()}>
                                                <Tooltip content={"Copy Link"} rounded color="invert" placement="bottom">
                                                    <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                                        <HiOutlineLink size={24} />
                                                    </button>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='link'>
                        <CopyToClipboard text={`${BASE_URL}/pin/${post.PostHashHex}`} onCopy={() => copied()}>
                            <Tooltip content={"Copy Link"} rounded color="invert" placement="bottom">
                                <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                    <HiOutlineLink size={24} />
                                </button>
                            </Tooltip>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className='save flex flex-row'>
                    {post.IsNFT && <span className="bg-[#5634ee] text-white px-4 py-1 rounded-full shadow mr-2">NFT</span>}
                    {isLoggedIn ?
                        (isSaved) ?
                            <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#5634ee] hover:bg-black text-white duration-75 delay-75 rounded-full px-4 py-1'>Saved</button> :
                            <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#ec05ad] hover:bg-black text-white duration-75 delay-75 rounded-full px-4 py-1'>Save</button>
                        :
                        <button onClick={() => saveIt(post.PostHashHex, user.data)} className='bg-[#ec05ad] text-white hover:bg-black duration-75 delay-75 rounded-full px-4 py-1'>Save</button>
                    }
                </div>
            </div>
            </MobileView>
        </>    
        
    )
}

export default ShareCard