import React from 'react';
import dibs_logo_onyx from '../../assets/images/logo_onyx.svg';
import styled from 'styled-components';

const SnatchLogo = props => {
  return <Logo />;
};

export { SnatchLogo };

const Logo = styled.img.attrs(props => ({ src: dibs_logo_onyx }))`
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 2.5rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.055);
  }
`;
