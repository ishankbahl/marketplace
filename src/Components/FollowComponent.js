import PropTypes from 'prop-types';
import { useState } from 'react';
import fetchUtil from '../utils/fetchUtil';
import { CREATE_FOLLOW_TRANSACTION } from '../Constants/Routes';
import { NotificationContext, AuthContext } from '../App';
import { useContext } from 'react';
import { signTransaction, submitTransaction } from '../utils/identityUtil';
import { XCircleIcon } from '@heroicons/react/outline';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import { useEffect } from 'react';

export default function FollowButton(props) {
    const [isFollowed, setFollowed] = useState(props.isFollowed);
    const setNotifData = useContext(NotificationContext);
    const identityData = useContext(AuthContext);

    const follow = (e) => {
        e.stopPropagation();
        if(!identityData?.publicKeyAdded) {
            setNotifData({
                isVisible: true,
                text: "Please Login to follow",
                heading: "Login",
                icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            });
            setTimeout(() => setNotifData({isVisible: false}), 4000);
            return;
        }
        const followStatus = isFollowed;
        setFollowed(!followStatus);
        fetchUtil(CREATE_FOLLOW_TRANSACTION, {
            method: 'POST',
            body: JSON.stringify({
                FollowerPublicKeyBase58Check: identityData?.publicKeyAdded,
                FollowedPublicKeyBase58Check: props.publicKey,
                IsUnfollow: isFollowed,
                MinFeeRateNanosPerKB: 1000
            }),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
        }, () => {}, ({ TransactionHex, error }) => {
            if(error) {
                setFollowed(followStatus);
                setNotifData({
                    isVisible: true,
                    text: error,
                    heading: "Follow Action Failed",
                    icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                });
                setTimeout(() => setNotifData({isVisible: false}), 4000);
                return;
            }
            signTransaction({
                  ...identityData.users[identityData.publicKeyAdded],
                  transactionHex: TransactionHex
            }).then(data => {
                if(data.signedTransactionHex) {
                    submitTransaction(data.signedTransactionHex);
                }
            })
        }, () => {/** failure code */});
    }

    useEffect(() => {
        setFollowed(props.isFollowed);
    }, [props.isFollowed]);

    if(isFollowed) {
        return <div onClick={follow}>{props.followedContent}</div>
    }

    return (
        <div onClick={follow}>{props.notFollowedContent}</div>
    )
}

FollowButton.propTypes = {
    publicKey: PropTypes.string,
    followedContent: PropTypes.element,
    notFollowedContent: PropTypes.element,
    isFollowed: PropTypes.bool
}