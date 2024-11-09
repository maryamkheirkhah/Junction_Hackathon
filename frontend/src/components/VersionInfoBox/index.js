import React, { Fragment, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import config from '../../utils/config';

const VersionInfoBox = props => {
  const [backendVersion, setBackendVersion] = useState('unknown');

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(config.GRAPHQL_PORTAL_URL[process.env.REACT_APP_BACKEND] + '/version');
      const text = await result.text();
      setBackendVersion(text);
    }
    fetchData();
  }, []);

  return (
    <InfoBox>
      <Fragment>
        <Row>
          <Label>{'server url: '}</Label>
          <ValueInfo>{process.env.REACT_APP_BACKEND}</ValueInfo>
        </Row>
        <Row>
          <ValueInfo>
            [ {config.GRAPHQL_PORTAL_URL[process.env.REACT_APP_BACKEND].replace(/(^\w+:|^)\/\//, '')} ]
          </ValueInfo>
        </Row>
      </Fragment>
      <Row>
        <Label>{'backend: '}</Label>
        <ValueInfo>{backendVersion}</ValueInfo>
      </Row>
      <Row>
        <Label>{'frontend: '}</Label>
        <ValueInfo>{process.env.REACT_APP_VERSION}</ValueInfo>
      </Row>
    </InfoBox>
  );
};

export default VersionInfoBox;

const InfoBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  min-width: 16rem;
  line-height: 1.2rem;
  margin: 2.5rem;
  text-align: left;
  font-family: var(--fMontserrat);
  font-size: 0.688rem;
  border-radius: 10px;
  padding: 1.5rem;

  color: var(--versionInfoColor);
  background-color: rgba(255, 255, 255, 0.5);
  @media (max-width: 800px) {
  }
  @media (max-height: 700px) {
    margin: 1rem;
    line-height: 1rem;
    padding: 0.5rem;
  }
`;

const ValueInfo = styled.span``;

const Label = styled.span`
  font-weight: 600;
`;

const Row = styled.div`
  //padding: 0 1.5rem 0.5rem 2rem;
`;
