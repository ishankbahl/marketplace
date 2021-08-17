import { Fragment, useState, useContext } from 'react'
import PropTypes from 'prop-types';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon, CogIcon } from '@heroicons/react/outline';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import { AuthContext, UsersContext } from '../App';
import { logout } from '../utils/identityUtil';
import SelectBox from './SelectBoxComponent';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from '../Constants/Routes';
import { LogoutIcon, UserAddIcon } from '@heroicons/react/outline';
import NavbarSearch from './NavbarSearchComponent';
import { SearchIcon } from '@heroicons/react/outline';

function getOption(key, username) {
  return {
    key,
    appendElement: <img
        className="h-8 w-8 rounded-full"
        src={GET_PROFILE_IMAGE + key + PROFILE_IMAGE_FALLBACK}
      />,
    content: username.length > 10 ? username.slice(0, 10) + '..' : username 
  }
}

export default function Navbar(props) {

  const [currentRoute] = useState(props.tabs[0]);
  const identityData = useContext(AuthContext);
  const usersData = useContext(UsersContext);
  const logoutCurrentAccount = () => {
    logout(identityData.publicKeyAdded);
  }

  let options = [];
  let selected;
  if(identityData?.publicKeyAdded) {
    options = Object.keys(identityData.users).map(key => getOption(key, usersData?.UserList[key]?.ProfileEntryResponse.Username || key));
    selected = options.find(option => option.key === identityData.publicKeyAdded);
    options.push({
      key: 'add user',
      appendElement: <UserAddIcon className="h-6 w-6 inline center" />,
      content: <div className='block px-4 py-2 text-sm text-gray-700'>
         Add User
        </div>,
      onClick: () => props.showLoginModal(true),
      isUnselectable: true,
    });

    options.push({
      key: 'log out',
      appendElement: <LogoutIcon className="h-6 w-6 inline center" />,
      content: <div className='block px-4 py-2 text-sm text-gray-700'>
           Logout
        </div>,
      onClick: logoutCurrentAccount,
      isUnselectable: true,
    });

  }

  const onUserChange = (option) => {
    props.changeUser(option.key);
  }

  const getTab = (tab) => {
    return (
      <NavLink
        key={tab.route}
        to={tab.route}
        activeClassName="border-indigo-500 text-gray-900"
        className={`${tab.route !== currentRoute && 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
      >
        {tab.content}
      </NavLink>
    )
  }

  const getSmallTab = (tab) => {
    return (
      <NavLink
        key={tab.route}
        to={tab.route}
        activeClassName="bg-indigo-50 border-indigo-500 text-indigo-700"
        className={`${tab.route !== currentRoute && 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
      >
        {tab.content}
      </NavLink>
    );
  }

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex px-2 lg:px-0">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {props.tabs.map(tab => getTab(tab))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                {/* <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search-marketplace" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="search-marketplace"
                      name="search-marketplace"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div> */}
                <NavbarSearch />
              </div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                {!identityData?.publicKeyAdded ? <LoginButton click={() => props.showLoginModal(true)} /> : 
                <SelectBox options={options} selected={selected} onChange={onUserChange} />}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              {props.tabs.map(tab => getSmallTab(tab))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!identityData?.publicKeyAdded ? <LoginButton click={() => props.showLoginModal(true)} /> : <>
              <div className="flex items-center px-4">
                <SelectBox options={options} selected={selected} onChange={onUserChange} />
              </div></>}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

Navbar.propTypes = {
  tabs: PropTypes.array,
  changeUser: PropTypes.func,
  showLoginModal: PropTypes.func,
};