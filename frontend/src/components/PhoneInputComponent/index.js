import React, { useState, useEffect } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { FormNotColorThemes } from '../../utils/themes';

const PhoneInputComponent = (props) => {
  const [isFilled, setIsFilled] = useState(false);
  const [themeMode, setThemeMode] = useState('notFilled');

  useEffect(() => {
    if (props.phone !== '') {
      setIsFilled(true);
      setThemeMode('isFilled');
    }
    if (!props.phone || props.phone === '') setThemeMode('notFilled');
  }, [props.phone, props.error]);

  const handleOnFocus = (e) => {
    setIsFilled(true);
  };

  const handleOnBlur = (e) => {
    if (props.phone === '' || !props.phone) {
      setThemeMode('notFilled');
      setIsFilled(false);
    }
  };

  const inputChangeHandler = (value, data, event, formattedValue) => {
    if (value !== '') setThemeMode('isFilled');
    props.handleChange(value, data, event, formattedValue);
  };

  return (
    <ThemeProvider theme={props.customThemes ? props.customThemes[themeMode] : FormNotColorThemes[themeMode]}>
      <PhoneContainer error={props.error} customThemes={props.customThemes}>
        {!props.hideLabel && (
          <Label up={isFilled} textareaMode={props.textareaMode} isIcon={props.icon} customThemes={props.customThemes}>
            {props.labelName}
          </Label>
        )}
        <PhoneInput
          placeholder={props.placeholder ? props.placeholder : ''}
          enableAreaCodes={true}
          country={'gb'}
          preferredCountries={['gb']}
          prefix={'+'}
          alwaysDefaultMask={true}
          value={props.phone ? props.phone : ''}
          onChange={inputChangeHandler}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          isValid={(inputNumber, country, countries) => {
            return countries.some((country) => {
              return inputNumber.startsWith(country.dialCode) || country.dialCode.startsWith(inputNumber);
            });
          }}
        />
        {props.error && <ErrorMsg>{props.errMsg}</ErrorMsg>}
      </PhoneContainer>
    </ThemeProvider>
  );
};

export default PhoneInputComponent;

const Label = styled.label`
  font-size: ${(props) => props.theme.fontSize};
  line-height: 18px;
  font-weight: ${(props) => (props.customThemes ? props.theme.fontWeight : `400`)};
  font-family: ${(props) => (props.customThemes ? props.theme.fontFamily : `GilroyMedium, sans-serif`)};
  color: ${(props) => props.theme.labelColor};
  --topPosition: ${(props) => (props.textareaMode ? '15%' : '52%')};

  position: absolute;

  top: ${(props) => (props.up ? '0%' : `var(--topPosition)`)};
  transform: translateY(-50%);
  margin-left: 3rem;
  width: auto;
  z-index: 3;
  transition: all 0.2s ease !important;
  pointer-events: none;
  padding: 0 0.5rem;

  left: 0px;
  ${(props) =>
    props.up &&
    css`
      color: ${(props) =>
        props.customThemes ? props.customThemes.isFocused.mainColor : props.theme.isFocused.mainColor};
      font-size: 0.75rem;
      margin-left: 3rem;
      background: white;
    `};
`;

const ErrorMsg = styled.div`
  position: absolute;
  color: var(--errorColor);
  font-family: var(--fMontserrat);
  font-size: 0.7rem;
  padding-top: 2px;
  margin-right: -3rem;
`;

const PhoneContainer = styled.div`
  box-shadow: ${(props) => (props.error ? '0px 0px 3px var(--errorColor)' : 'unset')};
  position: relative;

  .react-tel-input .form-control {
    --borderColor: ${(props) => props.theme.mainColor};
    border: 1px solid var(--borderColor);
    position: relative;
    letter-spacing: 0.01rem;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-left: 48px;
    margin-left: 0;
    border-radius: 6px;
    width: 100%;
    outline: none;
    font-family: var(--fMontserrat);
    font-weight: 400;
    background-color: #ffffff;
    line-height: ${(props) => (props.customThemes ? props.theme.lineHeight : `2.7rem`)};
    height: var(--inputLineHeight);
    font-size: 0.875rem;
    &:focus ~ ${Label} {
      color: ${(props) =>
        props.customThemes ? props.customThemes.isFocused.mainColor : props.theme.isFocused.mainColor};
    }

    &:focus {
      outline: none;
      border: ${(props) =>
        props.customThemes
          ? `1px solid ${props.customThemes.isFocused.mainColor}`
          : `1px solid ${props.theme.isFocused.mainColor}`};
    }

    &::placeholder {
      color: var(--inputPrimaryColor);
    }
  }
`;
