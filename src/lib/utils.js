import axios from 'axios'
import { BASE_URI } from './constants';
import reactImageSize from 'react-image-size'

export const fetcher = url => axios.get(url).then(res => res.data)

export function determineNewHeight(originalHeight, originalWidth, newWidth) {
    const height = Math.round((originalHeight / originalWidth) * newWidth);
    return height;
}

export async function getHotFeed(request)  {
    const endpoint = 'get-hot-feed';
    return await axios.post(`${BASE_URI}/${endpoint}`, request);
}

export const getImageSize = async (url) => {
    return await reactImageSize(url);
}

export const withCSR = (next) => async (ctx) => {
    const isCSR = ctx.req.url?.startsWith('/_next');
    if (isCSR) {
        return {
            props: {},
        };
    }
    return next?.(ctx)
}
