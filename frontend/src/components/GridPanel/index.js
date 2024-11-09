import React, { useState, useEffect } from 'react';
import DataContainer from './DataContainer';
import styled, { keyframes } from 'styled-components';

const GridPanel = props => {
  const [showALl, setShowALl] = useState(false);

  useEffect(() => {
    window.removeEventListener('scroll', handleScroll, false);
    window.addEventListener('scroll', handleScroll, false);
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll, false);
    };
  }, []);

  const handleScroll = () => {
    let scroll = window.scrollY;
    if (scroll > 0 && showALl !== true) {
      setShowALl(true);
    }
  };

  if (props.isFetching) {
    return null;
  }
  if (!props.data) {
    return (
      <Loading>
        <LoadingText>{'LOADING'}</LoadingText>
      </Loading>
    );
  }

  return (
    <Container topMargin={props.topMargin} bottomMargin={props.bottomMargin}>
      {props.data.map((item, index) => {
        if (!showALl && index > 30) return;
        return (
          <DataContainer
            key={item.key}
            panel={props.panel}
            data={item}
            handleClick={() => props.handleClick(item)}
            listData={props.listData}
            color={props.color}
            index={index}
          />
        );
      })}
    </Container>
  );
};

export default GridPanel;

const Container = styled.div`
  display: grid;
  width: 100%;
  min-height: ${props => (props.data ? props.topMargin : '128px')};
  margin-top: ${props => (props.topMargin ? props.topMargin : '128px')};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0rem;
  margin-bottom: ${props => (props.bottomMargin ? props.bottomMargin : '128px')};
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  grid-gap: 4vw;
  padding: 0;

  // background-color: #2f3238;
  @media (min-width: 2560px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 2560px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 2200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1600px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

const Loading = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  height: calc(100vh - 20px);
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  // background-color: rgba(6,6,6,0.68);
`;

const pulse = keyframes`
   0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% {transform: scale(1); }
      
`;

const LoadingText = styled.div`
  display: flex;
  text-align: center;
  color: white;
  align-items: center;

  text-shadow: 2px 2px #000000;
  //height: 100%;
  line-height: 1;
  margin-left: auto;
  margin-right: auto;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
