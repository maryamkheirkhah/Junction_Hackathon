import React, { Fragment, useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

const SelectionPanel = props => {
  return (
    <Container>
      {props.items.map((i, k) => (
        <Item
          key={i.id}
          onClick={() => props.handleSelect(i.id)}
          isSelected={i.checked}
          isStart={k == 0}
          isEnd={props.items.length - 1 == k}
        >
          <Label>{i.label}</Label>
        </Item>
      ))}
    </Container>
  );
};

export default SelectionPanel;

const Container = styled.div`
  --fieldHeight: 2.5rem;
  font-family: var(--fMontserrat);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  height: var(--fieldHeight);
  border-radius: 19px;
  position: relative;
  background: linear-gradient(40deg, var(--colorPrimary) 0%, var(--colorSecondary) 52%);
`;

const Label = styled.div`
  color: white;
  align-self: center;
  display: flex;
  font-size: 0.75rem;
`;

const Item = styled.div`
  height: var(--fieldHeight);
  justify-content: center;
  flex-grow: 1;
  align-content: center;
  display: flex;
  border-radius: ${props => (props.isStart ? `19px 0 0 19px` : props.isEnd ? `0 19px 19px 0` : `0 0 0 0 `)};
  background: ${props => props.isSelected && `rgba(0,0,0,0.5)`};
  transition: background 200ms ease-out;
  cursor: pointer;
`;
