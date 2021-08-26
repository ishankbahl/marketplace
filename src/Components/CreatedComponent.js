import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../App";
import ProfileNftTiles from "./ProfileNftTilesComponent";
import fetchUtil from "../utils/fetchUtil";
import { GET_CREATED_NFTS } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import Toggle from './ToggleComponent';
import EmptyStateComponent from "./EmptyStateComponent";
import LoaderComponent from "./LoaderComponent";
import { useLocation } from "react-router-dom";

function filterNfts(nfts) {
    return nfts.filter(nft => nft.isForSale);
}

export default function Created(props) {
    const identityData = useContext(AuthContext);
    const [nfts, setNfts] = useState(props.nfts);
    const [toggle, setToggle] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let isUnmounted = false;
        const unmountedCallback = () => {
            isUnmounted = true;
        }
        if(!isLoading) {
            setLoading(true);
        }
        if(nfts.length && nfts[0].creatorPublicKey !== props.publicKey) {
            setNfts([]);
        }
        //location check because component is rendered before props.publicKey changes
        if(!props.publicKey || !location.pathname.includes(props.publicKey)) {
            return unmountedCallback;
        }
        fetchUtil(GET_CREATED_NFTS, {
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
            const processedNfts = data.mintedNFTs.map(nft => {
                nft.imageUrl = nft.imageUrls[0];
                nft.fallbackUrl = nft.fallbackUrls[0];
                nft.creatorPublicKey = props.publicKey;
                return nft;
            });
            props.setNfts(processedNfts);
            setNfts(processedNfts);
          }, () => {/** failure code */});
        return unmountedCallback;
    }, [props.publicKey, identityData?.publicKeyAdded]);

    const toggleHandler = (flag) => {
        if(flag) {
            setNfts(filterNfts(props.nfts));
        }
        else {
            setNfts(props.nfts);
        }
        setToggle(flag);
    }

    useEffect(() => {
        toggleHandler(toggle);
    }, [nfts.length]);

    return (
        <>
            <div className="grid grid-cols-12 mt-10">
                <div className="col-start-2 col-span-10">
                    <Toggle setEnabled={toggleHandler} text="For sale" default={toggle} />
                </div>
            </div>
            {!!nfts.length && <ProfileNftTiles setNfts={setNfts} nfts={nfts} />}
            {!nfts.length &&  !isLoading &&
            <div className="m-10">
                <EmptyStateComponent content="No NFTs to display" />
            </div>}
            {isLoading && !nfts.length &&
            <div style={{ marginBottom: '2000px' }} className="flex justify-center my-10">
                <LoaderComponent />
            </div>}
        </>
    );
}

Created.propTypes = {
    publicKey: PropTypes.string.isRequired,
    nfts: PropTypes.array,
    setNfts: PropTypes.func,
};