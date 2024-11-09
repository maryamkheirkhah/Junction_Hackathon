import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NotificationBanner from '../../../components/NotificationBanner';
import ButtonModern from '../../../components/Button';
import { FormThemes, ButtonThemes } from '../../../utils/themes';
import TextFieldModernUI from '../../../components/TextfieldModernUI';

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [isNotValid, setIsNotValid] = useState(false);
  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const onChange = (name, value) => {
    setEmail(value);
  };

  useEffect(() => {
    setIsEmptyEmail(false);
    setIsNotValid(false);
  }, [email]);

  const onSubmitHandler = e => {
    e.preventDefault();
    if (email === '') {
      setIsEmptyEmail(true);
      return;
    }

    if (emailValidation(email)) {
      props.resetPassword(email);
    } else {
      setIsNotValid(true);
    }
  };
  const emailValidation = email => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  if (props.isSend) {
    return (
      <SendContainer>
        <Paragraph>If the account exists an email will be sent with further instructions</Paragraph>
        <ButtonModern
          onClickHandler={props.navigateToLogin}
          text={'Go back to login'}
          borderRadius={23}
          btnWidth={14}
          theme={'primary'}
          customThemes={ButtonThemes}
        />
      </SendContainer>
    );
  } else {
    return (
      <Container>
        <NotificationBanner visible={props.isSendError.state} text={props.isSendError.message} />
        <ForgotPasswordForm onSubmit={onSubmitHandler}>
          <Header>Forgot your password?</Header>
          <SubHeader>Don't worry, we got you.</SubHeader>
          <Paragraph>Enter the email address associated with your account</Paragraph>
          <TextfieldContainer>
            <TextFieldModernUI
              id={'resetEmail'}
              labelName={'Email address'}
              value={email}
              name={'resetEmail'}
              onChange={onChange}
              borderRadius={'6px'}
              hideCounter
              customThemes={FormThemes}
              error={isEmptyEmail || isNotValid}
              errMsg={isNotValid ? 'Please enter correct email address' : 'Please fill an Email field'}
            />
          </TextfieldContainer>
          <ButtonContainer>
            <ButtonModern
              type={'submit'}
              text={'Send reset instructions'}
              borderRadius={23}
              btnWidth={14}
              disable={props.isLoading}
              theme={'primary'}
              customThemes={ButtonThemes}
            />
          </ButtonContainer>
          <Back onClick={props.navigateToLogin}>Go back to Login</Back>
        </ForgotPasswordForm>
      </Container>
    );
  }
};

export default ForgotPassword;

const TextfieldContainer = styled.div`
  width: 70%;
  margin: 0 auto;
  margin-top: 1.8rem;
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Paragraph = styled.p`
  font-size: 0.875rem;
  text-align: center;
  font-weight: 300;
  color: var(--textPrimaryColor);
`;

const SubHeader = styled.h2`
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
`;

const Header = styled.h1`
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1.25rem;
  text-align: center;
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  align-self: center;
  padding-top: 4rem;
  > * {
    margin-bottom: 1.7rem;
  }
  @media (max-height: 650px) {
    padding-top: 2rem;
  }
`;

const SendContainer = styled(Container)`
  margin-top: 3rem;
  width: 280px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 3rem;
  }
`;

const Back = styled.div`
  font-weight: 300;
  line-height: 16px;
  text-align: center;
  color: var(--inputPrimaryColor);
  font-size: 0.875rem;
  align-self: center;
  justify-self: center;
  margin-right: 1rem;
  cursor: pointer;
  margin-top: 4rem;

  @media (max-height: 650px) {
    margin-top: 1rem;
  }
`;

const ForgotPasswordForm = styled.form`
  color: var(--textPrimaryColor);
  
`;
