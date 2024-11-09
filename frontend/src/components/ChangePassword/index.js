import React, { useState, Fragment, useEffect, useReducer, useMemo } from 'react';
import styled from 'styled-components';
import check from '../../assets/images/check.svg';
import TextFieldModernUI from '../TextfieldModernUI';
import NotificationBanner from '../NotificationBanner';
import { ButtonThemes, FormThemes } from '../../utils/themes';
import { ButtonModern } from '../Button';
import PhoneInputComponent from '../PhoneInputComponent';
import SelectionPanel from '../SelectionPanel';

const initialErrorState = {
  password1: false,
  password2: false,
};

const errorReducer = (state, action) => {
  switch (action.type) {
    case 'password1':
      return { ...state, password1: action.payload };
    case 'password2':
      return { ...state, password2: action.payload };
    default:
      return state;
  }
};

const ChangePassword = (props) => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [nextView, setNextView] = useState(false);
  const [verificationMethods, setVerificationMethods] = useState([
    { id: 'email_mfa', label: 'Email', checked: true },
    { id: 'sms_mfa', label: 'SMS', checked: false },
  ]);
  const [isValidationError, setIsValidationError] = useState(false); // for Notification Bar
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isSendError, setIsSendError] = useState({ state: false, message: '' });
  const [phone, setPhone] = useState('');
  const [disableSms, setDisableSms] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [phoneValidError, setPhoneValidError] = useState(false);
  const [checkList, setCheckList] = useState({
    one_number: false,
    one_special_character: false,
    one_capital_letter: false,
    characters_12: false,
  });

  const errorConfig = useMemo(
    () => ({
      password1: { target: password1, type: 'bool' },
      password2: { target: password2, type: 'bool' },
    }),
    [password1, password2]
  );

  const [errorState, errorDispatch] = useReducer(errorReducer, initialErrorState);

  useEffect(() => {
    for (let k in errorConfig) {
      if (errorState[k]) {
        if (errorConfig[k].type === 'bool') {
          if (errorConfig[k].target) {
            errorDispatch({ type: k, payload: false });
          }
        }
      }
    }
    if (!Object.values(errorState).some((x) => x)) {
      setIsValidationError(false);
    }
  }, [password1, password2, errorState, errorConfig]);

  useEffect(() => {
    setIsSendError({ state: false, message: '' });
    setIsPasswordError(false);
  }, [password1, password2]);

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
    return sendData;
  };

  const handleSetPass1 = (name, value) => {
    setPassword1(value);
  };

  const handleSetPass2 = (name, value) => {
    setPassword2(value);
  };

  useEffect(() => {
    let one_number_pattern = /\d/;
    let one_number_test = one_number_pattern.test(password1);
    let one_special_character_pattern = /[!@#$%^&*(),.?":{}|<>]/;
    let one_special_character_test = one_special_character_pattern.test(password1);
    let one_capital_letter_pattern = /[A-Z]/;
    let one_capital_letter_test = one_capital_letter_pattern.test(password1);
    let characters_12_pattern = /.{12,}/;
    let characters_12_test = characters_12_pattern.test(password1);
    setCheckList({
      one_number: one_number_test,
      one_special_character: one_special_character_test,
      one_capital_letter: one_capital_letter_test,
      characters_12: characters_12_test,
    });
  }, [password1]);

  const validPassword = () => {
    if (password1 === '' || password2 === '') {
      return false;
    }
    if (password1 === password2) {
      if (!Object.values(checkList).some((x) => !x)) {
        return true;
      } else {
        setIsPasswordError(true);
        setIsSendError({ state: true, message: 'Password does not match security criteria' });
        return false;
      }
    } else {
      setIsPasswordError(true);
      setIsSendError({
        state: true,
        message: 'Passwords do not match, please ensure you enter the same password into both fields',
      });
      return false;
    }
  };

  useEffect(() => {
    if (phone) {
      setVerificationMethods((prevMethods) => {
        let newVer = [...prevMethods];
        newVer.find((i) => i.id === 'sms_mfa').checked = true;
        newVer.find((i) => i.id === 'email_mfa').checked = false;
        return newVer;
      });
    }
    if (isPhoneValid) setPhoneValidError(false);
  }, [phone, isPhoneValid]);

  const handleSave = (e) => {
    if (!beforeSendCheck()) {
      setIsValidationError(true);
      return;
    }
    if (props.viewType === 'register') {
      if (!disableSms && ((phone && !isPhoneValid) || phone === '')) {
        setPhoneValidError(true);
        return;
      }
    }
    let result = validPassword();

    if (!result) {
      return;
    }

    let data = {
      new_password: password1,
    };

    if (props.viewType === 'register') {
      let mfa_method;
      if (verificationMethods.find((x) => x.id === 'email_mfa').checked) mfa_method = 'email';
      if (verificationMethods.find((x) => x.id === 'sms_mfa').checked) mfa_method = 'sms';
      data.mfa_method = mfa_method;
      if (phone) data.phone = phone;
    }

    props.handleSaveNewPassword(data);
  };

  const handleSetPhone = (value, data, event, formattedValue) => {
    if (value === '') {
      setPhone('');
      setIsPhoneValid(true);
    } else {
      if (data && Object.keys(data).length > 0 && !value.startsWith(data.dialCode)) {
        setIsPhoneValid(false);
      } else if (!formattedValue.startsWith('+')) {
        setIsPhoneValid(false);
      } else {
        setIsPhoneValid(true);
      }
      setPhone(value);
    }
  };

  const handleGoToNextView = () => {
    if (!beforeSendCheck()) return;
    let result = validPassword();

    if (!result) {
      return;
    }
    setNextView(true);
  };

  useEffect(() => {
    if (disableSms) setPhone('');
  }, [disableSms]);

  const handleSelect = (id) => {
    let newVer = [...verificationMethods];
    if (id === 'email_mfa') {
      setIsPhoneValid(true);
    }
    newVer.forEach((i) => {
      i.checked = i.id === id;
    });
    setDisableSms(id === 'sms_mfa' ? false : true);
    setVerificationMethods(newVer);
  };

  return (
    <Fragment>
      <NotificationBanner
        visible={isValidationError || isSendError.state}
        text={isSendError.state ? isSendError.message : 'Please fill all mandatory fields'}
      />
      {props.viewType !== 'reset' && (
        <Header>{!nextView ? 'Registration' : 'Set your 2FA method'}</Header>
      )}
      <LoginForm autoComplete={'nope'}>
        {!nextView && (
          <Fragment>
            <HiddenInput>
              <input autoComplete={'new-password'} value={'xyz'} type="password" name="fakepasswordremembered" />
              <input autoComplete={'new-password'} type="new-password" name="fake_safari_username" />
              <input autoComplete={'new-password'} type="password" name="fake_safari_password" />
            </HiddenInput>
            <TextFieldModernUI
              id={'setPass1'}
              labelName={'Create password'}
              type={'password'}
              name={'setPass1'}
              value={password1}
              onChange={handleSetPass1}
              borderRadius={'6px'}
              hideCounter
              autoComplete={'new-password'}
              customThemes={FormThemes}
              error={isPasswordError || errorState.password1}
              errMsg={isPasswordError ? '' : 'Please fill password field'}
            />
            <VerificationContainer>
              <SmallParagraph notValidated={isPasswordError} validated={checkList.one_number}>
                At least one number
              </SmallParagraph>
              <SmallParagraph notValidated={isPasswordError} validated={checkList.one_special_character}>
                At least one special character
              </SmallParagraph>
              <SmallParagraph notValidated={isPasswordError} validated={checkList.one_capital_letter}>
                At least one capital letter
              </SmallParagraph>
              <SmallParagraph notValidated={isPasswordError} validated={checkList.characters_12}>
                At least 12 characters
              </SmallParagraph>
            </VerificationContainer>
            <TextFieldModernUI
              id={'setPass2'}
              labelName={'Repeat password'}
              type={'password'}
              name={'setPass2'}
              value={password2}
              autoComplete={'new-password'}
              onChange={handleSetPass2}
              borderRadius={'6px'}
              hideCounter
              customThemes={FormThemes}
              error={isPasswordError || errorState.password2}
              errMsg={isPasswordError ? '' : 'Please fill password field'}
            />
          </Fragment>
        )}
        {props.viewType === 'register' && nextView && (
          <Fragment>
            <SelectionPanel items={verificationMethods} handleSelect={handleSelect} />
            <TextfieldContainer>
              {!disableSms && (
                <PhoneInputComponent
                  error={phoneValidError}
                  errMsg={phoneValidError ? 'Phone number is not valid' : 'Please fill this field'}
                  phone={phone}
                  handleChange={handleSetPhone}
                  customThemes={FormThemes}
                  labelName={'Phone'}
                />
              )}
            </TextfieldContainer>
          </Fragment>
        )}
        <ButtonContainer>
          {props.viewType === 'register' && !nextView ? (
            <ButtonModern
              onClickHandler={handleGoToNextView}
              text={'Next'}
              type={'button'}
              borderRadius={23}
              theme={'primary'}
              btnWidth={13.75}
              customThemes={ButtonThemes}
            />
          ) : (
            <ButtonModern
              onClickHandler={handleSave}
              text={props.viewType === 'register' ? 'Register' : 'Update'}
              type={'button'}
              borderRadius={23}
              theme={'primary'}
              btnWidth={13.75}
              customThemes={ButtonThemes}
            />
          )}
        </ButtonContainer>
      </LoginForm>
    </Fragment>
  );
};

