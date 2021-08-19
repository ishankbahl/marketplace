import { BadgeCheckIcon } from '@heroicons/react/solid'
import DiamondButton from './DiamondButtonComponent'
import LikeButton from './LikeButtonComponent'
import { LockClosedIcon } from '@heroicons/react/solid';
import CloutIcon from '../Icons/CloutIcon';
import { Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from '../Constants/Routes';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

  
function NftTiles(props) {
    return (
        <ul className="sm:grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5">
            {props.nfts.map((nft) => (
                <Link key={nft.NFThash} to={{
                    pathname: "/discover",
                  }}>
                    <li className="my-3 transition hover:-translate-y-1 ease-in-out transform">
                        <div className="shadow-lg rounded-lg cursor-pointer">
                        {nft.imageUrl && <div className="aspect-w-1 aspect-h-1">
                            <LazyLoadImage 
                                className="object-cover shadow-lg rounded-t-lg"
                                src={nft.imageUrl}
                                scrollPosition={props.scrollPosition}
                                threshold={1000}
                                height={285}
                                width={285}
                            />
                            {/* <img className="object-cover shadow-lg rounded-t-lg" src={nft.imageUrl} /> */}
                            </div>}
                        <div className="flex-1 bg-white p-3 flex flex-col justify-between rounded-lg">
                            <div className="text-xs font-medium grid grid-cols-1 inline">
                                <Link to={`/profile/${nft.creatorPublicKey}`}>
                                    <p className="text-gray-500 inline line-clamp-1">
                                        <LazyLoadImage 
                                            src={GET_PROFILE_IMAGE + nft.creatorPublicKey + PROFILE_IMAGE_FALLBACK}
                                            className="inline h-6 w-6 rounded-full mr-1"
                                            scrollPosition={props.scrollPosition}
                                            threshold={1000}
                                            height={24}
                                            width={24}
                                        />
                                        {/* <img
                                            className="inline h-6 w-6 rounded-full mr-1"
                                            src={GET_PROFILE_IMAGE + nft.creatorPublicKey}
                                        /> */}
                                        {nft.creatorUsername}
                                        {/* <BadgeCheckIcon className="flex-shrink-0 h-4 w-4 text-blue-500 inline align-middle" aria-hidden="true" /> */}
                                    </p>
                                </Link>
                            </div>
                            <div className={`text-sm pt-1 ${nft.imageUrl ? 'line-clamp-1' : 'line-clamp-11'}`}>
                                <pre title={nft.postText} className="whitespace-pre-wrap">{nft.postText}</pre>
                            </div>

                            <ul className="flex space-x-1">
                                <li>
                                    <DiamondButton hash={nft.NFTHash} count={nft.diamondCount} diamondLevel={nft.readerState?.diamondLevelBestowed} creatorPublicKey={nft.creatorPublicKey} />
                                </li>
                                <li>
                                    <LikeButton hash={nft.NFTHash} count={nft.likeCount} isLiked={nft.readerState?.liked} />
                                </li>
                            </ul>
                        </div>
                        <div className="text-indigo-100 bg-indigo-700 px-3 py-3 sm:px-3 rounded-b-lg">
                            <ul className="text-white">
                                {/* {nft.isForSale && <><li className="inline mr-1 align-right">
                                    <Tooltip title={`${nft.editionsForSale} of ${nft.editionsTotal} available`} arrow>
                                        <div className="text-xs inline">{`1000/1000`}</div>
                                    </Tooltip>
                                </li>
                                <li className="inline">
                                    |
                                </li></>} */}
                                {nft.hasUnlockable && <><li className="inline">
                                    <Tooltip title="Includes unlockable" arrow>
                                        <div className="inline">
                                            <LockClosedIcon className="flex-shrink-0 h-5 w-5 inline align-top pt-1" />
                                        </div>
                                    </Tooltip>
                                </li>
                                <li className="inline">
                                    |
                                </li></>}
                                <li className="inline">
                                    {!!nft.lowestHighestBidClout && <div className="text-xs inline ml-1">Top Bid {nft.lowestHighestBidClout} <CloutIcon /></div>}
                                    {!nft.lowestHighestBidClout && !!nft.highestPricePaidClout && <Tooltip title="Highest price paid in past" arrow><div className="text-xs inline ml-1">Highest {nft.highestPricePaidClout} <CloutIcon /></div></Tooltip>}
                                    {!nft.lowestHighestBidClout && !nft.highestPricePaidClout && <div className="text-xs inline ml-1">Min Bid {nft.minimumBidClout} <CloutIcon /></div>}
                                </li>
                            </ul>
                        </div>
                        </div>
                    </li>
                </Link>
            ))}
        </ul>
    )
}

export default trackWindowScroll(NftTiles);

// nfts: PropTypes.arrayOf({
//   NFTHash: PropTypes.string.isRequired
//   creatorUsername: PropTypes.string.isRequired,
//   creatorPublicKey: PropTypes.string,
//   imageUrl: PropTypes.string,
//   postText: PropTypes.string,
//   diamondCount: PropTypes.number,
//   likeCount: PropTypes.number,
//   hasUnlockable: PropTypes.bool,
//   isForSale: PropTypes.bool,
//     lowestHighestBidClout: PropTypes.number,
//     highestPricePaidClout: PropTypes.number,
//     minimumBidClout: PropTypes.number
// }).isRequired