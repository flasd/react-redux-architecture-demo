import createRegistry from '../services/action-creator-registry';
import { actions as authActions } from './modules/auth';
import { actions as todoActions } from './modules/todo';
import store from '.';

const registry = createRegistry(
  {
    auth: authActions,
    todo: todoActions,
  },
  store.dispatch,
);

export default registry;

const {
  useActionCreator,
  useActionCreators,
  useActionType,
  useActionTypes,
} = registry;

export { useActionCreator, useActionCreators, useActionType, useActionTypes };
