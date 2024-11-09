import React, { useState, Fragment, useEffect } from 'react';
import styled from 'styled-components';
//import VersionInfoBox from '../VersionInfoBox';
import logo from '../../assets/images/logo.png'
import screen from '../../assets/images/logo.png';
const AuthenticationUI = props => {
  return (
    <Background>
      <Panel>
        <AppScreen src={screen} alt={'Fingrid'} />
        <FormBox>
          <Logo src={logo} />
          {props.children}
        </FormBox>
      </Panel>
      
    </Background>
  );
};

export default AuthenticationUI;

const FormBox = styled.div`
  grid-column: 2/3;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  padding: 3rem 3rem 1rem 3rem;
  @media (max-width: 1200px) {
    grid-column: 1/2;
  }
`;

const AppScreen = styled.img`
  grid-column: 1/2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px 0 0 10px;
  //background-image: ${props => props.image && `url(${props.image})`};
  @media (max-width:1200px){
    display:none;
  }
`;

const Logo = styled.img`
  width: 13.313rem;
  align-self: center;
  padding-top: 0.8rem;
  margin-left: 2.8rem;
`;

const Panel = styled.div`
  max-width: 1000px;
  min-height: 600px;
  width: 60%;
  //height: 60%;
  margin: 0 auto;
  margin-bottom: 8rem;
  align-self: center;
  display: grid;
  position: relative;
  grid-template-columns: 40% 60%;
  font-family: var(--fMontserrat);
  background-color: #ffffff;
  border-radius: var(--panelRadius);
  box-shadow: var(--panelShadow);
  @media (max-width: 1200px) {
    grid-template-columns: 100%;
  }

  @media (max-height: 800px) {
    margin-bottom: 0px;
    min-height: 400px;
    max-height: 90vh;
  }
  @media (max-height: 550px) {
    min-height: 90vh;
    overflow: auto;
  }
  @media (max-width: 500px) {
    width: 100%;
    //border-radius: 0;
  }
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-size: cover;

  grid-column-start: 1;
  grid-column-end: span 3;
  grid-row-start: 1;
  grid-row-end: span 2;
  display: flex;
  flex-direction: row;
  //align-items: center;
  //justify-content: center;
  background: linear-gradient(40deg, var(--colorPrimary) 0%, var(--colorSecondary) 52%);
`;
