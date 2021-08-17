import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../App";
import ProfileNftTiles from "./ProfileNftTilesComponent";
import fetchUtil from "../utils/fetchUtil";
import { GET_CREATED_NFTS } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import Toggle from './ToggleComponent';

function filterNfts(nfts) {
    return nfts.filter(nft => nft.isForSale);
}

export default function Created(props) {
    const identityData = useContext(AuthContext);
    const [nfts, setNfts] = useState([]);
    const [toggle, setToggle] = useState(false); //only used for default

    useEffect(() => {
        if(!props.publicKey) {
            return;
        }
        let isUnmounted = false;
        fetchUtil(GET_CREATED_NFTS, {
            method: 'POST',
            body: JSON.stringify({"userPublicKey": props.publicKey, "readerPublicKey": identityData.publicKeyAdded}),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
          }, () => {
              //loader stuff
          }, (data) => {
            if(isUnmounted) {
                return;
            }
            const processedNfts = data.mintedNFTs.map(nft => {
                nft.imageUrl = nft.imageUrls[0];
                nft.creatorPublicKey = props.publicKey;
                return nft;
            });
            props.setNfts(processedNfts);
            setNfts(processedNfts);
            setToggle(false);
          }, () => {/** failure code */});
        return () => {
            isUnmounted = true;
        }
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
                        <Toggle className="float-right" setEnabled={toggleHandler} text="For sale" default={toggle} />
                    </div>
                </div>
            </div>
            <ProfileNftTiles nfts={nfts} />
        </>
    );
}

Created.propTypes = {
    publicKey: PropTypes.string.isRequired,
    nfts: PropTypes.array,
    setNfts: PropTypes.func,
};