import { nFormatter } from "@app/lib/utils";
import useApp from "@app/stores/store";
import Link from "next/link";
import UserImage from "@components/ui/UserImage";
import { toast } from "react-toastify";
import { BsPatchCheckFill } from "react-icons/bs";
import Image from "next/image";

const UserCard = ({ follows, profile, user, isFollowing }) => {
    const isLoggedIn = useApp((state) => state.isLoggedIn)

    const profileID = profile?.PublicKeyBase58Check;
    const userID = user?.PublicKeyBase58Check;

    const onFollow = () => {
        
        toast.warning('Follow is no enabled!', {
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

    return (
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row justify-center'>
                <div className='image bg-gray-300 shadow rounded-full w-12 h-12'>
                    {/* <UserImage classes='w-12 shadow h-12' username={profile?.Username} profile={profile} /> */}
                    <Link href={`/${profile?.Username}`}>
                        <a>
                            <Image
                                className={`rounded-full border border-gray-200 w-12 shadow h-12`}
                                alt={`${profile?.username}'s profile picture`}
                                width={48}
                                height={48}
                                src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`}
                            />
                        </a>
                    </Link>
                </div>
                <div className='flex flex-col ml-2 items-start justify-center'>
                    <div>
                        <Link href={`/${profile.Username}`}>
                            <a className='flex flex-row justify-center items-center'>
                                <span className="mr-1 text-black font-semibold duration-75 delay-75 hover:text-[#ec05ad] leading-none">{profile.Username}</span>
                                {profile.IsVerified && <span><BsPatchCheckFill className="text-[#ec05ad]" size={16} /></span>}
                            </a>
                        </Link>
                    </div>
                    <div>
                        <span className='text-black leading-none'>{nFormatter(follows, 1)} Followers</span>
                    </div>
                </div>
            </div>
            <div className='follow -mt-2'>
                {(isLoggedIn && userID !== profileID) ?
                    (isFollowing) ?
                        <button onClick={() => onFollow()} className='bg-[#ec05ad] hover:bg-[#5634ee] text-white duration-75 delay-75 rounded-full px-4 py-1'>Following</button> :
                        <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-gray-200 duration-75 delay-75 text-black rounded-full px-4 py-1'>Follow</button>
                    :
                    (userID !== profileID) && <button onClick={() => onFollow()} className='hover:bg-[#ec05ad] hover:text-white bg-gray-200 duration-75 delay-75 text-black rounded-full px-4 py-1'>Follow</button>
                }
            </div>
        </div>
    )
}

export default UserCard