import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const fadein = keyframes`
 0% {
    display: block;
     opacity: 0;
    //transform: scale(0);
  }
  100% {
    opacity: 1;
    //transform: scale(1);
  }
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  content-visibility: auto;
  contain-intrinsic-size: 240px;
  /*opacity: 0;
  animation: ${fadein} 0.9s;
  animation-delay: ${props => (props.index ? props.index * 0.1 + 's' : '0.0s')};
  animation-fill-mode: forwards;*/
`;
/*
 animation: ${fadein} 0.5s;
  animation-delay: ${props => (props.index ? props.index * 0.1 + 's' : '0.0s')};
  animation-fill-mode: forwards;
 */
class DataContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  render() {
    return (
      <Panel index={this.props.index}>
        {<this.props.panel data={this.props.data} handleClick={this.props.handleClick} {...this.props} />}
      </Panel>
    );
  }
}

export default DataContainer;
