import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { AppContextProvider } from './contexts/AppContext';
import { createGlobalStyle } from 'styled-components';
import * as serviceWorker from './serviceWorker';

serviceWorker.unregister();

const GlobalStyle = createGlobalStyle`
  /* Import Roboto font using @import */
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap');

  html,
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    min-height: 100%;
    /* overscroll-behavior: contain; */
  }

  #root {
    /* Your styles for #root if any */
  }

  html {
    box-sizing: border-box;
    font-size: calc(13px + 3 * (100vw - 320px) / 1920);
    font-family: 'Roboto', sans-serif;

    @media (min-width: 1920px) {
      font-size: 16px;
    }
    @media (max-width: 320px) {
      font-size: 13px;
    }
  }

  body {
    position: relative;
    overflow: auto;
    overflow: initial;
    overflow-x: hidden;
    background-color: #dedede;
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input {
    font-size: 1rem;
    padding: 2px 0.8em 0 0.8em;
  }

  button {
    font-size: 0.9rem;
    padding: 0;
    padding-top: 1px;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

console.log('[ index.js ] : [ ReactDOM.render ] : [ <App> ]');
ReactDOM.render(
  <Fragment>
    <AppContextProvider>
      <App key={'snatch_app_key'} />
    </AppContextProvider>
    <GlobalStyle />
  </Fragment>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
