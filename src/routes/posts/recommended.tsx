import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/recommended')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/posts/recommended"!</div>;
}
