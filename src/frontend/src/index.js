import React from 'react';
import reportWebVitals from './reportWebVitals';
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App';
import './index.css';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.querySelector('#root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
