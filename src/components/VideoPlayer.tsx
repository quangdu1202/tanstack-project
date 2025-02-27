import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { twMerge } from 'tailwind-merge';
import {
  Rewind,
  Play,
  FastForward,
  Speed,
  PictureInPicture,
  Fullscreen,
  VolumeControl,
  Progress,
} from './VideoPlayer/Controls';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IconX } from '@tabler/icons-react';

interface VideoPlayerUIProps {
  autoPlay: boolean;
  closePip: () => void;
  fastForwardHandler: () => void;
  fullscreenState: boolean;
  inViewRef: React.Ref<HTMLDivElement>;
  isFloating: boolean;
  playbackState: boolean;
  rewindHandler: () => void;
  src: string;
  toggleFloatingHandler: () => void;
  toggleFullscreenHandler: () => void;
  toggleMuteHandler: () => void;
  togglePlayHandler: () => void;
  videoPauseHandler: () => void;
  videoPlayHandler: () => void;
  videoVolumeChangeHandler: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  volume: number;
  volumeInputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayerUI = React.memo(
  ({
    autoPlay,
    closePip,
    fastForwardHandler,
    fullscreenState,
    inViewRef,
    isFloating,
    playbackState,
    rewindHandler,
    src,
    toggleFloatingHandler,
    toggleFullscreenHandler,
    toggleMuteHandler,
    togglePlayHandler,
    videoPauseHandler,
    videoPlayHandler,
    videoVolumeChangeHandler,
    volume,
    volumeInputChangeHandler,
    videoRef,
  }: VideoPlayerUIProps) => {
    return (
      <div ref={inViewRef} className="relative h-full w-full rounded-xl">
        {isFloating && (
          <div className="flex h-full w-full items-center justify-center bg-black text-3xl text-white">
            Playing in picture-in-picture
          </div>
        )}
        <div
          className={twMerge(
            'vp-container relative z-50 flex h-full w-full flex-col bg-black text-white',
            isFloating
              ? 'animate-videoSticky is-floating fixed right-6 bottom-6 h-auto w-[300px] rounded-xl'
              : 'animate-videoInline relative',
          )}
        >
          <button
            type="button"
            onClick={closePip}
            className="absolute top-2 right-2 z-50 hidden cursor-pointer rounded-md bg-black p-1 [.is-floating_&]:block"
          >
            <span className="sr-only">Exit picture in picture</span>
            <IconX size={20} />
          </button>
          <div
            onClick={togglePlayHandler}
            className={twMerge(
              'flex min-h-0 grow items-center justify-center',
              isFloating ? 'rounded-t-xl' : '',
            )}
          >
            <video
              className={twMerge('h-full', isFloating ? 'rounded-t-xl' : '')}
              ref={videoRef}
              src={src}
              controls={false}
              onDoubleClick={toggleFullscreenHandler}
              onPlay={videoPlayHandler}
              onPause={videoPauseHandler}
              onVolumeChange={videoVolumeChangeHandler}
              onError={(e) => console.error('Video error:', e.currentTarget.error)}
            />
          </div>
          <div
            className={twMerge(
              'vp-controls flex flex-col items-center justify-center border-t border-white bg-black px-5 py-2 text-white',
              isFloating ? 'rounded-b-xl' : '',
            )}
          >
            <Progress videoRef={videoRef} autoPlay={autoPlay} />
            <div className="vp-controls__body flex h-1/2 w-full items-center justify-between gap-6">
              <div className="relative flex h-full items-center justify-start gap-1">
                <Play isPlaying={playbackState} onClick={togglePlayHandler} />
                <VolumeControl
                  value={volume}
                  onClick={toggleMuteHandler}
                  onChangeValue={volumeInputChangeHandler}
                />
              </div>
              <div className="flex h-full items-center gap-2">
                <div
                  className={twMerge(
                    'flex gap-1',
                    isFloating
                      ? 'absolute inset-0 m-auto h-0 w-0 items-center justify-center gap-32'
                      : '',
                  )}
                >
                  <Rewind onClick={rewindHandler} />
                  <FastForward onClick={fastForwardHandler} />
                </div>
                <div className="flex gap-1">
                  <Speed videoRef={videoRef} />
                  <PictureInPicture isFloating={isFloating} onClick={toggleFloatingHandler} />
                  <Fullscreen isFullscreen={fullscreenState} onClick={toggleFullscreenHandler} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export function VideoPlayer({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [playbackState, setPlaybackState] = useState(false);
  const [volume, setVolume] = useLocalStorage('videoPlayerVolume', 1);
  const prevVolume = useRef(volume || 1);
  const [fullscreenState, setFullscreenState] = useState(false);
  const [pipIsForceClosed, setPipIsForceClosed] = useState(false);
  const { ref: inViewRef, inView, entry } = useInView({ threshold: [0, 0.5, 1] });

  // Add manual control for floating state
  const [isManuallyFloating, setIsManuallyFloating] = useState(false);

  const isFloating = useMemo(() => {
    const isIntersecting = entry?.isIntersecting;
    const intersectionRatio = entry?.intersectionRatio || 0;

    console.log(
      'isIntersecting',
      isIntersecting,
      'intersectionRatio',
      intersectionRatio,
      'pipIsForceClosed',
      pipIsForceClosed,
      'isManuallyFloating',
      isManuallyFloating,
      'videoRef?.current?.paused',
      videoRef?.current?.paused,
    );

    // if the video is intersecting and intersection ratio is >= 0.5, or pip is force closed or not playing, return false
    if (
      ((isIntersecting && intersectionRatio >= 0.5) ||
        pipIsForceClosed ||
        videoRef?.current?.paused) &&
      !isManuallyFloating
    ) {
      setPipIsForceClosed(false);
      return false;
    }

    // if the video is intersecting and intersection ratio is < 0.5 and pip is not force closed and playing, return true
    if (
      (isIntersecting && intersectionRatio < 0.5) ||
      (!isIntersecting && !pipIsForceClosed && !videoRef?.current?.paused) ||
      isManuallyFloating
    ) {
      return true;
    }

    return false;
  }, [inView, entry, pipIsForceClosed, isManuallyFloating]);

  const closePip = useCallback(() => {
    setPipIsForceClosed(true);
    setIsManuallyFloating(false);
    videoRef.current?.pause();
  }, []);

  const toggleFloatingHandler = useCallback(() => {
    setIsManuallyFloating((prevState) => !prevState);
    if (isFloating) {
      closePip();
    }
  }, [isManuallyFloating]);

  const toggleFullscreenHandler = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    } else {
      videoRef.current!.requestFullscreen().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreenState(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const videoPlayHandler = useCallback(() => setPlaybackState(true), []);
  const videoPauseHandler = useCallback(() => setPlaybackState(false), []);

  const togglePlayHandler = useCallback(() => {
    const video = videoRef.current!;
    if (video.paused || video.ended) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, []);

  const rewindHandler = useCallback(() => {
    videoRef.current!.currentTime -= 5;
  }, []);

  const fastForwardHandler = useCallback(() => {
    videoRef.current!.currentTime += 5;
  }, []);

  const volumeInputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Math.min(1, Math.max(0, +event.target.value));
      const video = videoRef.current!;
      video.volume = newVolume;
      setVolume(newVolume);
    },
    [setVolume],
  );

  const videoVolumeChangeHandler = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      setVolume(video.volume);
      if (video.volume === 0) {
        video.muted = true;
      } else {
        video.muted = false;
        prevVolume.current = video.volume;
      }
    },
    [setVolume],
  );

  const toggleMuteHandler = useCallback(() => {
    const video = videoRef.current!;
    if (video.volume !== 0) {
      prevVolume.current = video.volume;
      video.volume = 0;
      setVolume(0);
    } else {
      video.volume = prevVolume.current;
      setVolume(prevVolume.current);
    }
  }, [setVolume]);

  return (
    <VideoPlayerUI
      autoPlay={autoPlay}
      closePip={closePip}
      fastForwardHandler={fastForwardHandler}
      fullscreenState={fullscreenState}
      inViewRef={inViewRef}
      isFloating={isFloating}
      playbackState={playbackState}
      rewindHandler={rewindHandler}
      src={src}
      toggleFloatingHandler={toggleFloatingHandler}
      toggleFullscreenHandler={toggleFullscreenHandler}
      toggleMuteHandler={toggleMuteHandler}
      togglePlayHandler={togglePlayHandler}
      videoPauseHandler={videoPauseHandler}
      videoPlayHandler={videoPlayHandler}
      videoVolumeChangeHandler={videoVolumeChangeHandler}
      volume={volume}
      volumeInputChangeHandler={volumeInputChangeHandler}
      videoRef={videoRef}
    />
  );
}
