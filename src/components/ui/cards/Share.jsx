
import { exportPNG } from '@app/lib/downloader'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import useApp from '@app/stores/store'
import { useEffect, useState } from 'react'
import { HiDotsHorizontal, HiOutlineDownload, HiOutlineLink, HiOutlinePaperAirplane, HiShare } from 'react-icons/hi'
import { BASE_URL } from '@app/lib/constants';
 import { toast } from 'react-toastify';
import { savePost } from '@app/data/save';

const ShareCard = ({rootRef, post}) => {
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const [isSaved, setIsSaved] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
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

    return (
        <div className='flex sticky flex-row justify-between items-center border-b border-gray-50 pb-4 mb-4'>
            <div className='flex flex-row justify-center'>
                <div className='options mr-4'>
                    <button onClick={() => exportPNG({rootRef})} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                        <HiOutlineDownload size={30} />
                    </button>
                </div>
                <div className='share mr-4'>
                    <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                        <HiOutlinePaperAirplane size={24} />
                    </button>
                </div>
                <div className='link'>
                    <CopyToClipboard text={`${BASE_URL}/pin/${post.PostHashHex}`} onCopy={() => copied()}>
                    <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                        <HiOutlineLink size={24} />
                        </button>
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
    )
}

export default ShareCard