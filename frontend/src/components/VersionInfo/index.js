import React, { useReducer, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import config from '../../utils/config';

const VersionInfo = props => {
  const [backendYersion, setBackendYersion] = useState('unknown');

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(config.GRAPHQL_PORTAL_URL[process.env.REACT_APP_BACKEND] + '/version');
      const text = await result.text();
      setBackendYersion(text);
    }
    fetchData();

    /*  fetch('https://portal-backend.strapserver.com/version')
      .then(response => response.text())
      .then((response) => {
        //document.getElementById('version').innerHTML = response;
        console.log('dsdasdasd', response);
      })*/
  }, []);

  return (
    <Info>
      <Row>
        <Yellow>{'server url: '}</Yellow>
        <White>{process.env.REACT_APP_BACKEND}</White>
      </Row>
      <Row>
        <Small>[ {config.GRAPHQL_PORTAL_URL[process.env.REACT_APP_BACKEND].replace(/(^\w+:|^)\/\//, '')} ]</Small>
      </Row>
      <Row>
        <Yellow>{'backend: '}</Yellow>
        <White>{backendYersion}</White>
      </Row>
      <Row>
        <Yellow>{'frontend: '}</Yellow>
        <White>{process.env.REACT_APP_VERSION}</White>
      </Row>
    </Info>
  );
};

export default VersionInfo;

const Info = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 14rem;
  line-height: 1rem;
  text-align: left;
  font-size: 0.8rem;
  @media (max-width: 800px) {
    display: none;
  }
`;

const Small = styled.div`
  color: var(--colorSecondary);
  font-weight: bold;
  font-size: 0.8rem;
`;

const White = styled.span`
  color: var(--colorSecondary);
  font-weight: bold;
`;

const Yellow = styled.span`
  color: #ffffff;
`;

const Row = styled.div`
  color: var(--colorSecondary);
  padding: 0 1.5rem 0.5rem 2rem;
`;
