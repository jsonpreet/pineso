import { BASE_URI } from "@app/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getSingleProfile = async (publicKey) => {
    const endpoint = 'get-single-profile';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey
    });
    if (response === null) {
        return null
    } else {
        return response.data.Profile;
    }
}

export const getSingleProfilebyUsername = async ({ queryKey }) => {
    const [_key, { username }] = queryKey;
    const endpoint = 'get-single-profile';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        Username: username
    });
    if (response === null) {
        return null
    } else {
        return response.data.Profile;
    }
}

export const FetchSingleProfilebyUsername = ({username}) => {
    return useQuery([['single-profile', username], { username }], getSingleProfilebyUsername, {
        keepPreviousData: true,
    });
}
