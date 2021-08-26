import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { HeartIcon, XCircleIcon } from '@heroicons/react/outline';
import fetchUtil from '../utils/fetchUtil';
import { APPLICATION_JSON, CONTENT_TYPE } from '../Constants';
import { AuthContext, NotificationContext } from '../App';
import { LIKE_POST } from '../Constants/Routes';
import { signTransaction, submitTransaction } from '../utils/identityUtil';

export default function LikeButton(props) {
    const [isLiked, setLikeStatus] = useState(props.isLiked);
    const setNotifData = useContext(NotificationContext);
    const [count, setCount] = useState(props.count);
    const identityData = useContext(AuthContext);

    const onLike = (e) => {
        e.stopPropagation();
        if(!identityData?.publicKeyAdded) {
            setNotifData({
                isVisible: true,
                text: "Please Login to like",
                heading: "Login",
                icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            });
            setTimeout(() => setNotifData({isVisible: false}), 4000);
            return;
        }
        const IsUnlike = isLiked;
        setLikeStatus(!isLiked);
        setCount(IsUnlike ? count - 1 : count + 1);
        fetchUtil(LIKE_POST, {
            method: 'POST',
            body: JSON.stringify({
                ReaderPublicKeyBase58Check: identityData.publicKeyAdded,
                LikedPostHashHex: props.hash,
                IsUnlike,
                MinFeeRateNanosPerKB: 1000
            }),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
          }, () => {
              //loader stuff
          }, ({ TransactionHex, error }) => {
            if(error) {
                setNotifData({
                    isVisible: true,
                    text: error,
                    heading: "Like Action Failed",
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
        setCount(props.count);
    }, [props.count]);

    useEffect(() => {
        setLikeStatus(props.isLiked);
    }, [props.isLiked]);

    return (
        <div className={isLiked ? "text-red-500" : ""}>
            <IconButton aria-label="Like" onClick={onLike}>
                { isLiked ? <HeartIconSolid className="flex-shrink-0 h-5 w-5 text-red-500" /> : <HeartIcon className="flex-shrink-0 h-5 w-5" /> }
            </IconButton>
            <div className="inline align-middle">{count || 0}</div>
        </div>
    );
}

LikeButton.propTypes = {
    isLiked: PropTypes.bool,
    hash: PropTypes.string.isRequired,
    count: PropTypes.number
}; 