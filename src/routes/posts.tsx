import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/posts')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Renders posts.index.tsx OR posts.$postId.tsx */}
      {/* Ensures that both the post list and the slide-out can coexist */}
      <Outlet />
    </>
  );
}
