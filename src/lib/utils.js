import Link from 'next/link';
import reactImageSize from 'react-image-size'
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function determineNewHeight(originalHeight, originalWidth, newWidth) {
    const height = Math.round((originalHeight / originalWidth) * newWidth);
    return height;
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

export function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export const calculateDurationUntilNow = (p_timeStampNanoSeconds) => {
    const milliseconds = p_timeStampNanoSeconds / 1000000;
    const durationUntilNowInMilliseconds = new Date().getTime() - milliseconds;
    const durationInMinutes = durationUntilNowInMilliseconds / 1000 / 60;

    if (durationInMinutes < 60) {
        return Math.floor(durationInMinutes) + 'm ago';
    }

    const durationInHours = durationInMinutes / 60;

    if (durationInHours < 24) {
        return Math.floor(durationInHours) + 'h ago';
    }

    const durationInDays = durationInHours / 24;

    return Math.floor(durationInDays) + 'd ago';
}

export function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

export const LinkifyRenderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <Link href={href} passHref><a className='text-[#5634ee] duration-75 delay-75 hover:text-[#ec05ad]' {...props}>{content}</a></Link>;
};

export const LinkifyOptions = {
    formatHref: {
        hashtag: (href) => "/hashtag/" + href.substr(1).toLowerCase(),
        mention: (href) => "/" + href.substr(1).toLowerCase(),
    },
    render: {
        mention: LinkifyRenderLink,
        hashtag: LinkifyRenderLink,
        url: ({ attributes, content }) => {
            return <a {...attributes} className='text-[#5634ee] duration-75 delay-75 hover:text-[#ec05ad]' target="_blank">{content}</a>
        },
    },
    nl2br: true
};

export const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
    draggable: false,
    closeButton: false,
    progress: undefined,
    theme: "dark",
}