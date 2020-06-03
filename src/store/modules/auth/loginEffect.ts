import { call, put, takeLatest, select } from 'redux-saga/effects';
import { auth } from '../../../services/firebase';
import { actions } from '.';
import { authSelector } from './selectors';

function* loginSaga() {
  const authState = yield select(authSelector);

  if (authState.loading || authState.user) {
    return;
  }

  try {
    yield call(() => auth.signInAnonymously());
  } catch (error) {
    yield put(actions.loginFailed({ error: error.message }));
  }
}

export default takeLatest(actions.login.type, loginSaga);
