import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../App';
import ProfileHeader from './ProfileHeaderComponent';
import Tabs from './TabsComponent';
import { TABS_DATA, GET_SINGLE_PROFILE_INTERNAL, GET_PROFILE_STATS, IS_USER_FOLLOWING } from '../Constants/Routes';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import Created from './CreatedComponent';
import Collected from './CollectedComponent';
import fetchUtil from '../utils/fetchUtil';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import CloutIcon from '../Icons/CloutIcon';
import EmptyStateComponent from './EmptyStateComponent';
import LoginButton from './LoginButton';
import Bids from './BidsComponent';

export default function Profile(props) {
    const [tabs] = useState(cloneDeep(TABS_DATA));
    const [createdNfts, setCreatedNfts] = useState([]);
    const [collectedNfts, setCollectedNfts] = useState([]);
    const [bids, setBids] = useState([]);
    const [publicKey, setPublicKey] = useState('');
    const location = useLocation();
    const history = useHistory();
    const identityData = useContext(AuthContext);
    const [profileData, setProfileData] = useState({});
    const [profileStats, setProfileStats] = useState([]);
    const [counts, setCounts] = useState({});
    const [isFollowing, setFollowing] = useState();

    useEffect(() => {
        const newKey = location.pathname.split('/')[2];
        if(newKey !== publicKey) {
            setPublicKey(newKey);
        }
    }, [location.pathname]);
    

    useEffect(() => {
        if(!profileData) {
            setProfileData();
        }
        if(profileStats.length) {
            setProfileStats([]);
        }
        if(createdNfts.length) {
            setCreatedNfts([]);
        }
        if(collectedNfts.length) {
            setCollectedNfts([]);
        }
        if(isFollowing) {
            setFollowing();
        }
        let isUnmounted = false;

        if(location.pathname === "/profile/log-in" && identityData?.publicKeyAdded) {
            history.push(`/profile/${identityData.publicKeyAdded}`);
        }

        //replacing placeholder with key
        tabs.forEach((tab, index) => tab.href = TABS_DATA[index].href.replace(':publicKey', publicKey));

        if(!publicKey || publicKey === 'log-in') {
            return;
        }

        if(identityData?.publicKeyAdded) {
            fetchUtil(IS_USER_FOLLOWING, {
                method: 'POST',
                body: JSON.stringify({"publicKey": publicKey, "readerPublicKey": identityData?.publicKeyAdded}),
                headers: {
                    [CONTENT_TYPE]: APPLICATION_JSON
                }
            },() => {
                //loader stuff
            }, (data) => {
                if(isUnmounted) {
                    return;
                }
                setFollowing(data);
            }, () => {/** failure code */});
        }

        fetchUtil(GET_SINGLE_PROFILE_INTERNAL, {
            method: 'POST',
            body: JSON.stringify({"publicKey": publicKey, "readerPublicKey": identityData?.publicKeyAdded}),
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
            body: JSON.stringify({"publicKey": publicKey, "readerPublicKey": identityData?.publicKeyAdded}),
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
                name: 'sold volume',
                value: <>{data.mintedCollectionValueClout} <CloutIcon size={20} /></>
            }
        ]);
        setCounts({
            numCollected: data.numCollected,
            numMinted: data.numMinted,
            numUserBids: data.numUserBids
        });
        }, () => {/** failure code */});

        return () => {
            isUnmounted = true;
        }
    }, [publicKey, identityData?.publicKeyAdded]);
    
    return (
        <div>
            <Switch>
                <Route path="/profile/log-in">
                    <div className="m-10">
                        <EmptyStateComponent content="You aren't logged in" icon={<LoginButton click={() => props.showLoginModal(true)} />} />
                    </div>
                </Route>
                <Route path="/">
                    <ProfileHeader profile={profileData} stats={profileStats} followStatus={isFollowing && (!identityData?.publicKeyAdded || identityData?.publicKeyAdded !== publicKey)} />
                    <div className="grid grid-cols-12 mt-4 border-b border-gray-200">
                        <div className="col-start-2 col-span-10">
                            <Tabs tabs={[{
                                ...tabs[0],
                                count: counts?.numCollected
                            }, 
                            {
                                ...tabs[1],
                                count: counts?.numMinted
                            },
                            {
                                ...tabs[2],
                                count: counts?.numUserBids
                            }]} />
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/profile/:publicKey">
                            <Collected nfts={collectedNfts} publicKey={publicKey} setNfts={setCollectedNfts} />
                        </Route>
                        <Route path="/profile/:publicKey/created">
                            <Created nfts={createdNfts} setNfts={setCreatedNfts} publicKey={publicKey} />
                        </Route>
                        <Route path="/profile/:publicKey/bids">
                            <Bids bids={bids} setBids={setBids} publicKey={publicKey} />
                        </Route>
                    </Switch>
                </Route>
            </Switch>
        </div>
    );
}

Profile.propTypes = {
    showLoginModal: PropTypes.func.isRequired
}