import DiamondButton from './DiamondButtonComponent'
import LikeButton from './LikeButtonComponent'
import { LockClosedIcon } from '@heroicons/react/solid';
import CloutIcon from '../Icons/CloutIcon';
import { Tooltip } from '@material-ui/core';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from '../Constants/Routes';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../App';
import { useContext } from 'react';
import GavelIcon from '@material-ui/icons/Gavel';

  
function NftTiles(props) {
    const history = useHistory();
    const identityData = useContext(AuthContext);

    const changeUrl = (e, url) => {
        history.push(url);
        e.stopPropagation();
    }

    const handleImageError = (nft) => {
        nft.imageUrl = nft.fallbackUrl;
        props.setNfts([...props.nfts]);
    }

    return (
        <ul className="max-w-7xl mx-auto sm:grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5">
            {props.nfts.map((nft) => (
                <li key={nft.NFTHash + (identityData?.publicKeyAdded || '')} className="my-3">
                    <div className="shadow-lg rounded-lg cursor-pointer transition hover:-translate-y-1 ease-in-out transform" onClick={(e) => changeUrl(e, `/nft/${nft.NFTHash}`)}>
                        {nft.imageUrl && <div className="aspect-w-1 aspect-h-1">
                            <LazyLoadImage 
                                className="object-cover shadow-lg rounded-t-lg"
                                src={nft.imageUrl}
                                scrollPosition={props.scrollPosition}
                                threshold={500}
                                onError={() => handleImageError(nft)}
                                height={285}
                                width={285}
                            />
                            {/* <img className="object-cover shadow-lg rounded-t-lg" src={nft.imageUrl} /> */}
                        </div>}
                        <div className="flex-1 bg-white p-3 flex flex-col justify-between rounded-lg">
                            <div className="text-xs font-medium grid grid-cols-1 inline">
                                <p className="text-gray-500 inline line-clamp-1 hover:underline" onClick={(e) => changeUrl(e, `/profile/${nft.creatorPublicKey}`)}>
                                    <LazyLoadImage 
                                        src={GET_PROFILE_IMAGE + nft.creatorPublicKey + PROFILE_IMAGE_FALLBACK}
                                        className="inline h-6 w-6 rounded-full mr-1"
                                        scrollPosition={props.scrollPosition}
                                        threshold={500}
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
                            </div>
                            <div className={`text-sm pt-3 ${nft.imageUrl ? 'line-clamp-1' : 'line-clamp-11'}`}>
                                <pre title={nft.postText} className="whitespace-pre-wrap font-sans">{nft.postText}</pre>
                            </div>

                            <ul className="flex space-x-1">
                                <li>
                                    <DiamondButton hash={nft.NFTHash} count={nft.diamondCount} diamondLevel={nft.readerState?.diamondLevelBestowed} creatorPublicKey={nft.creatorPublicKey} />
                                </li>
                                <li>
                                    <LikeButton hash={nft.NFTHash} count={nft.likeCount} isLiked={nft.readerState?.liked} />
                                </li>
                                {nft.isForSale && <li>
                                    <Tooltip title="For Sale">
                                        <div className="mt-2 ml-3">
                                            <GavelIcon fontSize="small" />
                                        </div>
                                    </Tooltip>
                                </li>}
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
                                    {!!nft.lowestHighestBidClout && <div className="text-sm inline ml-1">Top Bid {nft.lowestHighestBidClout}<CloutIcon /></div>}
                                    {!nft.lowestHighestBidClout && !!nft.highestPricePaidClout && <Tooltip title="Highest price paid in past" arrow><div className="text-sm inline ml-1">Highest Price {nft.highestPricePaidClout}<CloutIcon /></div></Tooltip>}
                                    {!nft.lowestHighestBidClout && !nft.highestPricePaidClout && <div className="text-sm inline ml-1">Min Bid {nft.minimumBidClout}<CloutIcon /></div>}
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
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