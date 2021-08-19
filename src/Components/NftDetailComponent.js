import { UsersIcon, CheckCircleIcon, ViewListIcon } from '@heroicons/react/solid'
import { PROFILE_IMAGE_FALLBACK, GET_PROFILE_IMAGE, GET_NFT_BIDS, GET_NFT_OWNERS } from '../Constants/Routes'
import DiamondButton from './DiamondButtonComponent'
import LikeButton from './LikeButtonComponent'
import CloutIcon from '../Icons/CloutIcon'
import { Tooltip } from '@material-ui/core'
import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../App'
import fetchUtil from '../utils/fetchUtil'
import { GET_NFT_DETAILS } from '../Constants/Routes'
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants'
import CollapsibleTable from './CollapsibleTableComponent'
import { EditionsTableHeader, BidTableHeader } from '../Constants/BiddingTableConstants'
import round from '../utils/roundUtil'

const getPriceLabel = (nft) => {
  if(nft.lowestHighestBidClout) {
    return 'Top bid';
  }
  else {
    return 'Min bid'
  }
}

const getPriceInClout = (nft) => {
  if(nft.lowestHighestBidClout) {
    return nft.lowestHighestBidClout;
  }
  else {
    return nft.minimumBidClout;
  }
}

const getPriceInUsd = (nft) => {
  if(nft.lowestHighestBidUsd) {
    return nft.lowestHighestBidUsd;
  }
  else {
    return nft.minimumBidUsd;
  }
}

