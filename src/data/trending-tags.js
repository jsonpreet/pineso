import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getSingleTagFeed = async (tag) => {
    const endpoint = 'get-hot-feed';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ResponseLimit: 20,
        FetchSubcomments: true,
        MediaRequired: true,
        SortByNew: true,
        Tag: tag.Hashtag,
    })
    if (response === null) {
        return null
    } else {
        const posts = response.data.HotFeedPage;

        const filtered = posts.filter(post => {
            return post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        });

        filtered.map(async (post) => {
            post.tag = tag;
        });
        const random = filtered.sort(function () { return 0.5 - Math.random() });
        // const numbers = [0, 1, 2, 3, 4];
        // return numbers.map((number) => {
        //     if (filtered[number].ImageURLs !== null && filtered[number].ImageURLs[0] !== '' && filtered[number].ImageURLs[0] !== undefined) {
        //         const ext = get_url_extension(filtered[number].ImageURLs[0]);
        //         if (SUPPORTED_FORMATS.includes(ext)) {
        //             return filtered[number]
        //         }
        //     }
        // })
        if (random[0].ImageURLs !== null && random[0].ImageURLs[0] !== '' && random[0].ImageURLs[0] !== undefined) {
            const ext = get_url_extension(random[0].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[0]
            }
        }
        else if (random[1].ImageURLs !== null && random[1].ImageURLs[0] !== '' && random[1].ImageURLs[0] !== undefined) {
            const ext = get_url_extension(random[1].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[1]
            }
        } else if (random[2].ImageURLs !== null && random[2].ImageURLs[0] !== '' && random[2].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[2].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[2]
            }
        } else if (random[3].ImageURLs !== null && random[3].ImageURLs[0] !== '' && random[3].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[3].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[3]
            }
        } else if (random[4].ImageURLs !== null && random[4].ImageURLs[0] !== '' && random[4].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[4].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[4]
            }
        } else if (random[5].ImageURLs !== null && random[5].ImageURLs[0] !== '' && random[5].ImageURLs[0] !== undefined) {
            const ext = get_url_extension(random[5].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[5]
            }
        }
        else if (random[6].ImageURLs !== null && random[6].ImageURLs[0] !== '' && random[6].ImageURLs[0] !== undefined) {
            const ext = get_url_extension(random[6].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[6]
            }
        } else if (random[7].ImageURLs !== null && random[7].ImageURLs[0] !== '' && random[7].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[7].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[7]
            }
        } else if (random[8].ImageURLs !== null && random[8].ImageURLs[0] !== '' && random[8].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[3].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[8]
            }
        } else if (random[9].ImageURLs !== null && random[9].ImageURLs[0] !== '' && random[9].ImageURLs[0] !== undefined) {
           const ext = get_url_extension(random[9].ImageURLs[0]);
            if (SUPPORTED_FORMATS.includes(ext)) {
                return random[9]
            }
        } else {
            return null
        }
    }
}

export const getTrendingTags = async () => {
    const response = await axios.get(`https://openprosperapi.xyz/api/v0/p/social/trending-hashtags-x8k6jw1`);
    if (response === null) {
        return null
    } else {
        return response.data.value.Hours24.Top10Hashtags
    }
}

export const getTrendingTagsWithFeed = async () => {
    const tags = await getTrendingTags();
    if (tags === null) {
        return null
    } else {
        const promises = tags.map(async (tag) => {
            const post = await getSingleTagFeed(tag);
            return post
        });
        const posts = await Promise.all(promises);
        return posts
    }
    //     return tags.map((tag) => {
    //         const response = getSingleTagFeed(tag).then((res) => {
    //             return res
    //         });
    //         return response;
    //     })
    // }
    // const data =  await axios.get(`https://openprosperapi.xyz/api/v0/p/social/trending-hashtags-x8k6jw1`).then((response) => {
    //     if (response === null) {
    //         return null
    //     } else {
    //         const tags = response.data.value.Hours24.Top10Hashtags
    //         return tags.map((tag) => {
    //             const response = getSingleTagFeed(tag).then((res) => {
    //                 return res
    //             });
    //             return response;
    //         })
    //     }
    // });
}

export const FetchTrendingTagsWithFeed = () => {
    const queryClient = new QueryClient();
    return useQuery(['trending-tags-feed'], getTrendingTagsWithFeed, {
        placeholderData: () => {
            return queryClient.getQueryData(['trending-tags-feed'])
        },
        cacheTime: Infinity,
        keepPreviousData: true,
    });
}

export const FetchTrendingTags = () => {
    return useQuery(['trending-tags'], getTrendingTags, {
        keepPreviousData: true,
    });
}