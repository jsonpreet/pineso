import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getHotFeed = async (limit, seenPosts) => {
    const seenPostLists = seenPosts.length > 0 ? seenPosts.map(
        (post) => post.PostHashHex
    ) : [];
    const pins = [];
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 700,
        SeenPosts: seenPostLists,
        FetchSubcomments: true,
        MediaRequired: true,
        SortByNew: true
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.HotFeedPage;

        const filtered = posts.filter(post => {
            if ((post.ImageURLs !== null && post.ImageURLs.length > 0 && post.ImageURLs[0].URL !== '') || (post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0].URL !== '')) {
                return post
            }
        });

        // const filtered2 = posts.filter(post => {
        //     return post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0].URL !== '';
        // });

        // filtered.map(async (post) => {
        //     getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
        //         post.imageSize = { width, height };
        //     })
        // });

        return filtered;
    }
}

export const FetchHotFeed = () => {
    return useQuery(['hotfeed'], getHotFeed, {
        keepPreviousData: true,
    });
}

export const FetchInfiniteHotFeed = (limit) => {
    return useInfiniteQuery(['infinite-hot-feed'], ({ pageParam = 0 }) => getHotFeed(limit, pageParam),
        {
            keepPreviousData: true,
            getNextPageParam: (lastPage, pages) => {
                if(lastPage === null) {
                    return null;
                } else {
                    console.log(pages);
                    return lastPage;
                }
            }
        }
    );
}