export default function NftDetail() {
  const location = useLocation();
  const [nftHash, setNftHash] = useState('');
  const [nft, setNft] = useState();
  const [bids, setBids] = useState([]);
  const [owners, setOwners] = useState([]);
  const identityData = useContext(AuthContext);

  const fetchBids = (hash, nftContent) => {
    fetchUtil(GET_NFT_BIDS, {
      method: 'POST',
      body: JSON.stringify({"NFTHash": hash, "readerPublicKey": identityData.publicKeyAdded, }),
      headers: {
          [CONTENT_TYPE]: APPLICATION_JSON
      }
      }, () => {
          //loader stuff
      }, (data) => {
        setBids(data.bidders.map(bid => {
          const row = [ 
          { 
            content: <><CloutIcon size={12} />{round(bid.bidInClout)}</>,
            key: bid.bidInClout + bid.bidder.username
          }, 
          { 
            content: '$' + bid.bidInUsd,
            key: bid.bidInUsd + bid.bidder.username
          },
          { 
            content: <><img
              className="inline h-5 w-5 rounded-full mr-1 align-top"
              src={GET_PROFILE_IMAGE + bid.bidder.publicKey + PROFILE_IMAGE_FALLBACK}
          />{bid.bidder.username}</>,
          key: bid.bidder.username
        }]
          if(nftContent.editionsForSale > 1) {
            row.push({ 
              content: bid.isTopBid ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : '',
              key: bid.isTopBid + bid.bidder.username
            });
            row.unshift({ 
              content: '#' + bid.edition,
              key: bid.edition + bid.bidder.username});
          }
          return { 
            content : row ,
            key: bid.bidder.username + bid.edition + bid.bidInUsd};
        }));
      }, () => {/** failure code */});
  }

  const fetchOwners = (hash) => {
    fetchUtil(GET_NFT_OWNERS, {
      method: 'POST',
      body: JSON.stringify({"NFTHash": hash, "readerPublicKey": identityData.publicKeyAdded, }),
      headers: {
          [CONTENT_TYPE]: APPLICATION_JSON
      }
      }, () => {
          //loader stuff
      }, (data) => {
        setOwners(data.map(owner => ({
          key: owner.username,
          content: [
            {
              content: <>
                <img
                  className="inline h-5 w-5 rounded-full mr-1 align-top"
                  src={GET_PROFILE_IMAGE + owner.publicKey + PROFILE_IMAGE_FALLBACK}
                />
                {owner.username}
              </>,
              key: owner.username
            },
            {
              content: `${owner.ownedEditions.length} item${owner.ownedEditions.length > 1 ? 's' : ''}`,
              key: owner.ownedEditions.length + owner.username
            }
          ]})));
        //setBids();
      }, () => {/** failure code */});
  }

  useEffect(() => {
    let isUnmounted = false;
    const hash = location.pathname.split('/')[2];
    setNftHash(hash);

    fetchUtil(GET_NFT_DETAILS, {
      method: 'POST',
      body: JSON.stringify({"NFTHash": hash, "readerPublicKey": identityData.publicKeyAdded}),
      headers: {
          [CONTENT_TYPE]: APPLICATION_JSON
      }
    }, () => {
        //loader stuff
    }, (data) => {
        if(isUnmounted) {
            return;
        }
        setNft(data);
        fetchBids(hash, data);
        fetchOwners(hash, data);
    }, () => {/** failure code */});
    return () => {
      isUnmounted = true;
    }
  }, [location.pathname]);

  return (
    <div>
      {!nft && <div>
        loading....
      </div>}
      {nft && <div>
        {nft.imageUrls[0] && <div className="grid justify-items-center bg-gray-100 py-4 px-4">
          <img
            src={nft.imageUrls[0]}
            className="object-center object-cover max-h-96"
          />
        </div>}

        <div className="max-w-2xl mx-auto pt-4 pb-4 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:pr-8">
            <img
                className="inline h-8 w-8 rounded-full mr-1 align-top"
                src={GET_PROFILE_IMAGE + nft.creatorPublicKey + PROFILE_IMAGE_FALLBACK}
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl inline">{nft.creatorUsername}</h1>
          </div>

          <div className="py-4 lg:pt-4 lg:pb-4 lg:col-start-1 lg:col-span-2 lg:pr-8">
            <div>
              <h3 className="sr-only">Nft Text</h3>

              <div className="space-y-6">
                <pre className="whitespace-pre-wrap overflow-x-auto">{nft.postText}</pre>
              </div>
            </div>
            <div className="lg:col-span-2 lg:pr-8">
              <ul className="flex col-span-12">
                  <li>
                      <DiamondButton hash={nftHash} count={nft.diamondCount} diamondLevel={nft.readerState.diamondLevelBestowed} creatorPublicKey={nft.creatorPublicKey} />
                  </li>
                  <li>
                      <LikeButton hash={nftHash} count={nft.likeCount} isLiked={nft.readerState.liked} />
                  </li>
              </ul>
            </div>
            <div className="lg:col-span-2 lg:pr-8 my-10">
              <CollapsibleTable tableHeading={<><ViewListIcon className="h-5 w-5 inline pb-1" />Bids</>} header={(nft.editionsForSale > 1) ? EditionsTableHeader : BidTableHeader } rows={bids} />
            </div>
            <div className="lg:col-span-2 lg:pr-8 my-10">
              <CollapsibleTable tableHeading={<><UsersIcon className="h-5 w-5 inline pb-1" />Owned by</>} rows={owners} />
            </div>
        </div>

          <div className="mt-4 lg:mt-0 lg:row-span-3 lg:border-l lg:border-gray-500 pl-4">
            <h2 className="sr-only">Nft information</h2>
            <p className="text-3xl text-gray-900 mb-10"><span className="text-base block">{getPriceLabel(nft)}</span><CloutIcon size={25} />{getPriceInClout(nft)}<span className="text-base ml-3">(${getPriceInUsd(nft)})</span></p>
            <div className="text-base cursor-pointer text-gray-500 my-10">
                <p className="text-2xl text-gray-900">
                  <span className="text-base block">Editions</span>
                  <Tooltip title="Each NFT can have multiple editions, each of which has its own unique serial number. This shows how many editions are currently on sale and how many there are in total. Generally, editions with lower serial numbers are more valuable." arrow>
                    <span>{nft.editionsForSale} of {nft.editionsTotal} for sale</span>
                  </Tooltip>
                </p>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}

NftDetail.propTypes = {
  nft: PropTypes.object
}
