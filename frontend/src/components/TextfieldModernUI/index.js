import React, { PropTypes, Component, useState, useEffect, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { ThemeProvider } from 'styled-components';

const TextFieldModernUI = props => {
  const [isFilled, setIsFilled] = useState(false);
  const [themeMode, setThemeMode] = useState('notFilled');

  const [inputValue, setInputValue] = useState(props.value);
  useEffect(() => {
    setInputValue(props.value);
    if (props.value) {
      setIsFilled(true);
      setThemeMode('isFilled');
    }
    if (!props.value || props.value === '') setThemeMode('notFilled');
  }, [props]);

  const handleOnFocus = e => {
    setIsFilled(true);
    if (props.handleOnFocus) props.handleOnFocus(e);
  };

  const handleOnBlur = e => {
    if (!e.target.value) {
      setThemeMode('notFilled');
      setIsFilled(false);
    }
    if (props.handleOnBlur) {
      props.handleOnBlur();
    }
  };

  const inputChangeHandler = e => {
    setInputValue(e.target.value);
    if (e.target.value) setThemeMode('isFilled');
    props.onChange(props.name, e.target.value);
  };

  return (
    <ThemeProvider theme={props.customThemes ? props.customThemes[themeMode] : Themes[themeMode]}>
      <TextfieldContainer key={props.name} autoComplete="off">
        {props.textareaMode ? (
          <TextArea
            id={props.id}
            autoComplete={props.autoComplete ? props.autoComplete : 'nope'}
            onChange={inputChangeHandler}
            placeholder={props.placeholder}
            height={props.height}
            minHeight={props.minHeight}
            value={inputValue || props.type === 'number' ? inputValue : ''}
            error={props.error}
            maxLength={props.maxLength}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        ) : (
          <Input
            id={props.id}
            type={props.type ? props.type : 'text'}
            name={props.name}
            autoComplete={'nope'}
            readOnly={props.readonly}
            placeholder={props.placeholder}
            onFocus={handleOnFocus}
            paddingLeft={props.paddingLeft}
            onBlur={handleOnBlur}
            error={props.error}
            value={inputValue || props.type === 'number' ? inputValue : ''}
            onChange={inputChangeHandler}
            maxLength={props.maxLength}
            autoFocus={props.autoFocus}
            borderRadius={props.borderRadius}
            customThemes={props.customThemes}
            icon={props.icon}
          />
        )}
        {!props.hideLabel && (
          <Label
            up={isFilled || inputValue}
            textareaMode={props.textareaMode}
            isIcon={props.icon}
            customThemes={props.customThemes}
          >
            {props.labelName}
          </Label>
        )}
        {props.icon && <Icon src={props.icon} alt={'Icon'} />}
        {props.type !== 'number' && !props.hideCounter && (
          <CharContainer>
            <CurrentLength warning={inputValue && props.maxLength && inputValue.length > props.maxLength}>
              {inputValue ? inputValue.length : '0'}
            </CurrentLength>
            /{props.maxLength ? props.maxLength : <Fragment>&#8734;</Fragment>}
          </CharContainer>
        )}
        {props.error && <ErrorMsg>{props.errMsg}</ErrorMsg>}
      </TextfieldContainer>
    </ThemeProvider>
  );
};

export default TextFieldModernUI;

const Icon = styled.img`
  position: absolute;
  height: 0.938rem;
  left: 1rem;
  transform: translateY(-50%);
  top: 50%;
`;

const CharContainer = styled.div`
  position: absolute;
  top: -18px;
  right: 0;
  display: flex;
  flex-direction: row;
  font-size: 0.75rem;
  color: ${props => props.theme.fontColor};
`;

const CurrentLength = styled.div``;

const Themes = {
  notFilled: {
    mainColor: '#bfbfbf',
    fontColor: '#bfbfbf',
    labelColor: '#bfbfbf',
    fontSize: '0.875rem',
    fontSizeInput: '0.875rem'
  },
  isFocused: {
    mainColor: '#dabe35',
    labelColor: '#dabe35',
    fontColor: '#333333',
    fontSize: '0.75rem',
    fontSizeInput: '0.875rem'
  },
  isFilled: {
    mainColor: '#333333',
    labelColor: '#333333',
    fontColor: '#333333',
    fontSize: '0.75rem',
    fontSizeInput: '0.875rem'
  }
};

const ErrorMsg = styled.div`
  position: absolute;
  font-size: 0.7rem;
  padding-top: 5px;
  margin-right: -5rem;
  font-family: var(--fMontserrat);
  color: var(--errorColor);
  font-weight: 400;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSize};
  line-height: 18px;
  font-weight: ${props => (props.customThemes ? props.theme.fontWeight : `400`)};
  font-family: ${props => (props.customThemes ? props.theme.fontFamily : `GilroyMedium, sans-serif`)};
  color: ${props => props.theme.labelColor};
  --topPosition: ${props => (props.textareaMode ? '15%' : '52%')};

  position: absolute;

  top: ${props => (props.up ? '0%' : `var(--topPosition)`)};
  transform: translateY(-50%);
  margin-left: ${props => (props.isIcon ? `2rem` : `1rem`)};
  width: auto;

  transition: all 0.2s ease !important;
  pointer-events: none;
  padding: 0 0.5rem;

  left: 0px;
  ${props =>
    props.up &&
    css`
      // top: 0%;
      font-size: 0.75rem;
      margin-left: 0.7rem;
      background: white;
    `};
`;

const Input = styled.input`
  --borderColor: ${props => props.theme.mainColor};
  --borderRadius: ${props => props.borderRadius};
  width: 100%;
  font-size: ${props => props.theme.fontSizeInput};
  padding-left: ${props => (props.icon ? `2.5rem` : props.paddingLeft ? props.paddingLeft+'rem' : `1.3rem`)};
  line-height: ${props => (props.customThemes ? props.theme.lineHeight : `2.5rem`)};
  // padding-bottom: 5px;
  border-radius: var(--borderRadius);
  color: ${props => props.theme.fontColor};
  font-family: ${props => (props.customThemes ? props.theme.fontFamily : `GilroyRegular, sans-serif`)};
  box-shadow: ${props => (props.error ? '0px 0px 3px var(--errorColor)' : 'unset')};
  border: 1px solid var(--borderColor);
  outline: none;
  font-weight: ${props => (props.customThemes ? props.theme.fontWeight : `400`)};
  -moz-appearance: textfield;
  &:focus ~ ${Label} {
    color: ${props => (props.customThemes ? props.customThemes.isFocused.mainColor : `#dabe35`)};
  }

  &:focus {
    outline: none;
    border: ${props =>
      props.customThemes ? `1px solid ${props.customThemes.isFocused.mainColor}` : `1px solid #dabe35`};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  z-index: 3;
  &::placeholder {
    color: var(--inputPrimaryColor);
  }

  &:-webkit-autofill ~ ${Label} {
    font-size: 0.75rem;
    margin-left: 0.7rem;
    background-color: white;
    top: 0%;
  }

  &:-webkit-autofill {
    background-color: white !important;
  }
`;

const TextfieldContainer = styled.div`
  position: relative;
  //margin-bottom: 1rem;
  width: 100%;
`;

const TextArea = styled.textarea`
  resize: none;
  padding: 2px 0.8em 0 0.8em;
  box-sizing: border-box;
  text-align: left;
  padding-top: 0.4em;
 // box-shadow: ${props => (props.error ? '0px 0px 3px var(--errorColor)' : 'unset')};
  height: auto;
  min-height: ${props => (props.minHeight ? props.minHeight + 'px' : '150px')};
  width: 100%;
  margin: 0px;
  --borderColor: ${props => props.theme.mainColor};
  font-size: 0.875rem;
  padding-left: 1.3rem;
  line-height: 1.5rem;
  padding-bottom: 5px;
  color: ${props => props.theme.fontColor};
  font-family: GilroyRegular, sans-serif;
  border: 1px solid var(--borderColor);
  outline: none;
  font-weight: 400;
  -moz-appearance: textfield;
  &:focus ~ ${Label} {
    color: #dabe35;
  }

  &:focus {
    outline: none;
    border: 1px solid #dabe35;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  z-index: 3;
 
  &::placeholder {
    color: var(--inputPrimaryColor);
  }
  ${props =>
    props.height && {
      height: props.textfieldHeight + 'px'
    }};
`;
