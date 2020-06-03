import React from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import { Todo, actions } from '.';
import { firestore } from '../../../services/firebase';
import { userSelector } from '../auth/selectors';

function* removeTodoSaga(action: PayloadAction<string>) {
  const user: firebase.UserInfo | null = yield select(userSelector);

  if (!user) {
    return;
  }

  yield put(actions.setInSync({ inSync: true }));

  try {
    yield call(() =>
      firestore.collection('todos').doc(action.payload).delete(),
    );

    yield put(actions.setInSync({ inSync: false }));
  } catch (error) {
    yield put(actions.fetchFailed(error));
  }
}

export default takeEvery(actions.removeTodo.type, removeTodoSaga);