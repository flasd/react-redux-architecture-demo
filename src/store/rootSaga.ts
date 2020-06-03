import { all, spawn } from 'redux-saga/effects';
import loginEffect from './modules/auth/loginEffect';
import logoutEffect from './modules/auth/logoutEffect';
import authListenerEffect from './modules/auth/authListenerEffect';
import addTodoEffect from './modules/todo/addTodoEffect';
import updateTodoEffect from './modules/todo/updateTodoEffect';
import removeTodoEffect from './modules/todo/removeTodoEffect';

export default function* rootSaga() {
  const sideEffects = [
    // Auth Effetcs
    loginEffect,
    logoutEffect,
    authListenerEffect,

    // ToDo Effects
    addTodoEffect,
    updateTodoEffect,
    removeTodoEffect,
  ];

  yield all(
    sideEffects.map((effect) =>
      spawn(function* () {
        while (true) {
          try {
            yield effect;
            // If the saga finishes, be break out the loop.
            break;
          } catch (e) {
            // If it fails, we log the error and restart the saga.
            console.log(e);
          }
        }
      }),
    ),
  );
}
