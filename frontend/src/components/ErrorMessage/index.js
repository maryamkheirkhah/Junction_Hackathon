import React from 'react';
import styled from 'styled-components';

const ErrorMessage = props => (
  <Container>
    <Message>{'There was an error while loading data, please try again'}</Message>
    <ButtonStyle onClick={props.reloadHandler ? props.reloadHandler : () => {}}>Reload Page</ButtonStyle>
  </Container>
);

export default ErrorMessage;

const ButtonStyle = styled.button`
  --btnFontColor: ${props => (props.fontColor ? props.fontColor : '#ffffff')};
  --btnColor: ${props => (props.btnColor ? props.btnColor : '#373737')};
  --btnHoverColor: ${props => (props.btnHoverColor ? props.btnHoverColor : '#2a2a2a')};
  width: 20rem;
  height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  // min-width: 8rem;
  border: 0px solid rgb(30, 32, 34);
  line-height: ${props => (props.lineHeight ? props.lineHeight + 'rem' : '2.5rem')};
  display: flex;
  align-items: center;
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
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: darkred;
`;

const Message = styled.div`
  display: flex;
  padding: 1rem;
  font-size: 1.2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: darkred;
`;
