import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import TranslationApp from './App';
import { reducer } from './store/reducer';

import './css/main.scss';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const store = createStore(
    reducer,
    composeEnhancers()
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <TranslationApp />
    </Provider>
  </React.StrictMode>
);
