import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getSingleTagFeed = async ({ queryKey }) => {
    const [_key, { slug }] = queryKey;
    const pins = [];
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 300,
        FetchSubcomments: true,
        MediaRequired: true,
        SortByNew: true,
        Tag: '#' + slug,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.HotFeedPage;

        const filtered = posts.filter(post => {
            return post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        });

        // filtered.map(async (post) => {
        //     getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
        //         post.imageSize = { width, height };
        //     })
        // });

        return filtered
    }
}

export const FetchSingleTagFeed = ({slug}) => {
    return useQuery([['single-tag', slug], { slug }], getSingleTagFeed, {
        keepPreviousData: true,
    });
}