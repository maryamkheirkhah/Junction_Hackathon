import React from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

const Button = props => (
  <ButtonStyle
    btnColor={props.btnColor}
    fontColor={props.fontColor}
    btnHoverColor={props.btnHoverColor}
    btnHeight={props.btnHeight}
    onClick={props.onClickHandler}
    type={props.type}
    btnWidth={props.btnWidth}
    txtAlign={props.txtAlign}
    fontSize={props.fontSize}
    borderRadius={props.borderRadius}
    lineHeight={props.lineHeight}
    disable={props.disable}
    error={props.error}
  >
    {props.textLabel}
  </ButtonStyle>
);

export default Button;

export const ButtonModern = props => {
  const buttonThemes = {
    primary: {
      colors: {
        text: '#FFFFFF',
        background: '#dabe35',
        hover: '#e2b800',
        fontFamily: 'GilroyMedium, sans-serif',
        fontWeight: 400
      }
    }
  };

  return (
    <ThemeProvider theme={props.customThemes ? props.customThemes[props.theme] : buttonThemes[props.theme]}>
      <ButtonModernStyle
        onClick={props.onClickHandler}
        type={props.type}
        txtAlign={props.txtAlign}
        fontSize={props.fontSize}
        borderRadius={props.borderRadius}
        lineHeight={props.lineHeight}
        disable={props.disable}
        error={props.error}
        btnWidth={props.btnWidth}
      >
        {props.text}
      </ButtonModernStyle>
    </ThemeProvider>
  );
};

const ButtonModernStyle = styled.button`
  --btnFontColor: ${props => props.theme.colors.text};
  --btnBackground: ${props => props.theme.colors.background};
  --btnHoverColor: ${props => props.theme.colors.hover};
  width: ${props => (props.btnWidth ? props.btnWidth + 'rem' : '100%')};
  height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  border: ${props => (props.error ? '1px solid #ca3838' : '0px solid rgb(30, 32, 34)')};
  box-shadow: ${props => (props.error ? '0px 0px 3px #ff0000' : '0px 2px 3px rgba(0,0,0,0.13)')};
  line-height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  display: flex;
  align-items: center;
  letter-spacing: 0.05rem;
  justify-content: ${props => (props.txtAlign ? props.txtAlign : 'center')};
  vertical-align: middle;
  font-family: ${props => props.theme.fontFamily};
  color: var(--btnFontColor);
  font-weight: ${props => props.theme.fontWeight};
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: ${props => (props.txtAlign ? props.txtAlign : 'center')};
  font-size: ${props => (props.fontSize ? props.fontSize + 'rem' : '0.9rem')};
  background-color: var(--btnBackground);
  border-radius: ${props => (props.borderRadius ? props.borderRadius + 'px' : 'unset')};
  transition: all 0.5s ease;
  padding: 0rem 0.5rem;
  &:hover {
    cursor: pointer;
    background-color: var(--btnHoverColor);
  }
  &:focus {
    outline: none;
  }

  & > * {
    width: 100%;
    cursor: pointer;
  }
  ${({ disable }) => disable && `opacity:0.5;pointer-events:none;`}
`;

const ButtonStyle = styled.button`
  --btnFontColor: ${props => (props.fontColor ? props.fontColor : '#ffffff')};
  --btnColor: ${props => (props.btnColor ? props.btnColor : '#373737')};
  --btnHoverColor: ${props => (props.btnHoverColor ? props.btnHoverColor : '#2a2a2a')};
  width: ${props => (props.btnWidth ? props.btnWidth + '%' : '100%')};
  height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  // min-width: 8rem;
  border: ${props => (props.error ? '1px solid #ca3838' : '0px solid rgb(30, 32, 34)')};
  box-shadow: ${props => (props.error ? '0px 0px 3px #ff0000' : 'unset')};
  line-height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  display: flex;
  align-items: center;
  letter-spacing: 0.05rem;
  justify-content: ${props => (props.txtAlign ? props.txtAlign : 'center')};
  vertical-align: middle;
  font-family: 'Catamaran', sans-serif;
  color: var(--btnFontColor);
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: ${props => (props.txtAlign ? props.txtAlign : 'center')};
  font-size: ${props => (props.fontSize ? props.fontSize + 'rem' : '0.9rem')};
  background-color: var(--btnColor);
  border-radius: ${props => (props.borderRadius ? props.borderRadius + 'px' : 'unset')};
  //box-shadow: 0px 2px 2.82px 0.18px rgba(0, 0, 0, 0.24);
  &:hover {
    cursor: pointer;
    background-color: var(--btnHoverColor);
  }
  &:focus {
    outline: none;
  }

  & > * {
    width: 100%;
    cursor: pointer;
  }
  ${({ disable }) => disable && `opacity:0.5;pointer-events:none;`}
`;
