import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import SlideOut from '../../components/SlideOut';

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return (
    <div>
      <h1>Posts List</h1>
      <ul>
        {['post1', 'post2', 'post3'].map((postId) => (
          <li key={postId}>
            <button onClick={() => setSelectedPostId(postId)}>Open {postId}</button>
          </li>
        ))}
      </ul>

      {/* Slide-Out Component */}
      {selectedPostId && (
        <SlideOut postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      )}
    </div>
  );
}
