import { eventChannel } from 'redux-saga';
import { spawn, take, put } from 'redux-saga/effects';
import { auth } from '../../../services/firebase';
import { actions } from '.';

type MaybeUser = firebase.User | null;
type ChannelMessage = { user: MaybeUser };

const onAuthStateChangedChannel = eventChannel<ChannelMessage>((emit) => {
  return auth.onAuthStateChanged((user) => {
    emit({ user });
  });
});

function* authListenerSaga() {
  while (true) {
    const { user }: ChannelMessage = yield take(onAuthStateChangedChannel);

    yield put(actions.authStateChanged({ user }));
  }
}

export default spawn(authListenerSaga);
