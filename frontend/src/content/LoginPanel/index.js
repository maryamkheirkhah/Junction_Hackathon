import React, { useState, useReducer, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import AuthenticationUI from '../../components/AuthenticationUI';
import warn from '../../assets/images/warn.svg';
import { ButtonModern } from '../../components/Button';
import ForgotPassword from './ForgotPassword';
import loginToken from '../../utils/loginToken';
import login_icon from '../../assets/images/login_icon.svg';
import password_icon from '../../assets/images/password_icon.svg';
import config from '../../utils/config';
import { FormThemes, ButtonThemes } from '../../utils/themes';
import TextFieldModernUI from '../../components/TextfieldModernUI';
import NotificationBanner from '../../components/NotificationBanner';
import PasswordVerification from './PasswordVerification';

const initialErrorState = {
  username: false,
  password: false
};

const errorReducer = (state, action) => {
  switch (action.type) {
    case 'username':
      return { ...state, username: action.payload };
    case 'password':
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

const LoginPanel = props => {
  const [values, setValues] = useState({ username: '', password: '' });
  const [warningType, setWarning] = useState('');
  const [isForgottenView, setIsForgottenView] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSend, setIsResetSend] = useState(false);
  const [notification, setNotification] = useState({ state: false, message: '' });
  const [isValidationError, setIsValidationError] = useState(false); // for Notification Bar
  const [isInvalidUser, setIsInvalidUser] = useState(false);

  const errorConfig = {
    username: { target: values.username, type: 'bool' },
    password: { target: values.password, type: 'bool' }
  };

  const [errorState, errorDispatch] = useReducer(errorReducer, initialErrorState);

  useEffect(() => {
    setIsValidationError(false);
  }, [isForgottenView, validatePassword, verificationCode]);

  useEffect(() => {
    setNotification({ state: false, message: '' });
    for (let k in errorConfig) {
      if (errorState[k] && errorConfig[k].target) {
        errorDispatch({ type: k, payload: false });
      }
    }
    if (!Object.values(errorState).some(x => x)) {
      setIsValidationError(false);
    }
  }, [values, errorState]);

  const onChange = (name, value) => {
    setValues({ ...values, [name]: value });
    setWarning(false);
    setIsInvalidUser(false);
  };

  const emailOrUsernameValidation = value => {
    // Checks if the value is a valid email or non-empty username
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(value) || value.trim().length > 0;
  };

  const login = () => {
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND];
    const PATH_CALL = '/user/login';
    const url = `${PATH_BASE}${PATH_CALL}`;

    let headers = {
      'Access-Control-Origin': '*'
    };

    let payload = {
      usernameOrEmail: values.username, // accommodate username or email
      password: values.password
    };

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status === 'SUCCESS') {
          // handle success scenario
          props.login({
            first_name: responseData.data.user_data.first_name,
            last_name: responseData.data.user_data.last_name,
            phone: responseData.data.user_data.phone,
            email: responseData.data.user_data.email,
            auth_token: responseData.data.auth_token,
            access_level: responseData.data.user_data.access_level,
            access_level_name: responseData.data.user_data.access_level_name,
            organisation_id: responseData.data.user_data.organisation_id,
            organisation_name: responseData.data.user_data.organisation_name,
            mfa_method: responseData.data.mfa_method,
            notifications: responseData.data.notifications
          });
        } else {
          setNotification({ state: true, message: responseData.message || 'Login failed' });
          setWarning('INVALID');
        }
      })
      .catch(error => {
        setNotification({ state: true, message: error.message || 'Error occurred' });
      });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    if (!emailOrUsernameValidation(values.username)) {
      setIsInvalidUser(true);
      return;
    }
    login();
  };

  return (
    <AuthenticationUI>
      <Fragment>
        <NotificationBanner
          visible={isValidationError || notification.state}
          text={notification.state ? notification.message : 'Please fill all mandatory fields'}
        />

        <LoginForm onSubmit={onSubmitHandler}>
          <TextFieldModernUI
            id={'usernameOrEmail'}
            labelName={'Username or Email'}
            value={values.username}
            icon={login_icon}
            name={'username'}
            onChange={onChange}
            borderRadius={'6px'}
            hideCounter
            customThemes={FormThemes}
            error={isInvalidUser}
            errMsg={isInvalidUser ? 'Please enter a valid username or email' : ''}
          />
          <TextFieldModernUI
            id={'password'}
            labelName={'Password'}
            value={values.password}
            icon={password_icon}
            name={'password'}
            onChange={onChange}
            type={'password'}
            borderRadius={'6px'}
            hideCounter
            customThemes={FormThemes}
            error={errorState.password}
            errMsg={'Please fill password field'}
          />
          <ButtonPanel>
            <ButtonModern
              type={'submit'}
              text={'Log in'}
              borderRadius={23}
              theme={'primary'}
              disable={isLoading}
              customThemes={ButtonThemes}
            />
            <ForgotButton onClick={() => setIsForgottenView(true)}>{"Can't log in?"}</ForgotButton>
          </ButtonPanel>
        </LoginForm>
      </Fragment>
    </AuthenticationUI>
  );
};

export default LoginPanel;

const WarningIcon = styled.img`
  height: 0.78rem;
  align-self: center;
  margin-right: 0.5rem;
`;

const WarningText = styled.div`
  position: absolute;
  top: 2.3rem;
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;
  p {
    font-weight: 300;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
    color: var(--errorColor);
  }
`;

const ButtonPanel = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
`;

const HiddenInput = styled.div`
  position: absolute;
  height: 0px;
  overflow: hidden;
`;

const ForgotButton = styled.div`
  font-weight: 300;
  line-height: 16px;
  text-align: center;
  color: var(--inputPrimaryColor);
  font-size: 0.875rem;
  align-self: center;
  justify-self: end;
  margin-right: 1rem;
  cursor: pointer;
`;

const LoginForm = styled.form`
  width: 350px;
  position: relative;
  align-self: center;
  padding-top: 4.5rem;
  > * {
    margin-bottom: 1.7rem;
  }
  @media (max-width: 700px) {
    width: 90%;
  }
`;
