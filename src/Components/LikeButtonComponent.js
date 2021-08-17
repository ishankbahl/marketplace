import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { HeartIcon } from '@heroicons/react/outline';
import fetchUtil from '../utils/fetchUtil';
import { APPLICATION_JSON, CONTENT_TYPE } from '../Constants';
import { AuthContext } from '../App';
import { LIKE_POST } from '../Constants/Routes';
import { signTransaction, submitTransaction } from '../utils/identityUtil';

export default function LikeButton(props) {
    const [isLiked, setLikeStatus] = useState(props.isLiked);
    const [count, setCount] = useState(props.count);
    const identityData = useContext(AuthContext);

    const onLike = () => {
        if(!identityData?.publicKeyAdded) {
            //TODO: add notification for to login
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
          }, ({ TransactionHex }) => {
            signTransaction({
                  ...identityData.users[identityData.publicKeyAdded],
                  transactionHex: TransactionHex
            }).then(data => {
                if(data.signedTransactionHex) {
                    submitTransaction(data.signedTransactionHex);
                }
            }).then(data => console.log(data));
          }, () => {/** failure code */});
    }

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