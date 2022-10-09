import { EXTERNAL_LINK } from "@app/lib/constants";
import { calculateDurationUntilNow } from "@app/lib/utils";
import { HiChatAlt2, HiExternalLink, HiHeart, HiOutlineChatAlt2, HiOutlineHeart, HiRefresh } from "react-icons/hi"
import { IoDiamondOutline } from "react-icons/io5";

const MetaCard = ({ post }) => {
    const reposts = (parseInt(post.RepostCount) + parseInt(post.QuoteRepostCount))
    return (
        <div className='flex flex-row justify-between w-full items-center mt-4'>
            <div className="flex flex-row flex-auto text-gray-700 justify-between">
                <div className="flex flex-row justify-center items-center">
                    {post.LikeCount > 0 ? <HiHeart size={17} /> : <HiOutlineHeart size={17} />}
                    <span className="ml-1">{post.LikeCount}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    {post.CommentCount > 0 ? <HiChatAlt2 size={19} /> : <HiOutlineChatAlt2 size={19} />}
                    <span className="ml-1">{post.CommentCount}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <HiRefresh size={18} />
                    <span className="ml-1">{reposts}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <IoDiamondOutline size={17} />
                    <span className="ml-1">{post.DiamondCount}</span>
                </div>
            </div>
            <div className="flex flex-row flex-1 items-center justify-end">
                <a href={`${EXTERNAL_LINK}/posts/${post.PostHashHex}`} target="_blank" className="flex text-gray-700 items-center group duration-75 delay-75 hover:text-black flex-row">
                    <HiExternalLink size={20} />
                    <span className="ml-1 text-sm">{calculateDurationUntilNow(post.TimestampNanos)}</span>
                </a>
            </div>
        </div>

    )
}

export default MetaCard