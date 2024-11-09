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
  }
};

const LoginPanel = props => {
  const [values, setValues] = useState({ username: '', password: '' });
  const [warningType, setWarning] = useState('');
  const [isForgottenView, setIsForgottenView] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [isRegisterUser, setIsRegisterUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSend, setIsResetSend] = useState(false);
  const [notification, setNotification] = useState({ state: false, message: '' });
  const [isValidationError, setIsValidationError] = useState(false); //for Notification Bar
  const [isEmailError, setIsEmailError] = useState(false);
  const [isInvalidUser, setIsInvalidUser] = useState(false);
  const errorConfig = {
    username: { target: values.username, type: 'bool' },
    password: { target: values.password, type: 'bool' }
  };
  console.log('errorConfig', errorConfig);
  let [errorState, errorDispatch] = useReducer(errorReducer, initialErrorState);

  useEffect(() => {
    setIsValidationError(false);
    //setNotification({ state: false, message: '' });
  }, [isForgottenView, isRegisterUser, verificationCode]);

  useEffect(() => {
    setNotification({ state: false, message: '' });
    for (let k in errorConfig) {
      if (errorState[k]) {
        if (errorConfig[k].type === 'bool') {
          if (errorConfig[k].target) {
            errorDispatch({ type: k, payload: false });
          }
        }
      }
    }
    if (!Object.values(errorState).some(x => x)) {
      setIsValidationError(false);
    }
  }, [values, errorState]);

  useEffect(() => {
    if (!validatePassword) {
      setVerificationError(false);
      setVerificationCode('');
    } else {
      setVerificationError(false);
    }
  }, [validatePassword]);

  const beforeSendCheck = () => {
    let sendData = true;
    for (let k in errorConfig) {
      if (errorConfig[k].type === 'bool') {
        if (!errorConfig[k].target) {
          errorDispatch({ type: k, payload: true });
          sendData = false;
        }
      }
    }
    //  console.log('sendData', sendData);
    if (!sendData) {
      return false;
    } else {
      return true;
    }
  };

  const onChange = (name, value) => {
    setValues({ ...values, [name]: value });
    if (name === 'username') setIsEmailError(false);
    setWarning(false);
    setIsInvalidUser(false);
  };

  const login = () => {
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND]; //'http://35.197.224.120:5000';
    console.log('PATH_BASE', PATH_BASE);
    const PATH_CALL = '/user/login';
    const url = `${PATH_BASE}${PATH_CALL}`;
    console.log('url', url);
    console.log('values', values);
    let headers = {
      'Access-Control-Origin': '*'
    };

    let payload = {
      email: values.username,
      password: values.password
    };

    if (loginToken.current && loginToken.current.mfa_ticket && loginToken.current.email === values.username) {
      payload.mfa_ticket = loginToken.current.mfa_ticket;
    }
    if (validatePassword) {
      payload.mfa_code = verificationCode;
    }
    //let setToken = this.setToken;

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => {
        console.log('response', response);
        return response.json();
      })
      .then(responseData => {
        if (responseData) {
          if (responseData.status === 'SUCCESS' && !responseData.data.auth_token && payload.mfa_code) {
            setIsLoading(false);
            setNotification({ state: true, message: responseData.message });
            setWarning('INVALID');
            return;
          }
          if (responseData.status === 'ERROR') {
            setIsLoading(false);
            setValidatePassword(false);
            if (responseData.message === 'Invalid user credentials') {
              setIsInvalidUser(true);
            } else {
              setNotification({ state: true, message: responseData.message });
              setWarning('INVALID');
            }
            //window.sessionStorage.clear(); //temporary fix for mfa ticket problems
            //window.localStorage.clear();
            return;
          }
          if (responseData.mfa_passed) {
            window.sessionStorage.clear();
            window.localStorage.clear();
          }
          const object = {
            auth_token: responseData.data.auth_token,
            user_data: responseData.data.user_data,
            mfa_method: responseData.data.mfa_method,
            mfa_passed: responseData.data.mfa_passed,
            mfa_ticket: responseData.data.mfa_ticket,
            timestamp: new Date().getTime()
          };

          loginToken.current = object;
          setNotification({ state: false, message: '' });
          if (!loginToken.current.mfa_ticket) {
            setValidatePassword(true);
            setIsLoading(false);
          } else {
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
          }
          return responseData;
        } else {
          setIsLoading(false);
          setValidatePassword(false); 
          setNotification({ state: true, message: responseData.message });
          setWarning('INVALID');
        }
      })
      .catch(error => {
        setIsLoading(false);
        setValidatePassword(false);
        setWarning('INVALID');
        setNotification({ state: true, message: error.message });
        console.error(error);
      });
  };

