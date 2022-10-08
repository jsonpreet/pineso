import { BASE_URI } from "@app/lib/constants";
import { getImageSize } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getSinglePost = async ({ queryKey }) => {
    const [_key, { slug }] = queryKey;
    const pins = [];
    const endpoint = 'get-single-post';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PostHashHex: slug,
        CommentLimit: 10,
    });
    if (response === null) {
        return null
    } else {
        const post = response.data.PostFound;

        return post
    }
}

export const FetchSinglePost = ({slug}) => {
    return useQuery([['single-post', `${slug}`], { slug }], getSinglePost, {
        keepPreviousData: true,
    });
}