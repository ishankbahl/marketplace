import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

export const BITCLOUT_DOMAIN = 'https://bitclout.com';
export const DOMAIN = 'https://tijn.club';
// export const INTERNAL_DOMAIN = 'http://45.77.52.104:3001';
export const INTERNAL_DOMAIN = 'https://api.oble.io/int';
export const CLOUDFLARE_DOMAIN = 'https://clout-help.tools.workers.dev';

export const GET_PROFILE_IMAGE = BITCLOUT_DOMAIN + '/api/v0/get-single-profile-picture/';
export const PROFILE_IMAGE_FALLBACK = '?fallback=https://bitclout.com/assets/img/default_profile_pic.png';
export const PROFILE_IMAGE_FALLBACK_URL = 'https://bitclout.com/assets/img/default_profile_pic.png';
export const GET_SINGLE_PROFILE = DOMAIN + '/api/v0/get-single-profile';
export const GET_USERS_STATELESS = DOMAIN + '/api/v0/get-users-stateless';
export const GET_USER_NFTS = INTERNAL_DOMAIN + '/api/nft/user';
export const GET_CREATED_NFTS = INTERNAL_DOMAIN + '/api/nft/user/mints';
export const LIKE_POST = DOMAIN + '/api/v0/create-like-stateless';
export const SUBMIT_TRANSACTION = DOMAIN + "/api/v0/submit-transaction";
export const SEND_DIAMONDS = DOMAIN + '/api/v0/send-diamonds';
export const GET_PROFILES = DOMAIN + '/api/v0/get-profiles';
export const GET_SINGLE_PROFILE_INTERNAL = INTERNAL_DOMAIN + '/api/user/profile';
export const GET_PROFILE_STATS = INTERNAL_DOMAIN + '/api/user/profile/stats';
export const GET_NFT_DETAILS = INTERNAL_DOMAIN + '/api/nft/details';
export const GET_NFT_BIDS = INTERNAL_DOMAIN + '/api/nft/bidders';
export const GET_NFT_OWNERS = INTERNAL_DOMAIN + '/api/nft/owners';
export const GET_SHOWCASE_NFTS = INTERNAL_DOMAIN + '/api/nft/showcase';
export const GET_READER_STATE = INTERNAL_DOMAIN + '/api/nft/user/like-diamonds';
export const CREATE_NFT_BID = DOMAIN + '/api/v0/create-nft-bid';
export const CREATE_FOLLOW_TRANSACTION = DOMAIN + '/api/v0/create-follow-txn-stateless';
export const GET_FEATURED_ARTISTS = CLOUDFLARE_DOMAIN + '/api/showcase/featured-artists';
export const IS_USER_FOLLOWING = INTERNAL_DOMAIN + '/api/user/is-following';

export const NavbarContentNames = {
    PROFILE: 'Profile',
    DISCOVER: 'Discover'
}

export const NAVBAR_DATA = [
    {
        content: 'Discover',
        route: '/discover'
    },
    {
        content: 'Profile',
        route: '/profile'
    }
];

export const TABS_DATA = [
    { name: 'Collected', href: '/profile/:publicKey' },
    { name: 'Created', href: '/profile/:publicKey/created' },
];