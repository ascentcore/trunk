import 'utils/overrides';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from 'ducks';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import Theme from 'theme';
import sagas from 'sagas';
import { configureAxios } from 'api/config';
import 'utils/overrides';
import App from 'App';

import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory({
    // basename: '/app',
});

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware));
const store = createStore(rootReducer, enhancers);

configureAxios(store);
sagaMiddleware.run(sagas);

ReactDOM.render(
    <Theme>
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
    </Theme>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
