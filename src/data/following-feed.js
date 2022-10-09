import { BASE_URI } from "@app/lib/constants";
import { getImageSize } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getFollowingFeed = async ({queryKey}) => {
    const [_key, { publicKey }] = queryKey
    const pins = [];
    const endpoint = 'get-posts-stateless';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ReaderPublicKeyBase58Check: publicKey,
        NumToFetch: 150,
        MediaRequired: true,
        GetPostsForFollowFeed: true,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.PostsFound;
        const filtered = posts.filter(post => {
            return post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        });

        filtered.map(async (post) => {
            getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
                post.imageSize = { width, height };
            })
        });

        return filtered
    }
}

export const FetchFollowingFeed = (publicKey) => {
    return useQuery([['following-feed', publicKey], {publicKey}] , getFollowingFeed, {
        keepPreviousData: true,
    });
}