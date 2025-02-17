import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recommended')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/recommended"!</div>;
}