export default ChangePassword;

const HiddenInput = styled.div`
  position: absolute;
  height: 0px;
  overflow: hidden;
`;
const Header = styled.h1`
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1.25rem;
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1.7rem;
  color: var(--textPrimaryColor);

  @media (max-height: 600px) {
    margin-top: 1rem;
  }
`;

const TextfieldContainer = styled.div`
  margin-top: 1.5rem;
`;

const VerificationContainer = styled.div`
  margin-bottom: 1rem;
  margin-top: 0.8rem;
`;

const SmallParagraph = styled.p`
  font-size: 0.75rem;
  color: ${(props) =>
    props.validated ? '#3FC380' : props.notValidated ? 'var(--errorColor)' : 'var(--inputPrimaryColor)'};
  position: relative;
  transition: all 0.2s ease;
  margin: 0.3rem 0rem 0rem 1rem;
  &:after {
    display: inline-block;
    content: '';
    margin-left: 0.3rem;

    background: ${(props) => props.validated && `transparent url(${check}) no-repeat`};
    width: 1rem;
    height: 1rem;
    background-size: contain;
    transition: background 0.2s ease;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  @media (max-height: 600px) {
    margin-top: 1rem;
  }
`;

const LoginForm = styled.form`
  position: relative;
  margin: 0 auto;
  color: #333333;
  width: 100%;
  @media (max-width: 400px) {
    width: 230px;
  }
`;
