import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DiamondIcon from '../Icons/DiamondIcon';
import { SEND_DIAMONDS } from '../Constants/Routes';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import fetchUtil from '../utils/fetchUtil';
import { signTransaction, submitTransaction, askApproval } from '../utils/identityUtil';
import { AuthContext } from '../App';

export default function DiamondButton(props) {
    const identityData = useContext(AuthContext);
    const [count, setCount] = useState(props.count);
    const [diamondLevel, setDiamondLevel] = useState(props.diamondLevel);

    const onDiamond = () => {
        if(!identityData?.publicKeyAdded) {
            //TODO: add notification for to login
            return;
        }

        setCount(count + 1);
        setDiamondLevel(diamondLevel + 1);

        fetchUtil(SEND_DIAMONDS, {
            method: 'POST',
            body: JSON.stringify({
                SenderPublicKeyBase58Check: identityData.publicKeyAdded,
                ReceiverPublicKeyBase58Check: props.creatorPublicKey,
                DiamondPostHashHex: props.hash,
                DiamondLevel: 1,
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
                else {
                    askApproval(TransactionHex);
                }
            })
          }, () => {/** failure code */});
    }

    return (
        <div className={diamondLevel ? "text-blue-700" : ""}>
            <IconButton aria-label="Diamond" onClick={onDiamond}>
                <div className={`flex-shrink-0 ${diamondLevel ? "text-blue-700" : ""}`} >
                    <DiamondIcon aria-hidden="true" />
                </div>
            </IconButton>
            <div className="inline align-middle">{count || 0}</div>
        </div>
    );
}

DiamondButton.propTypes = {
    diamondLevel: PropTypes.number,
    hash: PropTypes.string.isRequired,
    count: PropTypes.number,
    creatorPublicKey: PropTypes.string
};