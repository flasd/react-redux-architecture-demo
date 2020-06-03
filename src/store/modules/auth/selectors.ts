import { createSelector } from '@reduxjs/toolkit';
import reducer, { AUTH_REDUCER_KEY } from '.';

export const authSelector = (state: {
  [AUTH_REDUCER_KEY]: ReturnType<typeof reducer>;
}) => state[AUTH_REDUCER_KEY];

export const userSelector = createSelector(authSelector, (state) => state.user);

export const loginInProgressSelector = createSelector(
  authSelector,
  (state) => state.loginInProgress,
);

export const loginErrorSelector = createSelector(
  authSelector,
  (state) => state.loginError,
);

export const loginSelector = createSelector(
  loginInProgressSelector,
  loginErrorSelector,
  (loginInProgress, loginError) => ({
    loginInProgress,
    loginError,
  }),
);

export const authLoadingSelector = createSelector(
  authSelector,
  (state) => state.loading,
);
