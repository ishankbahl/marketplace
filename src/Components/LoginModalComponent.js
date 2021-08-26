import Modal from "./ModalComponent";
import PropTypes from 'prop-types';
import { useState } from 'react'
import { LoginIcon, CheckIcon } from "@heroicons/react/solid"
import RadioList from "./RadioListComponent";
import { login } from "../utils/identityUtil";
import List from './ListComponent';

const checkIcon = <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />

const items = [
    { content: <>{checkIcon} Your basic information</>, key: 1 },
    { content: <>{checkIcon} Post, message, like, and follow</>, key: 2 },
    { content: <>{checkIcon} Buy, sell, and send coins. Bidding on NFTs</>, key: 3 },
];

const options = [
    { name: 'Full access', description: <List items={items} />, value: 4, key: 1 },
    { name: 'Restricted Acess', description: <List items={items.slice(0, 2)} />, value: 3, key: 2 },
];

export default function LoginModal(props) {
    const [selected, setSelected] = useState(options[0]);    
    
    const modalContent = (
        <RadioList options={options} selected={selected} onChange={setSelected} label="Grants:" />
    );

    const onLoginClick = () => {
        login(selected.value);
        props.showLoginModal(false);
    }

    const actionButtons = (
        <button
            onClick={onLoginClick}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <LoginIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Login
        </button>
    );
    return (
        <Modal show={props.show} showModal={props.showLoginModal} content={modalContent} actionButtons={actionButtons} />
    )
}

LoginModal.propTypes = {
    show: PropTypes.bool,
    showLoginModal: PropTypes.func,
};