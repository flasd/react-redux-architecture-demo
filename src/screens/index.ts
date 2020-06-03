import { useSelector } from 'react-redux';
import withHooks from 'hook-hoc';
import { useEffect } from 'react';
import {
  authLoadingSelector,
  userSelector,
  loginInProgressSelector,
} from '../store/modules/auth/selectors';
import Screens, { ScreensProps } from './Screens';
import { useActionCreator } from '../store/actionCreators';

function useHooksAsProps() {
  const authLoading = useSelector(authLoadingSelector);
  const loginInProgress = useSelector(loginInProgressSelector);
  const user = useSelector(userSelector);
  const login = useActionCreator('auth', 'login');

  useEffect(() => {
    if (!authLoading && !loginInProgress && !user) {
      login();
    }
  }, [authLoading, login, loginInProgress, user]);

  return {
    loading: loginInProgress || authLoading,
  };
}

export default withHooks(useHooksAsProps)(Screens as React.SFC<ScreensProps>);
