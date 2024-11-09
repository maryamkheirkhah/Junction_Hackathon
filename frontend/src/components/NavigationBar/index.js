import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import brands from '../../assets/images/Brands_Icon.svg';

const NavigationBar = props => {
  const decodeURIComponentSafe = (uri, mod) => {
    let out = new String(),
      arr,
      i = 0,
      l,
      x;

    arr = uri.split(/(%(?:d0|d1)%.{2})/);
    for (l = arr.length; i < l; i++) {
      try {
        x = decodeURIComponent(arr[i]);
      } catch (e) {
        x = arr[i];
      }
      out += x;
    }
    return out;
  };

  return (
    <Container>
      <Logo />
      {props.navigation.map((item, index) => {
        if (index === 0)
          return item.destination !== '' ? (
            <StyledLink
              key={'StyledLink' + index}
              to={item.url}
              onClick={() => props.navigateTo(item.destination, item.payload)}
            >
              {`${decodeURIComponentSafe(item.name).replaceAll('(prc_sgn)', '%')}`}
            </StyledLink>
          ) : (
            <InactiveLink key={'div' + index}>{`${decodeURIComponentSafe(item.name).replaceAll(
              '(prc_sgn)',
              '%'
            )}`}</InactiveLink>
          );
        else
          return (
            <React.Fragment key={'Fragment' + index}>
              <Separator key={'Separator' + index}>{' > '}</Separator>
              {item.destination !== '' ? (
                <StyledLink
                  key={'StyledLink' + index}
                  to={item.url}
                  onClick={() => props.navigateTo(item.destination, item.payload)}
                >
                  {`${decodeURIComponentSafe(item.name).replaceAll('(prc_sgn)', '%')}`}
                </StyledLink>
              ) : (
                <InactiveLink key={'div' + index}>{`${decodeURIComponentSafe(item.name).replaceAll(
                  '(prc_sgn)',
                  '%'
                )}`}</InactiveLink>
              )}
            </React.Fragment>
          );
      })}
    </Container>
  );
};

export default NavigationBar;

const Container = styled.div`
  position: relative;
  background-color: #373737;
  padding-left: calc(2rem + 2vw);
  width: 100%;
  height: 3.8rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-family: 'Catamaran', sans-serif;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 1.4rem;
  line-height: 3.8rem;

  @media (max-width: 800px) {
    font-size: 1.2rem;
    flex-wrap: wrap;
    line-height: 1rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const Logo = styled.img.attrs(props => ({ src: brands }))`
  display: block;

  position: absolute;
  left: calc(0.5rem + 1vw);
  height: 1rem;
  width: 1rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.055);
  }
`;

const StyledLink = styled.div`
  text-decoration: none;
  color: #ffffff;
  cursor: pointer;

  &:focus,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const InactiveLink = styled.div`
  text-decoration: none;
  color: #cfcfcf;
  cursor: initial;
  user-select: none;
`;

const Separator = styled.div`
  padding: 0 8px 0 8px;
`;

/*

Catamaran SemiBold 28 pkt letterspace 10 #ffffff


 */
