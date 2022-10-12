import { nFormatter } from "@app/lib/utils";
import useApp from "@app/stores/store";
import Link from "next/link";
import UserImage from "@components/ui/UserImage";
import { toast } from "react-toastify";
import { BsPatchCheckFill } from "react-icons/bs";
import { FetchExchangeRate, getFollowings, getFollows, getIsFollowing } from "@app/data";
import { useQuery } from "@tanstack/react-query";

const ProfileCard = ({ profile }) => {
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const user = useApp((state) => state.user)

    const { data: exchange } = FetchExchangeRate();

    const profileID = profile?.PublicKeyBase58Check || null;
    const userID = user?.profile?.PublicKeyBase58Check || null;

    const { data: isFollowing } = useQuery([['is-following', `${userID}-${profileID}`], { publicKey: userID, followingKey: profileID }], getIsFollowing, { enabled: !!userID, })

    const { data: follows } = useQuery([['total-follows', profileID], { publicKey: profileID }], getFollows, { enabled: !!profileID, })

    const { data: followings } = useQuery([['total-followings', profileID], { publicKey: profileID }], getFollowings, { enabled: !!profileID, })

    const exchangeRate = exchange?.USDCentsPerDeSoExchangeRate / 100

    const userCoinPrice = (profile?.CoinPriceDeSoNanos / 1000000000) * exchangeRate;

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
        <div className='flex flex-col rounded-xl relative bg-gray-50 shadow mb-14 items-center'>
            <div className='flex flex-row pt-4 relative justify-center'>
                <div className='image absolute -top-10 bg-gray-300 shadow rounded-full w-20 h-20'>
                    <Link href={`/${profile.Username}`}>
                        <a>
                            <UserImage classes='w-20 shadow h-20' username={profile?.Username} profile={profile} />
                        </a>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col items-center pt-8 pb-4 justify-center'>
                <div>
                    <Link href={`/${profile.Username}`} className='flex flex-row justify-center items-center'>
                        <a>
                            <span className="mr-1 text-black font-semibold duration-75 delay-75 hover:text-[#ec05ad] leading-none">{profile.Username}</span>
                            {profile.IsVerified && <span><BsPatchCheckFill className="text-[#ec05ad]" size={16} /></span>}
                        </a>
                    </Link>
                </div>
                <div className='flex flex-row py-2 items-center'>
                    <span className='text-[#ec05ad] mr-2'>≈${userCoinPrice.toFixed(2)} USD</span>
                </div>
                <div className='flex sm:flex-row flex-col items-center'>
                    <span className='text-black mr-4 leading-none'>{nFormatter(follows, 1)} Followers</span>
                    <span className='text-black leading-none'>{nFormatter(followings, 1)} Followings</span>
                </div>
            </div>
            <div className='follow mb-4'>
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

export default ProfileCard