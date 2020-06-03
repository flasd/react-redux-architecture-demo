import React from 'react';

export default function Home(props: any) {
  const { login } = props;

  return (
    <div>
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  );
}
