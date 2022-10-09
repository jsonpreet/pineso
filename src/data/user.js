import { BASE_URI } from "@app/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export const FetchFollows = ({publicKey}) => {
    return useQuery([['follows', publicKey], { publicKey }], getFollows);
}

export const FetchIsFollowing = ({publicKey, followingKey}) => {
    return useQuery([['is-following', `${publicKey}-${followingKey}`], { publicKey, followingKey }], getIsFollowing);
}