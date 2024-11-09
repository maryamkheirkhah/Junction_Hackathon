import React, { Component } from 'react';
import styled from 'styled-components';
import access_denied_character from '../../assets/images/access_denied_character.svg';
import { ButtonModern } from '../Button';
import { ButtonThemes } from '../../utils/themes';

const AccessDenied = props => {
  return (
    <Container>
      <Character src={access_denied_character} alt={'Access Denied image'} />
      <TextContainer>
        <h1>Access denied.</h1>
        <p>We are sorry, but you don’t have permission to view this section.</p>


        <ButtonModern
          key={'Go_back'}
          borderRadius={23}
          btnWidth={14}
          text={'Go back'}
          onClickHandler={() => props.navigateTo('/dashboards/')}
          theme={'primary'}
          customThemes={ButtonThemes}
        />
      </TextContainer>
    </Container>
  );
};

export default AccessDenied;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 460px;
  margin-left: 12%;
  h1 {
    font-family: var(--fMontserrat);
    font-size: 2rem;
    margin: 0;
    padding: 0;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    line-height: 3.5rem;
    margin-bottom: 0.5rem;
  }
`;

const Character = styled.img`
  width: 14.5rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 4rem;
  padding-top: 6rem;
  max-width: 1920px;
  position: relative;
`;
