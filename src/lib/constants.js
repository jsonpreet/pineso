export const BASE_URI = process.env.NODE_API_URL || 'https://node.deso.org/api/v0';
export const BASE_IDENTITY_URI = process.env.NODE_IDENTITY_URL || 'https://identity.deso.org';
export const EXTERNAL_LINK = process.env.EXTERNAL_URL || 'https://diamondapp.com';
export const BASE_URL = process.env.BASE_URL || 'https://pineso.io';

export const config = {
    defaultOptions: {
        queries: {
            staleTime: 60 * 5 * 1000,
            cacheTime: 120 * 5 * 1000,
            refetchOnWindowFocus: false,
            refetchInterval: 60 * 5 * 1000,
        }
    }
}

export const SUPPORTED_FORMATS = ["webp", "png", "gif", "jpg", "jpeg", "png"];