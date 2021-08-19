export const BITCLOUT_DOMAIN = 'https://bitclout.com';
export const DOMAIN = 'https://api.tijn.club';
export const INTERNAL_DOMAIN = 'http://45.77.52.104:3001';

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

export const NavbarContentNames = {
    PROFILE: 'Profile',
    DISCOVER: 'Discover'
}

export const NAVBAR_DATA = [
    {
        content: 'Profile',
        route: '/profile'
    },
    {
        content: 'Discover',
        route: '/discover'
    }
];

export const TABS_DATA = [
    { name: 'Collected', href: '/profile/:publicKey' },
    { name: 'Created', href: '/profile/:publicKey/created' },
    { name: 'My Bids', href: '/profile/:publicKey/my-bids' },
];