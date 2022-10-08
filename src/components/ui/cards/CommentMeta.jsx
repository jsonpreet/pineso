import { EXTERNAL_LINK } from "@app/lib/constants";
import { calculateDurationUntilNow } from "@app/lib/utils";
import { HiChatAlt2, HiExternalLink, HiHeart, HiOutlineChatAlt2, HiOutlineHeart, HiRefresh } from "react-icons/hi"
import { IoDiamondOutline } from "react-icons/io5";

const CommentMeta = ({ post }) => {
    const reposts = (parseInt(post.RepostCount) + parseInt(post.QuoteRepostCount))
    return (
        <div className='flex flex-row justify-between w-full items-center mt-4'>
            <div className="flex flex-row  text-gray-700 justify-between">
                <div className="flex flex-row mr-3 justify-center items-center">
                    {post.LikeCount > 0 ? <HiHeart size={17} /> : <HiOutlineHeart size={17} />}
                    <span className="ml-1 text-sm">{post.LikeCount}</span>
                </div>
                <div className="flex flex-row mr-3 justify-center items-center">
                    {post.CommentCount > 0 ? <HiChatAlt2 size={19} /> : <HiOutlineChatAlt2 size={19} />}
                    <span className="ml-1 text-sm">{post.CommentCount}</span>
                </div>
                <div className="flex flex-row justify-center mr-3 items-center">
                    <IoDiamondOutline size={14} />
                    <span className="ml-1 text-sm">{post.DiamondCount}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <span className="text-sm">{calculateDurationUntilNow(post.TimestampNanos)}</span>
                </div>
            </div>
        </div>

    )
}

export default CommentMeta