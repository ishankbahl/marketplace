import Navbar from './Components/NavbarComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { NAVBAR_DATA, GET_USERS_STATELESS } from './Constants/Routes';
import messageHandler, { sendInfoMessageToIframe } from './utils/identityUtil.js';
import useEvent from './Hooks/useEvent';
import useIdentityData from "./Hooks/useIdentityData";
import fetchUtil from './utils/fetchUtil';
import Notification from './Components/NotificationComponent';
import { CONTENT_TYPE, APPLICATION_JSON, PUBLIC_KEYS_BASE_58_CHECK, PUBLIC_KEY_BASE_58_CHECK } from './Constants';
import { XCircleIcon } from '@heroicons/react/solid'
import LoginModal from './Components/LoginModalComponent';
import cloneDeep from 'lodash.clonedeep';
import Footer from './Components/FooterComponent';
import LoaderComponent from './Components/LoaderComponent';
import Home from './Components/HomeComponent';
import ErrorBoundary from './Components/ErrorBoundaryComponent';
import ScrollToTop from './Components/ScrollToTopComponent';

const Profile = lazy(() => import('./Components/ProfileComponent'));
const NftDetails = lazy(() => import('./Components/NftDetailComponent'));
const Showcase = lazy(() => import('./Components/ShowcaseComponent'));

export const AuthContext = React.createContext();
export const UsersContext = React.createContext();
export const NotificationContext = React.createContext();
// export const LoginModalContext = React.createContext();

function App() {

  const [NavbarTabs, setNavbarTabs] = useState(cloneDeep(NAVBAR_DATA));
  const { identityData, setIdentityData } = useIdentityData();
  const [usersData, setUsersData] = useState();
  const [notifData, setNotifData] = useState({isVisible: false});
  const [isLoginModalVisible, setLoginModalVisiblity] = useState(false);
  const [showcaseNfts, setShowcaseNfts] = useState([]);

    // This is to handle access in ios for chrome and safari
    if(identityData?.publicKeyAdded) {
      sendInfoMessageToIframe();
    }

  const changeUser = (publicKeyAdded) => {
    setIdentityData({
      ...identityData,
      publicKeyAdded
    });
  }

  // Call fetching Users data & setting navbar routes
  useEffect(() => {
    setNavbarTabs(cloneDeep(NAVBAR_DATA));
    if(!identityData?.publicKeyAdded) {
      NavbarTabs[1].route = NAVBAR_DATA[1].route + '/log-in';
      setNavbarTabs(cloneDeep(NavbarTabs));
      return;
    }
    const keys = Object.keys(identityData.users);

    NavbarTabs[1].route = NAVBAR_DATA[1].route + '/' + identityData.publicKeyAdded;
    setNavbarTabs(cloneDeep(NavbarTabs));

    fetchUtil(GET_USERS_STATELESS, {
      method: 'POST',
      body: JSON.stringify({
        [PUBLIC_KEYS_BASE_58_CHECK]: keys,
        SkipForLeaderboard: false
      }),
      headers: {
        [CONTENT_TYPE]: APPLICATION_JSON
      }
    }, undefined, (data) => {
      data.UserList = data.UserList.reduce((acc, user) => {
        acc[user[PUBLIC_KEY_BASE_58_CHECK]] = user;
        return acc;
      }, {});
      setUsersData(data);
    }, () => {
      setNotifData({
        isVisible: true,
        text: "Error occured while fetching user details",
        heading: "Request Failed",
        icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      });
      setTimeout(() => setNotifData({isVisible: false}), 4000);
    });
  }, [identityData]);

  useEvent("message", (message) => messageHandler(message, setIdentityData));

  return (
    <div className="App">
      <header className="App-header">
        <AuthContext.Provider value={identityData}>
          <UsersContext.Provider value={usersData}>
            <NotificationContext.Provider value={setNotifData}>
              <Router>
                <ErrorBoundary>
                  <ScrollToTop />
                  <Navbar tabs={NavbarTabs} changeUser={changeUser} showLoginModal={setLoginModalVisiblity} />
                  <Suspense fallback={<div style={{ marginBottom: '2000px' }} className="flex justify-center my-10"><LoaderComponent /></div>}>
                    <Switch>
                      <Route path="/profile">
                        <Profile showLoginModal={setLoginModalVisiblity} />
                      </Route>
                      <Route path="/discover">
                        <Showcase nfts={showcaseNfts} setNfts={setShowcaseNfts} />
                      </Route>
                      <Route path="/nft/:hash">
                        <NftDetails />
                      </Route>
                      <Route exact path="/">
                        <Home />
                      </Route>
                    </Switch>
                    <Footer />
                  </Suspense>
                </ErrorBoundary>
              </Router>
            </NotificationContext.Provider>
          </UsersContext.Provider>
        </AuthContext.Provider>
      </header>
      <Notification show={notifData.isVisible} text={notifData.text} heading={notifData.heading} icon={notifData.icon} hide={() => setNotifData({isVisible: false})} />
      <LoginModal show={isLoginModalVisible} showLoginModal={setLoginModalVisiblity} />
    </div>
  );
}

export default App;
