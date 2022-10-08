import { CommentCard } from '@components/ui/cards';

const Comments = ({ post }) => {
    const comments = post.Comments
    return (
        <div className='flex flex-col mt-4'>
            <div>
                <h3 className='text-lg font-semibold'><span className='mr-1'>{post.CommentCount}</span>comments</h3>
            </div>
            {/* {comments?.map((comment, index) => {
                const profile = comment.ProfileEntryResponse;
                return (
                    <CommentCard isSub={false} key={index} comment={comment} profile={profile} />
                )
            })} */}
            {
                post.CommentCount > 0 && comments?.length > 0 && <CommentCard isSub={false} comment={comments[0]} profile={comments[0].ProfileEntryResponse} />
            }

        </div>
    )
}

export default Comments