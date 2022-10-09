import { BASE_URI } from "@app/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getExchangeRate = async () => {
    const endpoint = 'get-exchange-rate';
    const response = await axios.get(`${BASE_URI}/${endpoint}`);
    if (response === null) {
        return null
    } else {
        return response.data
    }
}

export const FetchExchangeRate = () => {
    return useQuery(['exchange-rate'], getExchangeRate);
}