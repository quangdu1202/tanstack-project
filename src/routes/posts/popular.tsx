import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/popular')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/posts/popular"!</div>;
}
