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
  toggleFullscreenHandler: () => void;
  toggleMuteHandler: () => void;
  togglePlayHandler: () => void;
  videoPauseHandler: () => void;
  videoPlayHandler: () => void;
  videoVolumeChangeHandler: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  volume: number;
  volumeInputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
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
            className="flex min-h-0 grow items-center justify-center"
          >
            <video
              className="h-full"
              ref={videoRef}
              src={src}
              controls={false}
              onDoubleClick={toggleFullscreenHandler}
              onPlay={videoPlayHandler}
              onPause={videoPauseHandler}
              onVolumeChange={videoVolumeChangeHandler}
            />
          </div>
          <div className="vp-controls flex flex-col items-center justify-center border-t border-white bg-black px-5 py-2 text-white">
            <Progress ref={videoRef} autoPlay={autoPlay} />
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
                  <Speed />
                  <PictureInPicture />
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState(false);
  const [volume, setVolume] = useLocalStorage('videoPlayerVolume', 1);
  const prevVolume = useRef(1);
  const [fullscreenState, setFullscreenState] = useState(false);
  const [pipIsForceClosed, setPipIsForceClosed] = useState(false);
  const { ref: inViewRef, inView, entry } = useInView({ threshold: [0, 0.5, 1] });

  const isFloating = useMemo(() => {
    if (!entry) return false;
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      setPipIsForceClosed(false);
      return false;
    }
    if (pipIsForceClosed) return false;
    return !videoRef.current?.paused;
  }, [inView, entry, pipIsForceClosed]);

  const closePip = useCallback(() => {
    setPipIsForceClosed(true);
    videoRef.current?.pause();
  }, []);

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

  const volumeInputChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;
    video.volume = +event.target.value;
  }, []);

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
