import { CommentCard } from '@components/ui/cards';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Comments = ({ post }) => {
    const comments = post?.Comments?.slice(0, 3)
    const [nodes, setNodes] = useState({ '1': { 'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands' } });
    
    useEffect(() => {
        getAppState()
    }, [post])

    const getAppState = async () => {
        const request = {
            "PublicKeyBase58Check": '',
        }
        //const response = await deso.metaData.getAppState(request);
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-app-state`,request)
        if (data) {
            setNodes(data.Nodes)
        } else {
            setNodes({'1' : {'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands'}})
        }
    }

    const node = nodes[post?.PostExtraData?.Node] || nodes[1]

    const nodeURL = (node.URL !== '') ? node.URL : `https://node.deso.org`;


    return (
        <div className='flex flex-col mt-4'>
            <div>
                <h3 className='text-lg font-semibold'><span className='mr-1'>{post.CommentCount}</span>comments</h3>
            </div>
            {comments?.map((comment, index) => {
                const profile = comment.ProfileEntryResponse;
                return (
                    <CommentCard isSub={false} key={index} comment={comment} profile={profile} />
                )
            })}
            {
                post?.Comments?.length > 3 &&
                <a href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' rel="noopener noreferrer nofollow" className='bg-black hover:bg-[#5634ee] text-white duration-75 delay-75 rounded-full mt-3 px-4 py-2 text-center'>Read More Comments</a>
            }

        </div>
    )
}

export default Comments