import {
  configureStore as createStore,
  combineReducers,
} from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
// Reducers
import authReducer, { AUTH_REDUCER_KEY } from './modules/auth';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  [AUTH_REDUCER_KEY]: authReducer,

  router: connectRouter(history),
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, routerMiddleware(history)],
});

sagaMiddleware.run(rootSaga);

export default store;
export type RootState = ReturnType<typeof rootReducer>;
