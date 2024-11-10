import React from 'react';
import logo from '../../assets/images/logo-footer.svg';
import styled from 'styled-components';

const FingridLogo = props => {
  return <Logo />;
};

export { FingridLogo };

const Logo = styled.img.attrs(props => ({ src: logo }))`
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 2.5rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.055);
  }
`;
