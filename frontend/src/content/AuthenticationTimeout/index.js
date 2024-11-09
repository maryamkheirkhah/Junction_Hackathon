import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button, { ButtonModern } from '../../components/Button';
import loginToken from '../../utils/loginToken';
import { AppContext } from '../../contexts/AppContext';
import AuthenticationUI from '../../components/AuthenticationUI';
import { ButtonThemes } from '../../utils/themes';

const AuthenticationTimeout = props => {
  let { user, navigation } = React.useContext(AppContext);

  useEffect(() => {
    if (!loginToken.current) return;
    let mfa_ticket = loginToken.current.mfa_ticket;
    let email = loginToken.current.user_data ? loginToken.current.user_data.email : loginToken.current.email;

    loginToken.current = {
      mfa_ticket: mfa_ticket,
      email: email
    };
  }, []);
  return (
    <AuthenticationUI>
        <SendPanel>
          <Paragraph>Session expired, please log in again.</Paragraph>
          <SendButtonContainer>
            <ButtonModern
              onClickHandler={() => user.dispatch({ type: 'logout' })}
              text={'Go to login'}
              borderRadius={23}
              btnWidth={14}
              theme={'primary'}
              customThemes={ButtonThemes}
            />
          </SendButtonContainer>
        </SendPanel>
    </AuthenticationUI>
  );
};

export default AuthenticationTimeout;

const SendPanel = styled.div`
margin-top:3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;


const Paragraph = styled.p`
  font-size: 0.875rem;
  text-align: center;
  margin: 0.5rem 0rem;
  margin-bottom:2rem;
`;

const SendButtonContainer = styled.div`

margin:0 auto;
`;
