import withHooks from 'hook-hoc';
import Home from './Home';
import { useActionCreator } from '../../store/actionCreators';

function useHooksAsProps() {
  const login = useActionCreator('auth', 'login');

  return {
    login: () => login && login(),
  };
}

export default withHooks(useHooksAsProps)(Home);
