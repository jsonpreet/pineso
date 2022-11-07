import Link from "next/link"
import { HiCheckCircle } from "react-icons/hi"
import UserImage from "@components/ui/UserImage"
import { CommentMeta } from "@components/ui/cards"
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { LinkifyOptions } from "@app/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";


const CommentCard = ({ isSub, comment, profile}) => {
    const comments = comment.Comments
    
    const [readMore, setReadMore] = useState(false)

    useEffect(() => {
        if (comment) {
            checkLength();
        }
    }, [comment])

    const checkLength = () => {
        (comment.Body.length > 100) ? setReadMore(false) : setReadMore(true)
    }
    return (
        <div className={`flex my-4 flex-col ${isSub ? `sub-comment` : ''}`}>
            <div className='flex flex-row'>
                <div className='image bg-gray-300 shadow rounded-full w-[40px] h-[40px]'>
                    {/* <UserImage classes='w-[40px] shadow h-[40px]' username={profile?.Username} profile={profile} /> */}
                    <Link href={`/${profile.Username}`}>
                        <a>
                            <Image
                                className={`rounded-full border border-gray-200`}
                                alt={`${profile?.Username}'s profile picture`}
                                src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`}
                                width={40}
                                height={40}
                            />
                        </a>
                    </Link>
                </div>
                <div className='flex flex-col ml-2 items-start flex-1'>
                    <div className='flex flex-row items-center justify-center'>
                        <Link href={`/${profile.Username}`}>
                            <a className='inline-block group'>
                                <div className='flex flex-row justify-center items-center'>
                                    <span className="mr-1 text-black group-hover:text-[#ec05ad] duration-75 delay-75 font-semibold">{profile.Username}</span>
                                    {profile.IsVerified && <span><HiCheckCircle className="text-[#ec05ad]" size={16} /></span>}
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className='block'>
                        <span className='text-black break-all whitespace-pre-wrap'>
                            <Linkify options={LinkifyOptions}>
                                {readMore ? comment.Body : `${comment.Body.substring(0, 100)}...`}
                            </Linkify>
                            {!readMore &&
                                <button className='ml-1 font-semibold hover:underline' onClick={() => setReadMore(true)}>
                                    Read More
                                </button>
                            }
                        </span>
                    </div>
                    <CommentMeta post={comment} />
                </div>
            </div>
            {/* {comments?.map((reply, index) => {
                const profile = reply.ProfileEntryResponse;
                return (
                    <CommentCard isSub={true} key={index} comment={reply} profile={profile} />
                )
            })} */}
            
        </div>
    )
}

export default CommentCard