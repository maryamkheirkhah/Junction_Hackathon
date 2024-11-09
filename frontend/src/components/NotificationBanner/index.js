import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import xcircle from '../../assets/images/xcircle.svg';
import error_warning from '../../assets/images/error_warning.svg';
import whitecheck from '../../assets/images/whitecheck.svg';
import { motion } from 'framer-motion';

const NotificationBanner = (props) => {
  const [visible, setVisible] = useState(props.visible);
  const [currentTheme, setCurrentTheme] = useState('errorTheme');

  useEffect(() => {
    setVisible(props.visible);
    if (props.mode === 'success') setCurrentTheme('successTheme');
    else setCurrentTheme('errorTheme');
  }, [props.visible, props.mode]);

  const containerVariants = {
    enter: {
      y: 0,
      zIndex: 1001,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 1000, damping: 15 },
        default: { duration: 0.2 },
        delay: 0.2,
      },
    },
    exit: {
      y: 20,
      zIndex: -2,
      opacity: 0,
      transition: { duration: 0.07 },
    },
  };

  return (
    <ThemeProvider theme={Themes[currentTheme]}>
      <Container
        variants={containerVariants}
        initial="exit"
        animate={visible ? 'enter' : 'exit'}
      >
        <IconContainer>
          <Icon src={props.mode === 'success' ? whitecheck : error_warning} />
        </IconContainer>
        <TextContainer>
          <p>{props.text}</p>
          <CloseIcon src={xcircle} onClick={() => setVisible(false)} />
        </TextContainer>
      </Container>
    </ThemeProvider>
  );
};

export default NotificationBanner;

const Themes = {
  errorTheme: {
    mainColor: '#da1c1c',
    bgColor: '#e94c4c',
  },
  successTheme: {
    mainColor: '#0E8649',
    bgColor: '#6eb152',
  },
};

const TextContainer = styled.div`
  padding: 0.3rem;
  font-family: 'Roboto', sans-serif;
  text-align: left;
  p {
    padding: 0.5rem 0.3rem;
    margin: 0;
  }
  p:first-letter {
    text-transform: capitalize;
  }
`;

const Container = styled(motion.div)`
  height: auto;
  bottom: 2rem;
  position: fixed;
  width: 400px;
  right: 2rem;
  display: grid;
  border-radius: 5px;
  grid-template-columns: 17% 1fr;
  --mainColor: ${(props) => (props.theme ? props.theme.mainColor : '')};
  --bgColor: ${(props) => (props.theme ? props.theme.bgColor : '')};
  background-color: var(--bgColor);
  color: white;
  border: 1px solid var(--mainColor);
`;

const IconContainer = styled.div`
  background-color: var(--mainColor);
  width: 100%;
  height: 100%;
  grid-column: 1/2;
  display: flex;
  align-content: center;
  justify-content: center;
`;

const Icon = styled.img`
  align-self: center;
  width: 1.5rem;
  height: 1.5rem;
  filter: brightness(0) invert(1);
`;

const CloseIcon = styled.img`
  width: 0.8rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  filter: brightness(0) invert(1);
  cursor: pointer;
`;
