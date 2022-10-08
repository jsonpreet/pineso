import { FetchLatestFeed } from '@data/latest-feed'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'

const RelativePosts = ({ parent }) => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchLatestFeed({ limit: 50, parent: parent });
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (isLoading) {
        return ( <LoadingLoader/> )
    }
    if (isFetching) {
        return ( <FetchingLoader /> )
    }
    if (isFetched) {
        return (
            <>
                <div className='flex flex-col mt-10'>
                    <h3 className='text-xl mb-5 text-center font-semibold'>More Recent Pins</h3>
                    <div className='w-full lg:columns-7 sm:columns-3 gap-4'>
                        {posts?.length > 0 && posts.map((post, index) => {
                            return <Post post={post} key={index} />
                        })}
                    </div>
                </div>
            </>
        )
    }
}

export default RelativePosts