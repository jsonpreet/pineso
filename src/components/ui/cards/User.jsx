import { FetchIsFollowing } from "@app/data/user";
import { nFormatter } from "@app/lib/utils";
import useApp from "@app/stores/store";
import Link from "next/link";
import { HiCheckCircle } from "react-icons/hi";
import UserImage from "@components/ui/UserImage";

const UserCard = ({ follows, post, user, isFollowing }) => {
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    return (
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row justify-center'>
                <div className='image bg-gray-300 shadow rounded-full w-12 h-12'>
                    <UserImage classes='w-12 shadow h-12' publickey={post.PublicKeyBase58Check} />
                </div>
                <div className='flex flex-col ml-2 items-start justify-start'>
                    <div>
                        <Link href={`/${post.Username}`}>
                            <a className='flex flex-row justify-center items-center'>
                                <span className="mr-1 text-black font-semibold leading-none">{post.Username}</span>
                                {post.IsVerified && <span><HiCheckCircle className="text-[#ec05ad]" size={16} /></span>}
                            </a>
                        </Link>
                    </div>
                    <div>
                        <span className='text-black leading-none'>{nFormatter(follows, 1)} Followers</span>
                    </div>
                </div>
            </div>
            <div className='follow -mt-2'>
                {isLoggedIn ?
                    (isFollowing) ?
                        <button className='bg-[#ec05ad] hover:bg-[#5634ee] text-white duration-75 delay-75 rounded-full px-4 py-1'>Following</button> :
                        <button className='hover:bg-[#5634ee] hover:text-white bg-gray-300 duration-75 delay-75 text-black rounded-full px-4 py-1'>Follow</button>
                    :
                    <button className='hover:bg-[#ec05ad] hover:text-white bg-gray-300 duration-75 delay-75 text-black rounded-full px-4 py-1'>Follow</button>
                }
            </div>
        </div>
    )
}

export default UserCard