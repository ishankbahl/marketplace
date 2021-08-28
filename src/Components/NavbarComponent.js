import { useState, useContext } from 'react'
import PropTypes from 'prop-types';
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { NavLink, Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import { AuthContext, UsersContext } from '../App';
import { logout } from '../utils/identityUtil';
import SelectBox from './SelectBoxComponent';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from '../Constants/Routes';
import { LogoutIcon, UserAddIcon } from '@heroicons/react/outline';
import NavbarSearch from './NavbarSearchComponent';
import Logo from '../assets/logo.jpg';
import MobileLogo from '../assets/logo-mobile.jpg';

function getOption(key, username) {
  return {
    key,
    appendElement: <img
        className="h-5 w-5 rounded-full"
        src={GET_PROFILE_IMAGE + key + PROFILE_IMAGE_FALLBACK}
        alt="profile"
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
    options = Object.keys(identityData.users).map(key => getOption(key, usersData?.UserList[key]?.ProfileEntryResponse?.Username || key));
    selected = options.find(option => option.key === identityData.publicKeyAdded);
    options.push({
      key: 'add user',
      appendElement: <UserAddIcon className="h-5 w-5 inline center" />,
      content: <div className='block text-sm text-gray-700'>
         Add User
        </div>,
      onClick: () => props.showLoginModal(true),
      isUnselectable: true,
    });

    options.push({
      key: 'log out',
      appendElement: <LogoutIcon className="h-5 w-5 inline center" />,
      content: <div className='block text-sm text-gray-700'>
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
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={MobileLogo}
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={Logo}
                    alt="Workflow"
                  />
                </Link>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {props.tabs.map(tab => getTab(tab))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
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
            <div className="py-2 border-t border-gray-200">
              <div className="flex items-center px-4">
                {!identityData?.publicKeyAdded ? <LoginButton click={() => props.showLoginModal(true)} /> : 
                  <SelectBox options={options} selected={selected} onChange={onUserChange} />
                }
              </div>
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
