import React from 'react';
import { Switch, Route } from 'react-router';
import Home from './Home';
import Loading from './Loading';

export default function Screens(props: ScreensProps) {
  const { loading } = props;

  if (loading) {
    return <Loading />;
  }

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/:todoID" exact />
    </Switch>
  );
}

export type ScreensProps = {
  loading: boolean;
};
