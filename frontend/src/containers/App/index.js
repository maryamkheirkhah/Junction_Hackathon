import React, { Fragment, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import styled, { keyframes } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { Themes } from '../../utils/themes';
import { createGlobalStyle } from 'styled-components';
import menu from '../../assets/images/menu.svg';
import routes from '../../routes';
import getAllUrlParams from '../../utils/getAllUrlParams';
import decodeURIComponentSafe from '../../utils/decodeURIComponentSafe';
import history from '../../utils/history';
import { SnatchLogo } from '../../components/SnatchLogo';
import NavigationBar from '../../components/NavigationBar';
import Menu from '../../components/Menu';
import VersionInfo from '../../components/VersionInfo';
import config from '../../utils/config';
import loginToken from '../../utils/loginToken';
import AuthenticationTimeout from '../../content/AuthenticationTimeout';

const App = props => {
  let { user, navigation, theme } = React.useContext(AppContext);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ state: false, message: '' });

  let historyListenerClean = useRef();
  useEffect(() => {
    let urlObj = new URL(window.location.href);

    historyListenerClean.current = history.listen((location, action) => {
      // location is an object like window.location

      if (action === 'POP') {
        //navigateTo(location.pathname + location.search, null, true);
        if (location.pathname !== '/login') {
          navigateTo(location.pathname + location.search);
        } else {
          history.goForward();
        }
      }

      window.scrollTo(0, 0);
    });
    console.log('loginToken.current', loginToken.current);
    if (loginToken.current) {
      console.log('<< App >> : < useEffect > : user.state.authorized : ', user.state.authorized);
      login(
        {
            message: loginToken.message,
            role: loginToken.role,
            sub_role: loginToken.sub_role,
            user_id: loginToken.user_id,
            username: loginToken.username,
            timestamp: new Date().getTime()
          }
      );
    } else {
      navigateTo('/login/');
       history.push({
        pathname: '/login'
      });
      
    }
    return () => {
      historyListenerClean.current();
    };
  }, []);

  useEffect(() => {
    if (user.state.authorized === false) {
      navigateTo('/login/');

    } else if (user.state.authorized === true) {
      if (window.location.pathname.startsWith('/login')){
        if(user?.state?.organisation_id==null){
          navigateTo('/dashboards/');
        }else{
          navigateTo('/campaign_analytics/');
        }
      }
      else navigateTo(window.location.pathname);
    }
    return () => {};
  }, [user.state.authorized]);

  useEffect(() => {
      if (user.state.authorized && loginToken.current?.auth_token) {
        getCredentials().then(res => {});
        if (`${history.location.pathname}${history.location.search}` !== navigation.state.current_path) {
          history.push({
            pathname: navigation.state.current_path.split('?')[0],
            search: navigation.state.current_path.split('?')[1]
          });
        }
      } else if (user.state.authorized !== null && !user.state.authorized) {
        history.push({
          pathname: '/login'
        });
      }

    setMenuDisplay(false);

    return () => {};
  }, [navigation.state.current_path, user.state.authorized]);

  const getCredentials = () => {
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND];
    const PATH_CALL = '/token/get_credentials';
    const url = `${PATH_BASE}${PATH_CALL}`;
    let headers = {
      'Access-Control-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: loginToken.current.auth_token
    };

    return fetch(url, {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        if (response.status === 419) {
          console.log('getCredentials response: authentication timeout');
          navigateTo('/authentication_timeout');
        } else {
          return response.json();
        }
      })
      .then(responseData => {
        if (responseData && responseData.status === 'SUCCESS') {
          if (responseData.data.token) {
            let localData = { ...loginToken.current };
            loginToken.current = {
              ...localData,
              auth_token: responseData.data.token,
              credentials: responseData.data.credentials
            };
            user.dispatch({
              type: 'token',
              payload: { auth_token: responseData.data.token, credentials: responseData.data.credentials }
            });
          }
          return responseData;
        } else if (responseData && responseData.status === 'ERROR') {
          logout();
        }
      })
      .catch(error => {
        console.log('<< App >> : < getCredentials > : error : ', error);
        logout();
      });
  };

  let setToken = token => () => user.dispatch({ type: 'test', payload: token });
  const resetPassword = () => {
    navigateTo('reset');
    user.dispatch({ type: 'logout' });
    history.push('/');
  };

  let navigateTo = (destination, payload = null, replace = false) => {
    if (destination === '/login' && user.state.authorized) {
      history.goForward();
      return;
    }
    let allUrlParams = getAllUrlParams();

    if (payload !== null && Object.keys(payload).length > 0 && payload.constructor === Object) {
      //payload.name.replace(/%(?!\d+)/g, 'pp');

      if (payload.name) {
        payload.name = decodeURIComponentSafe(payload.name);
        payload.name = payload.name.replaceAll('%', '(prc_sgn)');

        payload.name = encodeURIComponent(payload.name);
      }
      if (payload.campaign_name) {
        payload.campaign_name = decodeURIComponentSafe(payload.campaign_name);
        payload.campaign_name = payload.campaign_name.replaceAll('%', '(prc_sgn)');

        payload.campaign_name = encodeURIComponent(payload.campaign_name);
      }
      if (payload.prize_name) {
        payload.prize_name = decodeURIComponentSafe(payload.prize_name);
        payload.prize_name = payload.prize_name.replaceAll('%', '(prc_sgn)');

        payload.prize_name = encodeURIComponent(payload.prize_name);
      }
      if (payload.safehouse_name) {
        payload.safehouse_name = decodeURIComponentSafe(payload.safehouse_name);
        payload.safehouse_name = payload.safehouse_name.replaceAll('%', '(prc_sgn)');

        payload.safehouse_name = encodeURIComponent(payload.safehouse_name);
      }
      if (payload.offer_name) {
        payload.offer_name = decodeURIComponentSafe(payload.offer_name);
        payload.offer_name = payload.offer_name.replaceAll('%', '(prc_sgn)');

        payload.offer_name = encodeURIComponent(payload.offer_name);
      }
      if (payload.group_id) {
        payload.group_id = decodeURIComponentSafe(payload.group_id);

        payload.group_id = encodeURIComponent(payload.group_id);
      }
      if (payload.user_id) {
        payload.user_id = decodeURIComponentSafe(payload.user_id);

        payload.user_id = encodeURIComponent(payload.user_id);
      }
      if (payload.group_name) {
        payload.group_name = decodeURIComponentSafe(payload.group_name);
        payload.group_name = payload.group_name.replaceAll('%', '(prc_sgn)');

        payload.group_name = encodeURIComponent(payload.group_name);
      }
      if (payload.user_name) {
        payload.user_name = decodeURIComponentSafe(payload.user_name);
        payload.user_name = payload.user_name.replaceAll('%', '(prc_sgn)');

        payload.user_name = encodeURIComponent(payload.user_name);
      }
      if (payload.customer_name) {
        payload.customer_name = decodeURIComponentSafe(payload.customer_name);
        payload.customer_name = payload.customer_name.replaceAll('%', '(prc_sgn)');

        payload.customer_name = encodeURIComponent(payload.customer_name);
      }
      if (payload.brand_name) {
        payload.brand_name = decodeURIComponentSafe(payload.brand_name);
        payload.brand_name = payload.brand_name.replaceAll('%', '(prc_sgn)');

        payload.brand_name = encodeURIComponent(payload.brand_name);
      }

      navigation.dispatch({ destination: destination.split('?')[0], payload: payload });
    } else {
      if (Object.keys(allUrlParams).length > 0 && allUrlParams.constructor === Object && payload === null) {
        payload = allUrlParams;
      }

      navigation.dispatch({ destination: destination.split('?')[0], payload: payload, replace: replace });
    }
  };

  let login = info => {
    user.dispatch({ type: 'login', payload: info });
  };

  const logout = (clearData = false) => {
    setIsLoading(true);
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND]; //'http://35.197.224.120:5000';
    const PATH_CALL = '/user/logout';
    const url = `${PATH_BASE}${PATH_CALL}`;
    let headers = {
      'Access-Control-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: loginToken.current.auth_token
    };

    let payload = {};

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        if (responseData && responseData.status === 'SUCCESS') {
          let mfa_ticket = loginToken.current.mfa_ticket;
          let email = loginToken.current.user_data.email;
          setIsLoading(false);
          if (clearData) {
            window.sessionStorage.clear();
            window.localStorage.clear();
          } else {
            loginToken.current = {
              mfa_ticket: mfa_ticket,
              email: email
            };
          }
          user.dispatch({ type: 'logout' });
          navigateTo('reset');

          return responseData;
        } else if (responseData && responseData.status === 'ERROR') {
          setIsLoading(false);
          setNotification({ state: true, message: responseData.message });
        }
      })
      .catch(error => {
        console.log('<< App >> : < logout > : error : ', error);
        setIsLoading(false);
      });
  };

  const ResetPassword = lazy(() => import('../../content/ResetPassword'));

  const urlParams = getAllUrlParams();
  useEffect(() => {
    // Here, add any necessary useEffect logic such as authorization checks, if required.
    // Example navigation based on user authorization status:
    if (user.state.authorized === false) {
      // Redirect to login if unauthorized
      window.location.pathname = '/login';
    }
  }, [user.state.authorized]);
  const navigateToLogin = () => {
    return <Navigate to="/login" replace />;
  };
  console.log('<< App >> : < render > : user.state.authorized : ', user.state.authorized);
  return (
    <Suspense fallback={<Black />}>
      <ThemeProvider theme={Themes[theme]}>
        <Container isAuthorized={user.state.authorized}>
          <GlobalStyles />
          <Router history={history}>
            <Fragment>
              {user.state.authorized && !history.location.pathname.startsWith('/authentication_timeout') && (
                <Title>
                  <NavigationBar navigation={navigation.state.navigation_bar} navigateTo={navigateTo} />
                </Title>
              )}
              {user.state.authorized && !history.location.pathname.startsWith('/authentication_timeout') && (
                <StyledMenu display={menuDisplay.toString()}>
                  <Menu
                    navigation={navigation.state.navigation_bar}
                    navigateTo={navigateTo}
                    logout={logout}
                    user={user.state}
                  />
                </StyledMenu>
              )}
              {user.state.authorized && !history.location.pathname.startsWith('/authentication_timeout') && (
                <Logo>
                  <Hamburger
                    onClick={() => {
                      setMenuDisplay(!menuDisplay);
                    }}
                  />
                  <SnatchLogo />
                </Logo>
              )}
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      route.noAuth || user.state.authorized ? (
                          route.element
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                ))}

                {/* Redirect to login if unauthorized */}
                {!user.state.authorized && (
                  <Route path="*" element={<Navigate to="/login" replace />} />
                )}
                </Routes>
                </Suspense>

            </Fragment>
          </Router>
          {user.state.authorized && !history.location.pathname.startsWith('/authentication_timeout') /* && <VersionInfo version={config.VERSION} /> */}
          
        </Container>
      </ThemeProvider>
    </Suspense>
  );
};
export default App;

