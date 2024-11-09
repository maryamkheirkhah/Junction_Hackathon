// AppContext.js
import React, { useReducer, useEffect, useState } from 'react';
import { authClient, portalClient } from '../../utils/apiClient';
import getAllUrlParams from '../../utils/getAllUrlParams';

let initialUserState = {
  authorized: null,
  group: false,
  group_id: false,
  name: false,
  privileges: false,
};

let initialNavigationState = {
  current_path: '/', // e.g., "/brand/add"
  current_destination: '',
  navigation_bar: [],
  current_payload: {}
};

let initialClientState = {
  auth: authClient,
  portal: portalClient
};

const AppContext = React.createContext();

const clientReducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initialClientState;
    case 'login':
      return {
        ...state,
        authorized: true,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        group: action.payload.group,
        phone: action.payload.phone,
        mail: action.payload.mail,
        access_level: action.payload.access_level,
        organisation_id: action.payload.organisation_id,
        organisation_name: action.payload.organisation_name,
        auth_token: action.payload.auth_token,
        notifications: action.payload.notifications
      };
    default:
      return state;
  }
};

const userAuthReducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initialUserState;
    case 'login':
      return {
        ...state,
        authorized: true,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        group: action.payload.group,
        phone: action.payload.phone,
        mail: action.payload.mail,
        access_level: action.payload.access_level,
        organisation_id: action.payload.organisation_id,
        auth_token: action.payload.auth_token,
        organisation_name: action.payload.organisation_name,
        access_level_name: action.payload.access_level_name,
        mfa_method: action.payload.mfa_method
      };
    case 'logout':
      return {
        ...state,
        authorized: false,
        name: '',
        group: '',
        credentials: [],
        mfa_method: '',
        first_name: '',
        last_name: '',
        phone: '',
        auth_token: '',
        access_level: '',
        access_level_name: ''
      };
    case 'token':
      return { ...state, auth_token: action.payload.auth_token, credentials: action.payload.credentials };
    case 'organisation_name':
      return { ...state, organisation_name: action.payload };
    case 'user_profile':
      return {
        ...state,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        phone: action.payload.phone
      };
    case 'user_mfa':
      return {
        ...state,
        mfa_method: action.payload.mfa_method,
        phone: action.payload.phone
      };
    default:
      return state;
  }
};

const navigationReducer = (state, action) => {
  let allUrlParams = getAllUrlParams();

  if (action.replace) {
    return {
      ...state,
      replace: true
    };
  }
  if (action.block_navigation === true) {
    return {
      ...state,
      block_back: true
    };
  } else if (action.block_navigation === false) {
    return {
      ...state,
      block_back: false
    };
  }

  switch (action.destination) {
    case '/reset/':
      return initialNavigationState;
    case '/login/':
      return {
        current_path: '/login',
        navigation_bar: [],
        current_payload: {}
      };
    case '/authentication_timeout':
      return {
        ...state,
        authorized: false,
        current_path: '/authentication_timeout',
        current_destination: action.destination
      };
    case '/dashboards/':
      return {
        ...state,
        current_path: '/dashboards/',
        navigation_bar: [{ name: 'Dashboards', destination: '' }]
      };
    default:
      return {
        ...state
      };
  }
};

const AppContextProvider = (props) => {
  const [user_state, user_dispatch] = useReducer(userAuthReducer, initialUserState);
  const [navigation_state, navigation_dispatch] = useReducer(navigationReducer, initialNavigationState);
  const [client_state, client_dispatch] = useReducer(clientReducer, initialClientState);
  const [themeVersion, setThemeVersion] = useState('developmentTheme');

  useEffect(() => {
    if (process.env.REACT_APP_BACKEND === 'development') {
      setThemeVersion('developmentTheme');
    } else if (process.env.REACT_APP_BACKEND === 'staging') {
      setThemeVersion('stagingTheme');
    } else {
      setThemeVersion('mainTheme');
    }
  }, []);

  const value = {
    user: { state: user_state, dispatch: user_dispatch },
    navigation: { state: navigation_state, dispatch: navigation_dispatch },
    client: client_state,
    theme: themeVersion
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
