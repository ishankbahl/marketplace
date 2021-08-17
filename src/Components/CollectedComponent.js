import { useEffect, useState } from "react";
import ProfileNftTiles from "./ProfileNftTilesComponent";
import fetchUtil from "../utils/fetchUtil";
import { GET_USER_NFTS } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import Toggle from './ToggleComponent';
import PropTypes from 'prop-types';

function filterNfts(nfts) {
    return nfts.filter(nft => nft.isForSale);
}

export default function Collected(props) {
    const [nfts, setNfts] = useState([]);
    const [toggle, setToggle] = useState(false); //only used for default

    useEffect(() => {
        if(!props.publicKey) {
            return;
        }
        let isUnmounted = false;
        fetchUtil(GET_USER_NFTS, {
            method: 'POST',
            body: JSON.stringify({"userPublicKey": props.publicKey}),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
          }, () => {
              //loader stuff
          }, (data) => {
              if(isUnmounted) {
                  return;
              }
              const processedList = data.userNFTs.map(nft => {
                  nft.imageUrl = nft.imageUrls[0];
                  return {...nft, ...nft.user};
              })
              props.setNfts(processedList);
              setNfts(processedList);
          }, () => {/** failure code */});
    }, [props.publicKey]);

    const toggleHandler = (flag) => {
        if(flag) {
            setNfts(filterNfts(props.nfts));
        }
        else {
            setNfts(props.nfts);
        }
    }

    return (
        <>
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-11">
                    <div className="flex justify-end">
                        <Toggle setEnabled={toggleHandler} text="For sale" default={toggle} />
                    </div>
                </div>
            </div>
            <ProfileNftTiles nfts={nfts} />
        </>
    );
}

Collected.propTypes = {
    publicKey: PropTypes.string.isRequired,
    nfts: PropTypes.array,
    setNfts: PropTypes.func,
};