const GlobalStyles = createGlobalStyle`

body{
--colorPrimary: ${props => (props.theme ? props.theme.primaryColor : '#ffcb27')};
--colorSecondary: ${props => (props.theme ? props.theme.secondaryColor : '#ffcb27')};
--buttonPrimaryColor: ${props => (props.theme ? props.theme.secondaryColor : '#6CCBD4')};
--buttonHoverColor: ${props => (props.theme ? props.theme.primaryColor : '#6CCBD4')};
--versionInfoColor:#282832;
--panelShadow: 0px 28px 54px rgba(0, 0, 0, 0.35);
--panelRadius: 10px;
--fMontserrat:'Montserrat', sans-serif;
--inputPrimaryBorder:#ECF0F6;
--inputPrimaryColor:#7687A3;
--textPrimaryColor:#282832;
--inputFocusedColor:#6CCBD4;
--buttonFontColor:#FFFFFF;
--errorColor: #FF5050;
--bgBarsColor:#F8F8F9;
--primaryBackground:#FFFFFF;
--thinBorderColor:#EFF1F2;
--borderRowColor:#F1F2F3;
--borderSecondaryColor:#707070;
--mainDibsColor:#83E2BC;
--secondaryDibsColor:#6CCBD4;
--inputLineHeight:2.7rem;
}
`;

