import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getSearch = async (search) => {
    const endpoint = 'get-profiles';
    const { data } = await axios.post(`${BASE_URI}/${endpoint}`, {
        AddGlobalFeedBool: false,
        FetchUsersThatHODL: false,
        NumToFetch:100,
        UsernamePrefix:search,
    });
    return data;
}

const getSingleProfileFeed = async (profile) => {
    const endpoint = 'get-posts-for-public-key';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: profile.PublicKeyBase58Check,
        NumToFetch: 10,
        MediaRequired: true,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.Posts;
        const filtered = posts.filter(post => {
            return post.ImageURLs !== null && post.ImageURLs[0] !== '' && post.ImageURLs[0] !== undefined;
        });

        filtered.map(async (post) => {
            getImageSize(post.ImageURLs[0]).then(({ width, height }) => {
                post.imageSize = { width, height };
            })
        });

        filtered.map(async (post) => {
            post.profile = profile;
        });
            
        const random = filtered.sort(function () { return 0.5 - Math.random() });

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

export const getSearchPage = async ({ queryKey }) => {
    const [_key, { search }] = queryKey;
    const endpoint = 'get-profiles';
    const {data} = await axios.post(`${BASE_URI}/${endpoint}`, {
        AddGlobalFeedBool: false,
        FetchUsersThatHODL: false,
        NumToFetch:100,
        UsernamePrefix:search,
    });
    // if (response === null) {
    //     return null
    // } else {
    //     const profiles = response.data.ProfilesFound;
    //     const promises = profiles.map(async (profile) => {
    //         const post = await getSingleProfileFeed(profile);
    //         return post;
    //     });
    //     const posts = await Promise.all(promises);
    //     console.log(posts)
    //     return posts
    // }
    // if (data.ProfilesFound.length > 0) {
    //     const promises = data.ProfilesFound.map(async (profile) => {
    //         const post = await getSingleProfileFeed(profile.PublicKeyBase58Check);
    //         return post !== null ? { ...post, profile } : null;
    //     });
    //     const posts = await Promise.all(promises);
    //     console.log(posts)
    //     return posts
    // } else {
    //     return null
    // }
    return data.ProfilesFound;
}

export const FetchSearch = (search) => {
    return useQuery([['search', search], { search }], getSearchPage, {
        keepPreviousData: true,
    });
}