import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { get_url_extension } from '@app/lib/utils'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { SUPPORTED_FORMATS } from '@app/lib/constants';

const Post = ({post, scrollPosition}) => {
    const pinRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const im = SUPPORTED_FORMATS.indexOf(get_url_extension(post.ImageURLs[0])) !== -1;
    if (!im) {
      return null  
    }
    return (
        <>
            <div ref={pinRef} className={`bg-white rounded-xl overflow-hidden relative flex flex-col items-center justify-center ${loading ? `h-[300px]` : ``} `}>
                <Link href={`/pin/${post.PostHashHex}`} passHref shallow={true}>
                    <a className='cursor-zoom group flex relative flex-col' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                        <LazyLoadImage
                            alt={`Pin by ${post.ProfileEntryResponse?.Username}`}
                            effect="blur"
                            // beforeLoad={() => setLoading(true)}
                            // afterLoad={() => setLoading(false)}
                            placeholderSrc='https://placekitten.com/300/500'
                            src={post.ImageURLs[0]}
                            className='rounded-xl border border-gray-100'
                        />
                        <div className={`${show ? `opacity-100` : `opacity-0`} rounded-xl flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full flex-col items-start justify-start px-4 py-1`}/>
                    </a>
                </Link>
            </div>
        </>
    )
}

export default Post