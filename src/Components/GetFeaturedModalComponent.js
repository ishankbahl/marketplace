import Modal from "./ModalComponent";
import PropTypes from 'prop-types';
import TwitterIcon from '@material-ui/icons/Twitter';
import CloutIcon from "../Icons/CloutIcon";

const modalContent = (
    <div className="px-4">
        <ol className="list-decimal space-y-2">
            <li><b>Create</b> your NFT on BitClout</li>
            <li><b>Post</b> a link to your NFT on Twitter or BitClout</li>
            <li><b>Include</b> @Oble and #ObleNFT in your post</li>
            <li>We'll periodically review these NFTs and select one to feature</li>
        </ol>
    </div>
);

export default function GetFeaturedModal(props) {

    const actionButtons = (
        <div className="flex">
            <a
                href="https://bitclout.com/u/oble"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm rounded-md font-medium border-none text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <CloutIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    BitClout
                </button>
            </a>
            <a
                href="https://twitter.com/Obleio"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm rounded-md font-medium border-none text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-3"
            >
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <TwitterIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Twitter
                </button>
            </a>
        </div>
    );

    return (
        <Modal show={props.show} showModal={props.showModal} content={modalContent} actionButtons={actionButtons} />
    )
}

GetFeaturedModal.propTypes = {
    show: PropTypes.bool,
    showModal: PropTypes.func,
};