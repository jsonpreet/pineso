import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/future/image'
import { determineNewHeight } from '@app/lib/utils'
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';

const Post = ({post, scrollPosition}) => {
    const pinRef = useRef(null)
    const [loading, setLoading] = useState(false)
    // const [pinWidth, setWidth] = useState(0);
    // const [pinHeight, setHeight] = useState(0);
    // const height = Math.round((post.imageSize?.height / post.imageSize?.width) * 254)
    // const defaultHeight = determineNewHeight(post.imageSize?.width, post.imageSize?.height, 254)
    // useEffect(() => {
    //     const height = determineNewHeight(post.imageSize?.width, post.imageSize?.height, 254)
    //     setHeight(height)
    // }, [post.imageSize])

    // useEffect(() => {
    //     if (pinRef.current) {
    //         const width = pinRef.current.offsetWidth;
    //         setWidth(width)
    //         const newHeight = determineNewHeight(post.imageSize?.height, post.imageSize?.width, width)
    //         setHeight(newHeight);
    //     }
    // }, [pinRef.current]);

    // if (!isNaN(pinHeight) && pinHeight > 0) {
    //     height = pinHeight
    // } else if (!isNaN(defaultHeight) && defaultHeight > 0) {
    //     height = defaultHeight   
    // }
    return (
        <>
            <motion.div
                ref={pinRef}
                className={`bg-white rounded-xl mb-4 overflow-hidden relative flex flex-col items-center justify-center ${loading ? `h-[300px]` : ``} `}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                    default: {
                        duration: 0.3,
                        ease: [0, 0.71, 0.2, 1.01]
                    },
                }}
            >
                <Link href={`/pin/${post.PostHashHex}`} passHref shallow={true}>
                    <a className='cursor-zoom'>
                        <LazyLoadImage
                            alt='Picture of the author'
                            effect="blur"
                            beforeLoad={() => setLoading(true)}
                            afterLoad={() => setLoading(false)}
                            scrollPosition={scrollPosition}
                            src={post.ImageURLs[0]}
                        />
                    </a>
                </Link>
                {/* <picture>
                    <img
                        src={post.ImageURLs[0]}
                        alt='Picture of the author'
                    />
                </picture> */}
            </motion.div>
        </>
    )
}

export default trackWindowScroll(Post)