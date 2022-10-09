import { BASE_URI } from "@app/lib/constants";
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
