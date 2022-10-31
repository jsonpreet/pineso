import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { get_url_extension } from '@app/lib/utils'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { SUPPORTED_FORMATS } from '@app/lib/constants';
import SimpleImageSlider from "react-simple-image-slider";
import { FaPlay } from "react-icons/fa";

const Post = ({post, scrollPosition}) => {
    const pinRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const isImage = post.ImageURLs !== null && post.ImageURLs.length > 0 && post.ImageURLs[0] !== '' ? true : false
    const isVideo = post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0] !== '' ? true : false
    const im = (post.ImageURLs !== null && post.ImageURLs[0] !== '') ? SUPPORTED_FORMATS.indexOf(get_url_extension(post.ImageURLs[0])) !== -1 : true
    if (!im) {
      return null  
    }
    return (
        <>
            <div ref={pinRef} className={`bg-white rounded-xl overflow-hidden relative flex flex-col items-center justify-center ${loading ? `h-[300px]` : ``} `}>
                <Link href={`/pin/${post.PostHashHex}`} passHref shallow={true}>
                    <a className='cursor-zoom group w-full flex relative flex-col' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                        {isImage && 
                            <LazyLoadImage
                                alt={`Pin by ${post.ProfileEntryResponse?.Username}`}
                                wrapperClassName='w-full'
                                effect="blur"
                                // beforeLoad={() => setLoading(true)}
                                // afterLoad={() => setLoading(false)}
                                placeholderSrc='https://placekitten.com/300/500'
                                src={post.ImageURLs[0]}
                                className='rounded-xl border w-full border-gray-100'
                            />
                        }
                        {
                            isVideo && 
                            <>
                                <LazyLoadImage
                                    alt={`Pin by ${post.ProfileEntryResponse?.Username}`}
                                    effect="blur"
                                    wrapperClassName='w-full'
                                    // beforeLoad={() => setLoading(true)}
                                    // afterLoad={() => setLoading(false)}
                                    placeholderSrc='https://placekitten.com/300/500'
                                    src={`${post.VideoURLs[0].replace('iframe.', '')}/thumbnails/thumbnail.gif?time=1s&height=520&duration=4s`}
                                    className='rounded-xl border w-full border-gray-100'
                                />
                                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                                    <div className='absolute top-0 left-0 w-full h-full bg-black opacity-10'></div>
                                    <FaPlay size={30} className='text-white' />
                                </div>

                                {/* ?time=1s&height=520&duration=4s */}
                                {/* <div className='mt-2 feed-post__video-container relative bg-black w-full h-[400px] rounded-xl max-h-[700px] overflow-hidden' >
                                    <iframe src={post.VideoURLs[0]} className='w-full h-full feed-post__video' allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen></iframe>
                                </div> */}
                            </>
                        }
                        <div className={`${show ? `opacity-100` : `opacity-0`} rounded-xl flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full flex-col items-start justify-start px-4 py-1`}/>
                    </a>
                </Link>
            </div>
        </>
    )
}

export default Post