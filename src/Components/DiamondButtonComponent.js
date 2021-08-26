import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DiamondIcon from '../Icons/DiamondIcon';
import { SEND_DIAMONDS } from '../Constants/Routes';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import fetchUtil from '../utils/fetchUtil';
import { signTransaction, submitTransaction, askApproval } from '../utils/identityUtil';
import { AuthContext, NotificationContext } from '../App';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { XCircleIcon } from '@heroicons/react/outline';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'relative',
    },
    dropdown: {
      position: 'absolute',
      top: 40,
      zIndex: 1,
      border: '1px solid',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  }));

const levels = [1, 2, 3, 4, 5, 6];

export default function DiamondButton(props) {
    const identityData = useContext(AuthContext);
    const setNotifData = useContext(NotificationContext);
    const [count, setCount] = useState(props.count);
    const [diamondLevel, setDiamondLevel] = useState(props.diamondLevel);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        if(!identityData?.publicKeyAdded) {
            setNotifData({
                isVisible: true,
                text: "Please Login to send diamonds",
                heading: "Login",
                icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            });
            setTimeout(() => setNotifData({isVisible: false}), 4000);
            return;
        }
        if(diamondLevel === 6) {
            setNotifData({
                isVisible: true,
                text: "You have already given 6 diamonds",
                heading: "Diamond limit",
                icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            });
            setTimeout(() => setNotifData({isVisible: false}), 4000);
            return;
        }
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const onDiamond = (e, level) => {
        e.stopPropagation();

        setCount(count + level - diamondLevel);
        setDiamondLevel(level);
        setOpen(false);

        fetchUtil(SEND_DIAMONDS, {
            method: 'POST',
            body: JSON.stringify({
                SenderPublicKeyBase58Check: identityData.publicKeyAdded,
                ReceiverPublicKeyBase58Check: props.creatorPublicKey,
                DiamondPostHashHex: props.hash,
                DiamondLevel: level,
                MinFeeRateNanosPerKB: 1000
            }),
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
          }, () => {}, ({TransactionHex, error}) => {
            if(error) {
                setNotifData({
                    isVisible: true,
                    text: error,
                    heading: "Sending Diamonds Failed",
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
                else {
                    askApproval(TransactionHex);
                }
            })
          }, () => {});
    }

    useEffect(() => {
        setCount(props.count);
    }, [props.count]);

    useEffect(() => {
        setDiamondLevel(props.diamondLevel);
    }, [props.diamondLevel]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
                <div className={`${diamondLevel ? "text-blue-700" : ""}`}>
                    <IconButton aria-label="Diamond" onClick={handleClick}>
                        <div className={`flex-shrink-0 ${diamondLevel ? "text-blue-700" : ""}`} >
                            <DiamondIcon aria-hidden="true" />
                        </div>
                    </IconButton>
                    <div className="inline align-middle">{count || 0}</div>
                </div>
                {open ? (
                    <div className={classes.dropdown}>
                        <ul className="flex gap-x-3">
                            {levels.map(level => level > diamondLevel && 
                            <li key={level} className="flex">
                                <div className="mr-1">{level}</div> 
                                <div className="cursor-pointer" onClick={(e) => onDiamond(e, level)}>
                                    <DiamondIcon style={{"display": "inline"}} aria-hidden="true" />
                                </div>
                            </li>)}
                        </ul>
                    </div>
                    ) : null}
            </div>
        </ClickAwayListener>
    );
}

DiamondButton.propTypes = {
    diamondLevel: PropTypes.number,
    hash: PropTypes.string.isRequired,
    count: PropTypes.number,
    creatorPublicKey: PropTypes.string
};