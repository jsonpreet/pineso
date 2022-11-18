import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Loader } from '@components/loader'
import { Post } from '@components/post'

const Grid = ({ isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, posts }) => {
    return (
        <>    
            <div>
                    <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 3, 900: 7}}>
                        <Masonry gutter='10px'>
                            {posts.length > 0 && posts.map((post, index) => {
                                return <Post post={post} key={index} />
                            })}
                        </Masonry>
                    </ResponsiveMasonry>
            </div>
        </>
    )
}

export default Grid