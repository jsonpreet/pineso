import { FetchLatestFeed } from '@data/latest-feed'
import { Post } from '@components/post'
import { Loader, FetchingLoader, LoadingLoader, ErrorLoader } from '@components/loader'

const RelativePosts = ({ parent }) => {
    const { data: posts, isLoading, isFetching, isFetched, error, isError } = FetchLatestFeed({ limit: 50, parent: parent });
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    
    return (
        <>
            <div className='flex flex-col mt-10'>
                <div className='text-center items-center justify-center flex-1 flex flex-row'>
                    <h3 className='text-xl mb-5 relative inline-block text-center font-semibold'>
                        <span className='mb-4 block'>More Recent Pins</span>
                        <span className='animate-border absolute bottom-0 left-0 w-[70%] mx-auto right-0 rounded-md bg-white bg-gradient-to-r from-[#ec05ad] to-[#5634ee] bg-[length:400%_400%] p-[2px]'/>
                    </h3>
                </div>
                {isLoading && 
                    <div className={`flex flex-col justify-center items-center mt-[30px] bg-white`}>
                        <Loader className={`h-7 w-7 text-[#ec05ad]`} />
                    </div>
                }
                <div className='w-full lg:columns-7 sm:columns-3 gap-4'>
                    {isFetched && posts?.length > 0 && posts.map((post, index) => {
                        return <Post post={post} key={index} />
                    })}
                </div>
            </div>
        </>
    )
}

export default RelativePosts