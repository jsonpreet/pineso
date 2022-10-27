import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getGlobalFeed = async () => {
    const pins = [];
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 300,
        FetchSubcomments: true,
        GetPostsForGlobalWhitelist: true,
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

        // filtered.map(async (post) => {
        //     getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
        //         post.imageSize = { width, height };
        //     })
        // });

        return filtered
    }
}

export const FetchGlobalFeed = () => {
    return useQuery(['global-feed'], getGlobalFeed, {
        keepPreviousData: true,
    });
}