const Hamburger = styled.img.attrs(props => ({ src: menu }))`
  display: none;
  cursor: pointer;
  width: 2rem;
  @media (max-width: 800px) {
    display: block;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 7rem 7rem 1fr;
  grid-template-rows: 3.8rem 1fr;
  background-color: #000000;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: ${props => (props.isAuthorized ? `3.8rem 4.5rem 1fr` : `3.8rem 1fr`)};
  }
`;

const Logo = styled.div`
  width: 100%;
  background-color: var(--colorPrimary);
  position: static;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: span 1;
  padding: 0 15px 0 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: span 1;
    grid-row-start: 1;
    grid-row-end: span 1;
    justify-content: space-between;
  }
`;

const Title = styled.div`
  width: 100%;
  background-color: #373737;

  grid-column-start: 3;
  grid-column-end: span 1;
  grid-row-start: 1;
  grid-row-end: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: span 1;
    grid-row-start: 2;
    grid-row-end: span 1;
  }
`;

const StyledMenu = styled.div`
  width: 100%;
  background-color: #0c0c0c;
  min-height: 500px;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 800px) {
    display: block;
    position: absolute;
    top: 3.8rem;
    z-index: 1;
    min-height: unset;
    height: auto;
    transform-origin: top;
    transform: ${props => (props.display == 'true' ? 'scaleY(1)' : 'scaleY(0)')};
    transition: ${props => (props.display == 'true' ? 'all 0.26s ease-in-out' : 'unset')};
  }
`;

