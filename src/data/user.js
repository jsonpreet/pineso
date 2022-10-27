import { BASE_URI } from "@app/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getImageSize } from "@app/lib/utils";
import axios from "axios";

// export const getIsFollowing = async (publicKey, followingKey) => {
//     //const [_key, { publicKey, followingKey }] = queryKey;
//     const endpoint = 'is-following-public-key';
//     const response = await axios.post(`${BASE_URI}/${endpoint}`, {
//         PublicKeyBase58Check: publicKey,
//         IsFollowingPublicKeyBase58Check: followingKey,
//     });
//     if (response.status !== 200) {
//         return response
//     } else {
//         return response.data.IsFollowing
//     }
// }

export const getIsFollowing = async ({ queryKey }) => {
    const [_key, { publicKey, followingKey }] = queryKey;
    const pins = [];
    const endpoint = 'is-following-public-key';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey,
        IsFollowingPublicKeyBase58Check: followingKey,
    });
    if (response === null) {
        return null
    } else {
        return response.data.IsFollowing
    }
}

export const getFollows = async ({ queryKey }) => {
    const [_key, { publicKey }] = queryKey;
    const pins = [];
    const endpoint = 'get-follows-stateless';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey,
        GetEntriesFollowingUsername: true
    });
    if (response === null) {
        return null
    } else {
        return response.data.NumFollowers
    }
}

export const getFollowings = async ({ queryKey }) => {
    const [_key, { publicKey }] = queryKey;
    const endpoint = 'get-follows-stateless';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey,
        GetEntriesFollowingUsername: false
    });
    if (response === null) {
        return null
    } else {
        return response.data.NumFollowers
    }
}

export const getUserFeed = async ({queryKey}) => {
    const [_key, { publicKey }] = queryKey
    const pins = [];
    const endpoint = 'get-posts-for-public-key';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey,
        NumToFetch: 150,
        MediaRequired: true,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.Posts;
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

export const FetchFollows = ({publicKey}) => {
    return useQuery([['total-follows', publicKey], { publicKey }], getFollows);
}

export const FetchFollowings = ({publicKey}) => {
    return useQuery([['total-followings', publicKey], { publicKey }], getFollowings);
}

export const FetchIsFollowing = ({publicKey, followingKey}) => {
    return useQuery([['is-following', `${publicKey}-${followingKey}`], { publicKey, followingKey }], getIsFollowing);
}


export const FetchUserFeed = (publicKey) => {
    return useQuery([['user-feed', publicKey], {publicKey}] , getUserFeed, {
        keepPreviousData: true,
    });
}