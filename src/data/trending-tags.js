import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getTrendingTags = async () => {
    const response = await axios.get(`https://openprosperapi.xyz/api/v0/p/social/trending-hashtags-x8k6jw1`);
    if (response === null) {
        return null
    } else {
        return response.data.value.Hours24.Top10Hashtags
    }
}

export const FetchTrendingTags = () => {
    return useQuery(['trending-tags'], getTrendingTags, {
        keepPreviousData: true,
    });
}