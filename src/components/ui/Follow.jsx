
import { toast } from 'react-toastify';
import { toastOptions} from '@app/lib/utils';
import Deso from 'deso-protocol';
import {Loader } from '@components/loader';
import { useEffect, useState } from 'react';
import useApp from '@app/stores/store';
import { getIsFollowing } from '@app/data';
import { useQuery } from '@tanstack/react-query';

const Follow = ({user, profile}) => {
    
    const [deso, setDeso] = useState()
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const [follow, setFollow] = useState(false)
    const [loading, setLoader] = useState(false)

    const profileID = profile?.PublicKeyBase58Check || null;
    const userID = user?.profile?.PublicKeyBase58Check || null;


    const { data: isFollowing, isFetched, isLoading } = useQuery([['is-following', `${userID}-${profileID}`], { publicKey: userID, followingKey: profileID }], getIsFollowing, { enabled: !!profileID, })
    useEffect(() => {
        const deso = new Deso();
        if (deso) {
            setDeso(deso);
        }
    }, [])

    useEffect(() => {
        if (isFollowing) {
            setFollow(true)
        } else {
            setFollow(false)
        }
    }, [isFollowing])

    const onFollow = async() => {
        if (!isLoggedIn) {
            toast.error('Please login to follow this user', toastOptions);
        } else {
            setLoader(true)
            if (isFollowing) {
                const request = {
                    "IsUnfollow": true,
                    "FollowedPublicKeyBase58Check": profileID,
                    "FollowerPublicKeyBase58Check": userID
                };
                const response = await deso.social.createFollowTxnStateless(request);
                if (response && response.TxnHashHex !== undefined) {
                    setLoader(false)
                    setFollow(false)
                    toast.success('Unfollowed successfully', toastOptions);
                } else {
                    setLoader(false)
                    toast.error('Something went wrong', toastOptions);
                }
            } else {
                const request = {
                    "IsUnfollow": false,
                    "FollowedPublicKeyBase58Check": profileID,
                    "FollowerPublicKeyBase58Check": userID
                };
                const response = await deso.social.createFollowTxnStateless(request);
                if(response && response.TxnHashHex !== undefined) {
                    setLoader(false)
                    setFollow(true)
                    toast.success('Followed successfully', toastOptions);
                } else {
                    setLoader(false)
                    toast.error('Something went wrong', toastOptions);
                }
            }
        }
    }
    if (isLoading) {
        return ( <Loader className='w-4 h-4'/> )
    }
    if (isFetched) {
        return (
            <>
                {(isLoggedIn && userID !== profileID) ?
                    (follow) ?
                        <button onClick={() => onFollow()} className='bg-[#5634ee] hover:bg-[#ec05ad] text-white duration-75 delay-75 rounded-full px-4 py-1'>{loading ? <Loader className='w-4 h-4' /> : `Following`}</button>
                        :
                        <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>{loading ? <Loader className='w-4 h-4' /> : `Follow`}</button>
                    :
                    (userID !== profileID) && <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>Follow</button>
                }
            </>
        )
    }
}

export default Follow