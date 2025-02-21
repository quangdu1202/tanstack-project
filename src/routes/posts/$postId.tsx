import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { IconFoldDown, IconWindowMinimize, IconX } from '@tabler/icons-react';
import React, { ComponentRef, useCallback, useEffect, useRef, useState } from 'react';
import PrismaZoom from 'react-prismazoom';

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
});

interface Post {
  id: string;
  author: string;
  download_url: string;
  height: number;
  width: number;
}

function RouteComponent() {
  const { postId } = useParams({ from: '/posts/$postId' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const prismaZoom = useRef<ComponentRef<typeof PrismaZoom>>(null);
  const zoomCounterRef = useRef<HTMLSpanElement>(null);
  const [allowZoom, setAllowZoom] = useState(true);

  useEffect(() => {
    fetch('https://picsum.photos/v2/list')
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  useEffect(() => {
    if (postId) {
      const foundPost = posts.find((p) => p.id === postId);
      setSelectedPost(foundPost || null);
    }
  }, [postId, posts]);

  const onZoomChange = useCallback((zoom: number) => {
    if (!zoomCounterRef.current) return;
    zoomCounterRef.current.innerText = `${Math.round(zoom * 100)}%`;
  }, []);

  const onClickOnZoomOut = () => {
    if (allowZoom) {
      prismaZoom.current?.zoomOut(1);
    }
  };

  const onClickOnZoomIn = () => {
    if (allowZoom) {
      prismaZoom.current?.zoomIn(1);
    }
  };

  const onClickOnLock = () => {
    setAllowZoom((allowZoom) => !allowZoom);
  };

  return (
    <div className="slide-out-wrapper">
      <div className="slide-out-inner">
        <div className={`slide-out-content overflow-x-hidden overflow-y-scroll`}>
          {/* Post Media Container */}
          {selectedPost && (
            <div className="post-media-container bg-surface-a50 flex h-full w-full items-center justify-center overflow-hidden">
              <div className="post-media-zoom-indicator bg-surface-a10 absolute bottom-1 z-50 flex items-center justify-center rounded-2xl p-2 text-white opacity-50 hover:opacity-100">
                <button
                  type={'button'}
                  className="h-6 w-6 cursor-pointer"
                  onClick={onClickOnZoomOut}
                  disabled={!allowZoom}
                >
                  <span className="sr-only">Zoom out</span>
                  <span>-</span>
                </button>

                <span className="post-media-zoom-label" ref={zoomCounterRef}>
                  100%
                </span>

                <button
                  type={'button'}
                  className="h-6 w-6 cursor-pointer"
                  onClick={onClickOnZoomIn}
                  disabled={!allowZoom}
                >
                  <span className="sr-only">Zoom in</span>
                  <span>+</span>
                </button>

                <button type={'button'} className="h-6 w-6 cursor-pointer" onClick={onClickOnLock}>
                  <svg className={allowZoom ? 'fill-current' : 'fill-red-500'} viewBox="0 0 24 24">
                    {!allowZoom ? (
                      <path d="M12 13a1.49 1.49 0 0 0-1 2.61V17a1 1 0 0 0 2 0v-1.39A1.49 1.49 0 0 0 12 13zm5-4V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zM9 7a3 3 0 0 1 6 0v2H9zm9 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1z" />
                    ) : (
                      <path d="M12 13a1.49 1.49 0 0 0-1 2.61V17a1 1 0 0 0 2 0v-1.39A1.49 1.49 0 0 0 12 13zm5-4H9V7a3 3 0 0 1 5.12-2.13 3.08 3.08 0 0 1 .78 1.38 1 1 0 1 0 1.94-.5 5.09 5.09 0 0 0-1.31-2.29A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm1 10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1z" />
                    )}
                  </svg>
                </button>
              </div>

              <div className="post-media-controls">
                <button className="slide-out-trigger-btn" type="button">
                  <span className="sr-only">Hide slide-out modal</span>
                  <IconFoldDown />
                </button>
                <button className="slide-out-trigger-btn" type="button">
                  <span className="sr-only">Minimize slide-out modal</span>
                  <IconWindowMinimize />
                </button>
                <button className="slide-out-trigger-btn" type="button">
                  <span className="sr-only">Close slide-out modal</span>
                  <IconX />
                </button>
              </div>

              {!allowZoom && <div className={`overlay absolute inset-0 z-10`}></div>}

              <div className="post-media">
                <PrismaZoom ref={prismaZoom} onZoomChange={onZoomChange} allowZoom={allowZoom}>
                  <img src={selectedPost.download_url} alt="Selected Post" />
                </PrismaZoom>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="posts-list-container flex flex-wrap justify-evenly">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex h-[300px] w-[320px] items-center justify-center p-4"
              >
                <Link from="/posts" to={post.id}>
                  <img className="max-h-64" src={post.download_url} alt={`Post ${post.id}`} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar"></div>
      </div>
    </div>
  );
}
