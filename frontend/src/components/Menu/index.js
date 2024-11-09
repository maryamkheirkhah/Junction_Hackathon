import React from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import routes from '../../routes';
import loginToken from '../../utils/loginToken';
import logout_yellow from '../../assets/images/logout_yellow.svg';
import logout_mint from '../../assets/images/logout_mint.svg';
import logout_coral from '../../assets/images/logout_coral.svg';
import { AppContext } from '../../contexts/AppContext';
import getAllUrlParams from '../../utils/getAllUrlParams';
const Menu = props => {
  let { user, navigation } = React.useContext(AppContext);

  const navElements = routes.map((route, index) => {
    if (route.displayName) {
      if (
        route.credentials && loginToken?.current?.credentials?.some(x => route.credentials.includes(x))
      ) {
        return (
          <StyledLink
            key={'StyledLink' + index}
            to={route.path + '/'}
            onClick={e => {
              e.preventDefault();
              props.navigateTo(route.path + '/');
            }}
            activeStyle={{ borderLeft: '10px solid var(--colorPrimary)', backgroundColor: ' #121212' }}
          >
            {route.icon && <img src={route.icon} />}
            {route.displayName}
          </StyledLink>
        );
      }else if(!route.credentials){
        return (
          <StyledLink
            key={'StyledLink' + index}
            to={route.path + '/'}
            onClick={e => {
              e.preventDefault();
              props.navigateTo(route.path + '/');
            }}
            activeStyle={{ borderLeft: '10px solid var(--colorPrimary)', backgroundColor: ' #121212' }}
          >
            {route.icon && <img src={route.icon} />}
            {route.displayName}
          </StyledLink>
        );
      }
    }
  });

  return (
    <Container>
      <UserInfo logout={props.logout} user={props.user} />
      {navElements}
    </Container>
  );
};

export default Menu;

const UserInfo = props => {
  let { theme } = React.useContext(AppContext);
  return (
    <Panel>
      <Info>
        <Name title={props.user.first_name + ' ' + props.user.last_name}>
          {props.user.first_name} {props.user.last_name}
        </Name>
        <Organization title={props.user.organisation_name}>{props.user.organisation_name}</Organization>
        <Group title={props.user.access_level_name}>{props.user.access_level_name}</Group>
      </Info>
      <Button
        themeVersion={theme}
        title={'Log out'}
        onClick={() => {
          props.logout();
        }}
      />
    </Panel>
  );
};

const UserContainer = styled.div`
  border-bottom: 1px solid #1a1a1a;
  height: 4.6em;
  padding: 1rem;
`;

const Container = styled.div`
  color: #fff;
  width: 100%;
  height: 100%;
  background-size: 122%;
  background-position: 0 -4.2em;
  background-repeat: no-repeat;
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  pointer-events: all;
  cursor: pointer;
  align-items: center;
  border-left: 10px solid rgba(0, 0, 0, 0.2);
  padding-left: 1rem;
  letter-spacing: 0.025rem;
  width: 100%;
  height: 3em;
  line-height: 3em;
  &:focus,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
  @media (max-width: 800px) {
    height: 4em;
    line-height: 4em;
  }

  img {
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;
  }
  &:hover {
    cursor: pointer;
    color: var(--colorPrimary);
    transition: all 0.3s ease-in;
  }
`;

//region Styles
const Panel = styled.div`
  display: flex;
  flex-direction: row;
  height: 7rem;
  border-bottom: 1px solid #1a1a1a;
  padding-top: 1rem;
  padding-right: 1rem;
  padding-left: 1rem;
  padding-bottom: 1rem;
`;
const Button = styled.img.attrs(props => ({
  src:
    props.themeVersion === 'developmentTheme'
      ? logout_yellow
      : props.themeVersion === 'stagingTheme'
      ? logout_coral
      : logout_mint
}))`
  width: 1.6rem;
  height: 1.6rem;
  align-self: center;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    //transform: scale(1.05);
  }
`;
const Info = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--colorPrimary);
  line-height: 1.8rem;
  letter-spacing: 0.06em;
`;
const Name = styled.div`
  width: 100%;
  padding-right: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1.3rem;
  text-overflow: ellipsis;
  font-weight: bold;
`;
const Group = styled.div`
  width: 100%;
  font-size: 0.9rem;
  line-height: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Organization = styled.div`
  width: 100%;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

//endregion
