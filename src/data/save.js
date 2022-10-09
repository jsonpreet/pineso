import { BASE_URI } from "@app/lib/constants";
import axios from "axios";
const CLOUTAPIURI = "https://api.cloutapis.com";

export const savePost = async (post, user) => {
    const endpoint = 'saved-posts/save';
    const response = await axios.post(`${CLOUTAPIURI}/${endpoint}`, {
        postHashHex: post,
        postJWT: user.jwt,
        postPublicKey: user.PublicKeyBase58Check,
    });
    if (response === null) {
        return null
    } else {
        console.log(response.data);
        return response.data;
    }
}
