import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = firebase.UserInfo | null;

interface AuthState {
  loading: boolean;
  user: User;
  loginInProgress: boolean;
  loginError: Error | null;
}

export interface LoginFailedPayload {
  error: Error;
}

export interface AuthReadyPayload {
  user: firebase.User | null;
}

const initialState: AuthState = {
  loading: true,
  user: null,
  loginInProgress: false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      if (state.loading || state.user) {
        return;
      }

      state.loginInProgress = true;
    },

    loginFailed(state, action: PayloadAction<LoginFailedPayload>) {
      state.loginInProgress = false;
      state.loginError = action.payload.error;
    },

    authStateChanged(state, action: PayloadAction<AuthReadyPayload>) {
      state.loading = false;
      state.loginInProgress = false;
      state.user = (action.payload.user?.toJSON() as firebase.UserInfo) || null;
    },

    logout() {
      /* creates the logout action that runs logoutSaga */
    },
  },
});

export default authSlice.reducer;
export const AUTH_REDUCER_KEY = 'auth';

const { actions } = authSlice;
export { actions };
