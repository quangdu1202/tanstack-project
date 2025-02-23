import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Posts List</h1>
      {['post1', 'post2', 'post3'].map((postId) => (
        <ul>
          <li>
            <Link key={postId} from={'/posts'} to={postId}>
              Post {postId}
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
}