/*   const login = () => {
    setIsLoading(true);
  
    // Mocking backend response with a timeout
    setTimeout(() => {
      setIsLoading(false);
      if (values.username === "test@example.com" && values.password === "password") {
        // Mock successful login response
        const mockResponse = {
          auth_token: "mock_auth_token",
          user_data: {
            first_name: "Test",
            last_name: "User",
            email: values.username,
            organisation_id: "mock_org_id",
            organisation_name: "Mock Organisation",
            access_level: 1,
            access_level_name: "Admin",
            phone: "1234567890",
            notifications: { email: true, sms: true },
            mfa_method: { email: false, sms: false },
          },
        };
  
        loginToken.current = mockResponse;
        setNotification({ state: false, message: "" });
        props.login({
          first_name: mockResponse.user_data.first_name,
          last_name: mockResponse.user_data.last_name,
          phone: mockResponse.user_data.phone,
          email: mockResponse.user_data.email,
          auth_token: mockResponse.auth_token,
          access_level: mockResponse.user_data.access_level,
          access_level_name: mockResponse.user_data.access_level_name,
          organisation_id: mockResponse.user_data.organisation_id,
          organisation_name: mockResponse.user_data.organisation_name,
          mfa_method: mockResponse.user_data.mfa_method,
          notifications: mockResponse.user_data.notifications
        });
      } else {
        // Mock failed login
        setNotification({ state: true, message: "Invalid Username or Password" });
        setWarning("INVALID");
      }
    }, 1000); // Simulate network delay of 1 second
  }; */
  
  const resetPassword = email => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    setIsLoading(true);
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND]; //'http://35.197.224.120:5000';

    const PATH_CALL = '/user/prepare_credentials_reset';
    const url = `${PATH_BASE}${PATH_CALL}`;

    let headers = {
      'Access-Control-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    let payload = {
      email: email
    };

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data && data.status == 'SUCCESS') {
          setIsLoading(false);
          setIsResetSend(true);
          return data;
        } else if (data && data.status === 'ERROR') {
          setIsLoading(false);
          setIsResetSend(false);
          setNotification({ state: true, message: data.message });
        }
      })
      .catch(error => {
        setIsLoading(false);
        setIsResetSend(false);
        setNotification({ state: true, message: error.message });
        console.error(error);
      });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    let stopSend = false;
    if (!beforeSendCheck()) {
      setIsValidationError(true);
      stopSend = true;
    }
    if (!emailValidation(values.username)) {
      setIsEmailError(true);
      stopSend = true;
    }
    if (stopSend) {
      return;
    } else {
      setIsLoading(true);
      login();
    }
  };

  const handleVerifyCode = (name, value) => {
    if (value) setVerificationError(false);
    setVerificationCode(value);
  };

  const handleVerifiedLogin = () => {
    //request login with username, passsword and MFA_code
    if (!verificationCode) {
      setVerificationError(true);
      return;
    }

    setIsLoading(true);
    login();
  };

  const emailValidation = email => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const backToLogin = () => {
    setIsForgottenView(false);
    setWarning('');
    setIsResetSend(false);
    setValues({ username: '', password: '' });
  };

  let warning = null;
  if (warningType === 'EMPTY') warning = 'Please fill both the Username and Password fields';
  if (warningType === 'INVALID') warning = 'Invalid Username or Password';
  if (isForgottenView) {
    return (
      <AuthenticationUI>
        <NotificationBanner
          visible={isValidationError || notification.state}
          text={notification.state ? notification.message : 'Please fill all mandatory fields'}
        />
        <ForgotPassword
          navigateToLogin={backToLogin}
          resetPassword={resetPassword}
          isSend={isResetSend}
          isSendError={notification}
          isLoading={isLoading}
        />
      </AuthenticationUI>
    );
  } else {
    return (
      <AuthenticationUI>
        <Fragment>
          <NotificationBanner
            visible={isValidationError || notification.state}
            text={notification.state ? notification.message : 'Please fill all mandatory fields'}
          />

          {validatePassword && (
            <PasswordVerification
              onVerifyChange={handleVerifyCode}
              verifiedLoginHandler={handleVerifiedLogin}
              verificationError={verificationError}
              isLoading={isLoading}
              verificationCode={verificationCode}
              isSendError={notification}
              handleClose={setValidatePassword}
            />
          )}

          <LoginForm onSubmit={onSubmitHandler}>
            {validatePassword && (
              <HiddenInput>
                <input autoComplete={'new-password'} type="new-password" name="fake_safari_username" />
                <input autoComplete={'new-password'} type="password" name="fake_safari_password" />
              </HiddenInput>
            )}
            {isInvalidUser && (
              <WarningText>
                <WarningIcon src={warn} />
                <p>Wrong email address or password</p>
              </WarningText>
            )}
            <TextFieldModernUI
              id={'emailAddress'}
              labelName={'Email Address'}
              value={values.username}
              icon={login_icon}
              name={'username'}
              onChange={onChange}
              borderRadius={'6px'}
              hideCounter
              customThemes={FormThemes}
              error={errorState.username || isEmailError || isInvalidUser}
              errMsg={
                isEmailError ? 'Please enter correct email address' : isInvalidUser ? '' : 'Please fill email field'
              }
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
              error={errorState.password || isInvalidUser}
              errMsg={isInvalidUser ? '' : 'Please fill password field'}
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
  }
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
