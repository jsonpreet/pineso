import { BASE_URI } from "@app/lib/constants";
import { getImageSize } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getNFTFeed = async () => {
    const pins = [];
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 600,
        FetchSubcomments: true,
        MediaRequired: true,
        SortByNew: true
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.HotFeedPage;
        const filtered = posts.filter(post => {
            return post.IsNFT === true && post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        });

        filtered.map(async (post) => {
            getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
                post.imageSize = { width, height };
            })
        });

        return filtered
    }
}

export const FetchNFTFeed = () => {
    return useQuery(['nft-feed'], getNFTFeed, {
        keepPreviousData: true,
    });
}