import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { ButtonModern } from '../../../components/Button';
import close_box from '../../../assets/images/close_box.svg';
import loginToken from '../../../utils/loginToken';
import { FormThemes, ButtonThemes } from '../../../utils/themes';
import TextFieldModernUI from '../../../components/TextfieldModernUI';
const PasswordVerification = props => {
  return (
    <VerifyForm>
      <Close src={close_box} onClick={() => props.handleClose(false)} />
      <CodeContainer>
        <PopupTitle>Two-factor verification</PopupTitle>
        <SubTitle>Your code has been sent to you via {loginToken.current.mfa_method}</SubTitle>
        <TextFieldModernUI
          id={'mfa_code'}
          labelName={'Enter your 2FA code here'}
          value={props.verificationCode}
          name={'username'}
          borderRadius={'6px'}
          hideCounter
          customThemes={FormThemes}
          onChange={props.onVerifyChange}
          error={props.verificationError}
          errMsg={'Please fill the 2FA code'}
        />
      </CodeContainer>
      <PopupBtn key={'enter_2fa'}>
        <ButtonModern
          key={'2fa_cancel'}
          text={'Cancel'}
          theme={'secondary'}
          customThemes={ButtonThemes}
          borderRadius={23}
          disable={props.isLoading}
          onClickHandler={() => props.handleClose(false)}
        />
        <ButtonModern
          key={'2fa_submit'}
          borderRadius={23}
          text={'Submit'}
          onClickHandler={props.verifiedLoginHandler}
          theme={'primary'}
          disable={props.isLoading}
          customThemes={ButtonThemes}
        />
      </PopupBtn>
    </VerifyForm>
  );
};

export default PasswordVerification;

const Close = styled.img`
  width: 10px;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;


const CodeContainer = styled.div`
  margin-bottom: 2rem;
`;

const SubTitle = styled.div`
  font-size: 0.875rem;
  text-align: left;
  font-weight: 300;
  margin-bottom: 1.5rem;
  margin-top: 0.8rem;
  color: var(--textPrimaryColor);
`;

const PopupTitle = styled.h1`
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1.25rem;
  text-align: left;
  margin: 0;
  color: var(--textPrimaryColor);
`;

const PopupBtn = styled.div`
  width: 90%;
  justify-self: right;
  display: grid;
  margin-left: auto;
  grid-template-columns: 48% 48%;
  grid-column-gap: 4%;
`;

const VerifyForm = styled.div`
  background: white;
  position: absolute;
  width: 480px;
  padding: 2.4rem;
  transform: translate(-50%, -50%);
  border-radius: var(--panelRadius);
  top: 50%;
  left: 50%;
  z-index: 1;
  box-shadow: var(--panelShadow);
`;
