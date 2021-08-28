import Table from "./TableComponent";
import fetchUtil from "../utils/fetchUtil";
import { GET_USER_BIDS, GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../App";
import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import CloutIcon from "../Icons/CloutIcon";
import round from '../utils/roundUtil'
import { ProfileEditionsTabHeader } from "../Constants/BiddingTableConstants";
import EmptyStateComponent from "./EmptyStateComponent";
import LoaderComponent from "./LoaderComponent";

export default function Bids(props) {
    const identityData = useContext(AuthContext);
    const [bids, setBids] = useState(props.bids);
    const [isLoading, setLoading] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const changeUrl = (url) => {
        history.push(url);
    }

    useEffect(() => {
        let isUnmounted = false;
        const unmountedCallback = () => {
            isUnmounted = true;
        }
        if(!isLoading) {
            setLoading(true);
        }
        if(bids.length) {
            setBids([]);
        }
        //location check because component is rendered before props.publicKey changes
        if(!props.publicKey || !location.pathname.includes(props.publicKey)) {
            return unmountedCallback;
        }
        fetchUtil(GET_USER_BIDS, {
            method: 'POST',
            body: JSON.stringify({"userPublicKey": props.publicKey, "readerPublicKey": identityData?.publicKeyAdded}),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
          }, () => {}, (data) => {
            if(isUnmounted) {
                return;
            }
            setLoading(false);

            const processedBids = data.map(bid => {

                const key = '-' + bid.edition + '-' + bid.NFTHash
                const row = [
                    { 
                      content: '#' + bid.edition,
                      key: bid.edition + bid.NFTHash
                    },
                    {
                      content: (
                      <div onClick={() => changeUrl(`/nft/${bid.NFTHash}`)}>
                        {!!bid.imageUrls.length && <img
                          className="inline h-16 w-16 mr-1 cursor-pointer"
                          src={bid.imageUrls?.[0]}
                          alt="profile"
                        />}
                        <div className="inline cursor-pointer pl-2 pr-12 lg:pr-2">
                          <div className="align-middle inline">
                            {bid.postText.length > 30 ? bid.postText.slice(0, 30) + '...' : bid.postText}
                          </div>
                        </div>
                      </div>
                      ),
                      key: 'item' + key
                    },
                    { 
                      content: <><CloutIcon size={12} />{round(bid.userBidClout)}</>,
                      key: bid.userBidClout + key
                    }, 
                    { 
                      content: '$' + bid.userBidUsd,
                      key: bid.userBidUsd + key
                    },
                    { 
                      content: <div onClick={() => changeUrl(`/profile/${bid.creatorPublicKey}`)}><img
                        className="inline h-5 w-5 rounded-full mr-1 align-top cursor-pointer"
                        src={GET_PROFILE_IMAGE + bid.creatorPublicKey + PROFILE_IMAGE_FALLBACK}
                        alt="profile"
                        /><div className="hover:underline inline cursor-pointer">{bid.creatorUsername}</div></div>,
                        key: bid.creatorUsername + key
                    },
                    { 
                      content: bid.userBidClout === bid.topBidClout ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <><CloutIcon size={12} />{round(bid.topBidClout)}</>,
                      key: bid.isTopBid + key
                    },
                ];
                return { 
                    content : row,
                    key
                };
            })

            props.setBids(processedBids);
            setBids(processedBids);
          }, () => {/** failure code */});
        return unmountedCallback;
    }, [props.publicKey, identityData?.publicKeyAdded]);

    return (
      <>
        {!!bids.length && <div className="grid grid-cols-12 my-10">
            <div className="col-start-2 col-span-10">
                <div className="max-w-7xl mx-auto">
                    <Table header={ProfileEditionsTabHeader} rows={bids} />  
                </div>
            </div>
        </div>}
        {!bids.length && !isLoading &&
          <div className="m-10">
              <EmptyStateComponent content="No Bids to display" />
          </div>}
        {isLoading && 
          <div style={{ marginBottom: '2000px' }} className="flex justify-center mt-10">
              <LoaderComponent />
          </div>}
      </>
    );
}