import { BASE_URI } from "@app/lib/constants";
import { getImageSize } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getNFTFeed = async () => {
    const pins = [];
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 2500,
        MediaRequired: true,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.HotFeedPage;
        // const filtered = posts.filter(post => {
        //     return post.IsNFT === true && post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        // });

        const filtered = posts.filter(post => {
            if (post.IsNFT === true && (post.ImageURLs !== null && post.ImageURLs.length > 0 && post.ImageURLs[0].URL !== '') || (post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0].URL !== '')) {
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

export const FetchNFTFeed = () => {
    return useQuery(['nft-feed'], getNFTFeed, {
        keepPreviousData: true,
    });
}