import React, { Suspense, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext, UsersContext } from '../App';
import ProfileHeader from './ProfileHeaderComponent';
import Tabs from './TabsComponent';
import { TABS_DATA, PROFILE_IMAGE_FALLBACK, GET_SINGLE_PROFILE_INTERNAL, GET_PROFILE_STATS } from '../Constants/Routes';
import { BrowserRouter as Route, Switch, useHistory, useLocation } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import { GET_PROFILE_IMAGE } from '../Constants/Routes';
import Created from './CreatedComponent';
import Collected from './CollectedComponent';
import fetchUtil from '../utils/fetchUtil';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import CloutIcon from '../Icons/CloutIcon';

export default function Profile(props) {
    const usersData = useContext(UsersContext);
    const [tabs] = useState(cloneDeep(TABS_DATA));
    const [createdNfts, setCreatedNfts] = useState([]);
    const [collectedNfts, setCollectedNfts] = useState([]);
    const [publicKey, setPublicKey] = useState('');
    const location = useLocation();
    const identityData = useContext(AuthContext);
    const [profileData, setProfileData] = useState();
    const [profileStats, setProfileStats] = useState([]);

    useEffect(() => {
        let isUnmounted = false;
        if(location.pathname[2] !== publicKey) {
            const newKey = location.pathname.split('/')[2]
            setPublicKey(newKey);
            fetchUtil(GET_SINGLE_PROFILE_INTERNAL, {
                method: 'POST',
                body: JSON.stringify({"publicKey": newKey, "readerPublicKey": identityData.publicKeyAdded}),
                headers: {
                    [CONTENT_TYPE]: APPLICATION_JSON
                }
            }, () => {
                //loader stuff
            }, (data) => {
                if(isUnmounted) {
                    return;
                }
                setProfileData(data);
            }, () => {/** failure code */});
            fetchUtil(GET_PROFILE_STATS, {
                method: 'POST',
                body: JSON.stringify({"publicKey": newKey, "readerPublicKey": identityData.publicKeyAdded}),
                headers: {
                    [CONTENT_TYPE]: APPLICATION_JSON
                }
            }, () => {
                //loader stuff
            }, (data) => {
                if(isUnmounted) {
                    return;
                }
                setProfileStats([
                {
                    name: 'coin price',
                    value: <>{data.coinPriceClout} <CloutIcon size={20} /></>
                },
                {
                    name: 'NFT owners',
                    value: data.numOwners
                },
                {
                    name: 'collection value',
                    value: <>{data.userCollectionValueClout} <CloutIcon size={20} /></>
                },
                {
                    name: 'mints value',
                    value: <>{data.mintedCollectionValueClout} <CloutIcon size={20} /></>
                }
            ]);
            }, () => {/** failure code */});
        }
        return () => {
            isUnmounted = true;
        }
    }, [location.pathname]);
    

    useEffect(() => {
        tabs.forEach((tab, index) => tab.href = TABS_DATA[index].href.replace(':publicKey', publicKey));
    }, [publicKey]);
    
    return (
        <>
            <ProfileHeader profile={profileData} stats={profileStats} />
            <Tabs tabs={tabs} />
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/profile/:publicKey">
                        <Collected nfts={collectedNfts} publicKey={publicKey} setNfts={setCollectedNfts} />
                    </Route>
                    <Route path="/profile/:publicKey/created">
                        <Created nfts={createdNfts} setNfts={setCreatedNfts} publicKey={publicKey} />
                    </Route>
                    <Route path="/profile/:publicKey/my-bids">
                        TBD
                    </Route>
                </Switch>
            </Suspense>
        </>
    );
}