import { useEffect, useState, useContext } from "react";
import ProfileNftTiles from "./ProfileNftTilesComponent";
import fetchUtil from "../utils/fetchUtil";
import { GET_SHOWCASE_NFTS } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import Toggle from './ToggleComponent';
import PropTypes from 'prop-types';
import { AuthContext } from "../App";
import EmptyStateComponent from "./EmptyStateComponent";
import LoaderComponent from "./LoaderComponent";

function filterNfts(nfts) {
    return nfts.filter(nft => nft.isForSale);
}

export default function Showcase(props) {
    const identityData = useContext(AuthContext);
    const [nfts, setNfts] = useState(props.nfts);
    const [toggle, setToggle] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const fetchShowcaseNfts = (limitStart, limitEnd, callback) => {
        fetchUtil(GET_SHOWCASE_NFTS, {
            method: 'POST',
            body: JSON.stringify({"readerPublicKey": identityData?.publicKeyAdded, limitStart, limitEnd}),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
        }, () => {}, (data) => {
            const processedList = data.showcaseNFTs.map(nft => {
                nft.imageUrl = nft.imageUrls[0];
                nft.fallbackUrl = nft.fallbackUrls[0];
                return nft;
            });
            callback(processedList);
        }, () => {/** failure code */});
    }

    const updateNfts = (processedList) => {
        props.setNfts(processedList);
        setNfts(processedList);
    }

    useEffect(() => {
        let isUnmounted = false;
        if(!isLoading) {
            setLoading(true);
        }
        const unmountedCallback = () => {
            isUnmounted = true;
        }
        fetchShowcaseNfts(0, 20, (nfts) => {
            if(isUnmounted) {
                return;
            }
            setLoading(false);
            updateNfts(nfts);
            fetchShowcaseNfts(undefined, undefined, updateNfts);
        });
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
            <div>
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
                    <div className="max-w-xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Discover
                    </h2>
                    <p className="mt-5 text-xl text-gray-500">
                        Curated List of NFTs on BitClout
                    </p>
                </div>
                </div>
            </div>
            <div className="grid grid-cols-12">
                <div className="col-start-2 col-span-10">
                        <Toggle setEnabled={toggleHandler} text="For sale" default={toggle} />
                </div>
            </div>
            <ProfileNftTiles setNfts={setNfts} nfts={nfts} />
            {!nfts.length && !isLoading &&
            <div className="m-10">
                <EmptyStateComponent content="No NFTs to display" />
            </div>}
            {isLoading && 
            <div style={{ marginBottom: '2000px' }} className="flex justify-center mt-10">
                <LoaderComponent />
            </div>}
        </>
    );
}

Showcase.propTypes = {
    nfts: PropTypes.array,
    setNfts: PropTypes.func,
};