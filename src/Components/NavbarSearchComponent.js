import React, { useState } from 'react'
import { useCombobox } from 'downshift'
import { SearchIcon } from '@heroicons/react/outline';
import debounce from 'lodash.debounce';
import { GET_PROFILES, GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from '../Constants/Routes';
import { CONTENT_TYPE, APPLICATION_JSON } from '../Constants';
import fetchUtil from '../utils/fetchUtil';
import round from '../utils/roundUtil';
import CloutIcon from '../Icons/CloutIcon';
import { useHistory } from 'react-router-dom';
import LoaderComponent from './LoaderComponent';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const controllers = [];

const getProfiles = debounce((inputValue, setItems) => {

    const controller = new AbortController();
    const signal = controller.signal;
    controllers.forEach(cont => cont.abort());
    controllers.length = 0;
    controllers.push(controller);

    fetchUtil(GET_PROFILES, {
        method: 'POST',
        body: JSON.stringify({...GET_PROFILE_BODY, "UsernamePrefix": inputValue}),
        headers: {
            [CONTENT_TYPE]: APPLICATION_JSON
        },
        signal
  }, () => {
      //loader stuff
  }, (data) => {
    setItems(data.ProfilesFound.map(profile => ({
        coinPriceClout: round(profile.CoinPriceBitCloutNanos/1000000000),
        publicKey: profile.PublicKeyBase58Check,
        userName: profile.Username,
    })));
}, () => {/** failure code */})}, 250);

const GET_PROFILE_BODY = {"PublicKeyBase58Check":"","Username":"","UsernamePrefix":"","Description":"","OrderBy":"","NumToFetch":20,"ModerationType":"","FetchUsersThatHODL":false,"AddGlobalFeedBool":false};

export default function NavbarSearch() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const changeItemsState = (newItems) => {
        setItems(newItems);
        setIsLoading(false);
    }

    const {
        isOpen,
        reset,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        closeMenu
      } = useCombobox({
        items,
        onInputValueChange: ({inputValue, selectedItem}) => {
            if(!inputValue && isOpen) {
                closeMenu();
                return;
            }
            if(inputValue && !selectedItem) {
                setIsLoading(true);
                getProfiles(inputValue, changeItemsState);
            }
        },
        defaultIsOpen: false,
        itemToString: (item) => item.userName,
        onIsOpenChange: (changes) => {
            if(!changes.isOpen) {
                reset();
            }
            if(!changes.inputValue && changes.isOpen) { 
                closeMenu();
            }
        },
        onSelectedItemChange: (changes) => {
            if(changes.selectedItem) {
                history.push('/profile/' + changes.selectedItem.publicKey);
            }
        }
    });

    return (
        <>
            <div className="max-w-lg w-full lg:max-w-xs">
                <label {...getLabelProps()} htmlFor="search-marketplace" className="sr-only">
                    Search
                </label>
                <div className="relative" {...getComboboxProps()}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        {...getInputProps()}
                        id="search-marketplace"
                        name="search-marketplace"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search Profiles"
                        type="search"
                    />
                </div>
                <ul {...getMenuProps()} className={classNames(isOpen ? "" : "hidden", "max-w-lg lg:max-w-xs w-9/12 sm:w-full absolute z-10 mt-1 bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm")}>
                    {isLoading && <li>
                        <div className="flex justify-center my-1"><LoaderComponent /></div>
                    </li>}
                    {!isLoading && items.map((item, index) => (
                        <li
                            className={classNames(highlightedIndex === index ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-pointer select-none relative py-2 pl-3 pr-9')}
                            key={`${item}${index}`}
                            {...getItemProps({item, index})}
                        >
                            <img
                                className="inline h-6 w-6 rounded-full mr-1"
                                src={GET_PROFILE_IMAGE + item.publicKey + PROFILE_IMAGE_FALLBACK}
                                alt="profile"
                            />
                            {item.userName.length > 12 ? item.userName.slice(0, 12) + '..' : item.userName}
                            {!!item.coinPriceClout && <><div className="ml-1 inline">
                                .
                            </div>
                            <div className="ml-1 inline">
                                ~{item.coinPriceClout} <CloutIcon />
                            </div></>}
                        </li>
                    ))}
                    {!isLoading && !items.length && <li className="text-gray-900 select-none relative py-2 pl-3 pr-9">
                        No results
                    </li>}
                </ul>
            </div>
        </>
    );
}