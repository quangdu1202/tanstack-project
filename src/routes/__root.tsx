import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Header from '../components/Header';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <div className={'main'}>
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
