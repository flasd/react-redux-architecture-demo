import React from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Provider as ReduxActionsProvider } from './services/action-creator-registry';
import registry from './store/actionCreators';
import store, { history } from './store';
import Screens from './screens';

function App() {
  return (
    <ReduxActionsProvider registry={registry}>
      <ReduxStoreProvider store={store}>
        <ConnectedRouter history={history}>
          <Screens />
        </ConnectedRouter>
      </ReduxStoreProvider>
    </ReduxActionsProvider>
  );
}

export default App;
