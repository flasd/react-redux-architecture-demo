import { PayloadAction } from '@reduxjs/toolkit';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import { Todo, actions } from '.';
import { firestore } from '../../../services/firebase';
import { userSelector } from '../auth/selectors';

function* addTodoSaga(action: PayloadAction<Todo>) {
  const user: firebase.UserInfo | null = yield select(userSelector);

  if (!user) {
    return;
  }

  yield put(actions.setInSync({ inSync: true }));

  try {
    const snapshot: firebase.firestore.DocumentReference<Todo> = yield call(
      () =>
        firestore.collection('todos').add({
          uid: user.uid,
          done: false,
          title: action.payload.title,
        }),
    );

    yield put(
      actions.updateTodo(
        {
          id: action.payload.id,
          changes: {
            id: snapshot.id,
          },
        },
        { bypassUpdateSaga: true },
      ),
    );

    yield put(actions.setInSync({ inSync: false }));
  } catch (error) {
    yield put(actions.setError(error));
  }
}

export default takeEvery(actions.addTodo.type, addTodoSaga);
