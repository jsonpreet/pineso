export const BASE_URI = process.env.NEXT_PUBLIC_NODE_API_URL || 'https://node.deso.org/api/v0';
export const BASE_IDENTITY_URI = process.env.NEXT_PUBLIC_NODE_IDENTITY_URL || 'https://identity.deso.org';
export const EXTERNAL_LINK = process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://diamondapp.com';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pineso.io';

export const FEEDER_PROJECT_ID = process.env.NEXT_PUBLIC_FEEDER_PROJECT_ID || '63470396bfda730004a8eb3c';

export const config = {
    defaultOptions: {
        queries: {
            staleTime: 600 * 2 * 1000,
            cacheTime: 0,
            refetchOnWindowFocus: false,
        }
    }
}

export const SUPPORTED_FORMATS = ["webp", "png", "gif", "jpg", "jpeg", "png"];