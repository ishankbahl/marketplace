import Modal from "./ModalComponent";
import PropTypes from 'prop-types';
import { Dialog } from "@headlessui/react";
import SelectBox from "./SelectBoxComponent";
import CurrencyInput from "./CurrencyInputComponent";
import { useState } from "react";
import { NotificationContext, AuthContext } from "../App";
import LoaderComponent from "./LoaderComponent";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { CREATE_NFT_BID } from "../Constants/Routes";
import fetchUtil from "../utils/fetchUtil";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import { signTransaction, submitTransaction, askApproval } from "../utils/identityUtil";

export default function AddBitModal(props) {
    const [edition, setEdition] = useState(props.editions[0]);
    const identityData = useContext(AuthContext);
    const [amount, setAmount] = useState();
    const setNotifData = useContext(NotificationContext);
    const [isLoading, showLoader] = useState(false);

    const modalContent = (
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Place a bid
            </Dialog.Title>
            <hr className="my-3"/>
            <div className="mt-2">
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {props.editions.length > 1 && <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Select Edition
                        </label>
                        <div className="mt-1 flex rounded-md">
                            <SelectBox selected={edition} options={props.editions} onChange={setEdition} />
                        </div>
                    </div>}
                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <div className="mt-1 flex rounded-md">
                            <CurrencyInput min={props.min} onChange={setAmount}  />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const showModalWrapper = () => {
        showLoader(false);
        props.showModal(false);
    }

    const placeBid = () => {
        if(edition.key && amount) {
            if(amount < props.min) {
                setNotifData({
                    isVisible: true,
                    heading: "Less Than Minimum Bid",
                    icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                });
                setTimeout(() => setNotifData({isVisible: false}), 4000);
                return;
            }
            showLoader(true);

            fetchUtil(CREATE_NFT_BID, {
                method: 'POST',
                body: JSON.stringify({
                    "UpdaterPublicKeyBase58Check": identityData.publicKeyAdded,
                    "NFTPostHashHex": props.NFTHash,
                    "SerialNumber": edition.key,
                    "BidAmountNanos": amount*1000000000,
                    "MinFeeRateNanosPerKB":1000
                }),
                headers: {
                  [CONTENT_TYPE]: APPLICATION_JSON
                }
              }, () => {}, ({TransactionHex, error}) => {
                if(error) {
                    setNotifData({
                        isVisible: true,
                        text: error,
                        heading: "Bid Failed",
                        icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    });
                    setTimeout(() => setNotifData({isVisible: false}), 4000);
                    showLoader(false);
                    return;
                }
                signTransaction({
                      ...identityData.users[identityData.publicKeyAdded],
                      transactionHex: TransactionHex
                }).then(data => {
                    if(data.signedTransactionHex) {
                        submitTransaction(data.signedTransactionHex).then(data => {
                            setNotifData({
                                isVisible: true,
                                heading: "Bid Placed",
                                icon: <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            });
                            setTimeout(() => setNotifData({isVisible: false}), 4000);
                            showModalWrapper();
                            props.successCallback?.();
                        });
                    }
                    else {
                        const approvalHandler = () => {
                            setNotifData({
                                isVisible: true,
                                heading: "Bid was placed",
                                icon: <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            });
                            showModalWrapper();
                            window.removeEventListener('approval-success', approvalHandler);
                        }
                        const event = new Event('approval-success');
                        window.addEventListener('approval-success', approvalHandler);

                        askApproval(TransactionHex, event);
                    }
                })
              }, () => {});
        }
        else {
            setNotifData({
                isVisible: true,
                text: "Some fields aren't filled",
                heading: "Empty Fields",
                icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            });
            setTimeout(() => setNotifData({isVisible: false}), 4000);
        }
    }

    const actionButtons = (
        <button
            onClick={placeBid}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {isLoading && <LoaderComponent style={{height: 15, width: 15, marginRight: 2}} />}
            Place Bid
        </button>
    );

    return (
        <Modal show={props.show} showModal={showModalWrapper} content={modalContent} actionButtons={actionButtons} showClose={true} />
    )
}

AddBitModal.propTypes = {
    show: PropTypes.bool,
    showModal: PropTypes.func.isRequired,
    editions: PropTypes.array,
    NFTHash: PropTypes.string.isRequired,
    min: PropTypes.number,
    successCllback: PropTypes.func
};