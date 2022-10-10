import { BASE_URI, SUPPORTED_FORMATS } from "@app/lib/constants";
import { getImageSize, get_url_extension } from "@app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getSearch = async (search) => {
    console.log(search);
    const endpoint = 'get-profiles';
    const { data } = await axios.get(`${BASE_URI}/${endpoint}`, {
        AddGlobalFeedBool: false,
        FetchUsersThatHODL: false,
        NumToFetch:20,
        UsernamePrefix:search,
    });
    return data;
}