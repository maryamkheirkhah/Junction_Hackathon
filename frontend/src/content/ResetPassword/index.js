import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthenticationUI from '../../components/AuthenticationUI';
import config from '../../utils/config';
import ButtonModern from '../../components/Button';
import ChangePassword from '../../components/ChangePassword';
import { ButtonThemes } from '../../utils/themes';
import NotificationBanner from '../../components/NotificationBanner';

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [secret, setSecret] = useState('');
  const [isCheckingSecret, setIsCheckingSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isSendError, setIsSendError] = useState({ state: false, message: '' });
  const [isSend, setIsSend] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkSecret = useCallback(
    (code) => {
      if (!code) return;
      if (isSend) return;
      const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND];
      const PATH_CALL = '/user/check_secret';
      const url = `${PATH_BASE}${PATH_CALL}`;

      let headers = {
        'Access-Control-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      let payload = {
        secret: code,
      };

      return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsCheckingSecret(false);
          if (data && data.status === 'SUCCESS') {
            setUserData(data.data);
            setIsCodeValid(true);
            return true;
          } else {
            setIsCodeValid(false);
            return false;
          }
        })
        .catch((error) => {
          setIsCheckingSecret(false);
          setIsCodeValid(false);
          console.error(error);
        });
    },
    [isSend]
  );

  useEffect(() => {
    if (isSend) return;
    let phrase = location.search;
    if (!phrase) return;
    let codeMatch = phrase.match(/\?code=(.*)/);
    if (!codeMatch) return;
    let code = codeMatch[1];

    if (phrase.startsWith('?code=')) {
      setSecret(code);
      setIsCheckingSecret(true);
      checkSecret(code);
    } else {
      setIsCheckingSecret(false);
    }
  }, [isSend, location.search, checkSecret]);

  const savePasswordRequest = (data) => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    setIsLoading(true);
    const PATH_BASE = config.AUTH_SERVICE_URL[process.env.REACT_APP_BACKEND];
    const PATH_CALL = props.requestUrl;
    const url = `${PATH_BASE}${PATH_CALL}`;

    let headers = {
      'Access-Control-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    let payload = {
      secret: secret,
    };

    if (props.viewType === 'register') {
      payload.mfa = data.mfa_method;
      payload.password = data.new_password;
      payload.organisation_id = userData.organisation_id;
      if (data.phone) payload.phone = data.phone;
    } else {
      payload.new_password = data.new_password;
    }

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.status === 'SUCCESS') {
          setIsSend(true);
          setIsLoading(false);
          return data;
        } else if (data && data.status === 'ERROR') {
          setIsLoading(false);
          setIsSend(false);
          setIsSendError({ state: true, message: data.message });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsSend(false);
        setIsSendError({ state: true, message: error.message });
        console.error(error);
      });
  };

  const handleSaveNewPassword = (data) => {
    checkSecret(secret).then((result) => {
      if (result) {
        savePasswordRequest(data);
      }
    });
  };

  const handleReset = () => {
    navigate('/login');
  };

  if (isSend) {
    return (
      <AuthenticationUI>
        <SendPanel>
          <Paragraph>
            {props.viewType === 'register' ? `Registration completed` : `Your password has been changed.`}
          </Paragraph>
          <SendButtonContainer>
            <ButtonModern
              text={'Go back to login'}
              borderRadius={23}
              theme={'primary'}
              btnWidth={13.75}
              onClickHandler={handleReset}
              customThemes={ButtonThemes}
            />
          </SendButtonContainer>
        </SendPanel>
      </AuthenticationUI>
    );
  }

  if ((isCheckingSecret && !isSend) || isLoading) {
    return <AuthenticationUI></AuthenticationUI>;
  }

  if (!isCodeValid && !isSend) {
    return (
      <AuthenticationUI>
        <SendPanel>
          <Paragraph>Link has expired</Paragraph>
          <SendButtonContainer>
            <ButtonModern
              text={'Go back to login'}
              borderRadius={23}
              theme={'primary'}
              btnWidth={13.75}
              onClickHandler={handleReset}
              customThemes={ButtonThemes}
            />
          </SendButtonContainer>
        </SendPanel>
      </AuthenticationUI>
    );
  }

  return (
    <AuthenticationUI>
      {props.viewType !== 'register' && <Header>Change Password</Header>}
      <NotificationBanner
        visible={isSendError.state}
        text={isSendError.state ? isSendError.message : 'Please fill all mandatory fields'}
      />
      <ChangePassword handleSaveNewPassword={handleSaveNewPassword} userData={userData} viewType={props.viewType} />
    </AuthenticationUI>
  );
};

export default ResetPassword;

const SendPanel = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Paragraph = styled.p`
  font-size: 0.875rem;
  text-align: center;
  font-weight: 300;
  color: var(--textPrimaryColor);
`;

const SendButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

const Header = styled.h1`
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1.25rem;
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1.7rem;
  color: var(--textPrimaryColor);
`;
