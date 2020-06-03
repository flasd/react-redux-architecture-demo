import { call, takeLatest } from 'redux-saga/effects';
import { auth } from '../../../services/firebase';
import { actions } from '.';

function* logoutSaga() {
  yield call(() => auth.signOut());
}

export default takeLatest(actions.logout.type, logoutSaga);