const Content = styled.div`
  width: 100%;
  background-color: #dedede;
  height: 100%;
  min-height: calc(100vh - 3.8rem);
  grid-column-start: 3;
  grid-column-end: span 1;
  grid-row-start: 2;
  grid-row-end: span 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 800px) {
    min-height: calc(100vh - 8.3rem);
    grid-column-start: 1;
    grid-column-end: span 1;
    grid-row-start: 3;
    grid-row-end: span 1;
    padding-left: 0;
    padding-right: 0;
  }
`;

const fadein = keyframes`
 0% {
    display: none;
    opacity: 0;
  }
 
  100% {
    opacity: 1;
   
  }
`;
const fadeout = keyframes`
   0%   {opacity: 1;}
    100% {
    opacity: 0;
    pointer-events: none;
    display: none;
    }
`;
const Fade = styled.div`
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 1;
  animation-play-state: initial;
  animation: ${fadeout} 1s ease-in-out forwards;
  animation-fill-mode: forwards;
  z-index: 100;
`;
const FadeFragment = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  min-height: calc(100vh - 3.8rem);
  background-color: #dedede;
  opacity: 1;
  animation-play-state: initial;
  animation: ${fadeout} 1s ease-in-out forwards;
  animation-fill-mode: forwards;
  z-index: 100;
  grid-column-start: 3;
  grid-column-end: span 1;
  grid-row-start: 2;
  grid-row-end: span 1;
  @media (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: span 1;
    grid-row-start: 3;
    grid-row-end: span 1;
    min-height: calc(100vh - 8.3rem);
  }
`;
const Black = styled.div`
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
`;
const BlackFragment = styled.div`
  pointer-events: none;
  width: 100%;
  min-height: calc(100vh - 3.8rem);
  background-color: #dedede;
  grid-column-start: 3;
  grid-column-end: span 1;
  grid-row-start: 2;
  grid-row-end: span 1;

  @media (max-width: 800px) {
    min-height: calc(100vh - 8.3rem);
  }
`;
