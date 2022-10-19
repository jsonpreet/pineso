import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Post } from '@components/post'

const Grid = ({ posts }) => {
    return (
        <>    
            <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 3, 900: 7}}>
                <Masonry gutter='10px'>
                    {posts.map((post, index) => {
                        return <Post post={post} key={index} />
                    })}
                </Masonry>
            </ResponsiveMasonry>
        </>
    )
}

export default Grid