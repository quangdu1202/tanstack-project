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
import { formatTime } from './VideoPlayer/helpers/formatTime';
import { IconX } from '@tabler/icons-react';

export function VideoPlayer({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState(false);
  const playPromise = useRef<Promise<void> | null>(null);
  const [volume, setVolume] = useLocalStorage('videoPlayerVolume', 1);
  const prevVolume = useRef(1);
  const [currentTimeUI, setCurrentTimeUI] = useState('00:00');
  const [remainingTimeUI, setRemainingTimeUI] = useState('00:00');
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);
  const [seekTooltip, setSeekTooltip] = useState('00:00');
  const [seekTooltipPosition, setSeekTooltipPosition] = useState(0);
  const progressSeekData = useRef(0);
  const [fullscreenState, setFullscreenState] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [pipIsForceClosed, setPipIsForceClosed] = useState(false);
  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: [0, 1],
  });

  /* Khi video ra khoi viewport > Chuyen sang mini play (PIP) */
  /* Van de la khi vao che do PIP, video lai hien thi trong viewport nen bi infinite loop */
  /* Can luu y set ref cua useInView la wrapper boc ngoai videoContainerRef */

  const isFloating = useMemo(() => {
    console.log(inView, entry?.isIntersecting, entry?.intersectionRatio, pipIsForceClosed);
    if (!entry) return false;
    if (entry.isIntersecting && entry.intersectionRatio) {
      setPipIsForceClosed(false);
      return false;
    }
    if (pipIsForceClosed) return false;
    return !videoRef.current?.paused;
  }, [inView, entry, pipIsForceClosed]);

  const closePip = () => {
    setPipIsForceClosed(true);
    videoRef.current?.pause();
  };

  const toggleFullscreenHandler = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    } else {
      videoContainerRef.current!.requestFullscreen().catch(console.error);
    }
  };

  const fullscreenChangeHandler = () => {
    if (document.fullscreenElement) {
      setFullscreenState(true);
    } else {
      setFullscreenState(false);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  const timeChangeHandler = useCallback(() => {
    const video = videoRef.current!;
    const duration = video.duration || 0;
    const currentTime = video.currentTime || 0;
    const buffer = video.buffered;

    setCurrentProgress((currentTime / duration) * 100);
    setSeekProgress(currentTime);

    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < video.currentTime
        ) {
          setBufferProgress((buffer.end(buffer.length - 1 - i) / duration) * 100);
          break;
        }
      }
    }

    const formattedCurrentTime = formatTime(Math.round(currentTime));
    const formattedRemainedTime = formatTime(Math.round(duration) - Math.round(currentTime));

    setCurrentTimeUI(formattedCurrentTime);
    setRemainingTimeUI(formattedRemainedTime);
  }, []);

  const seekMouseMoveHandler = useCallback((event: React.MouseEvent) => {
    const video = videoRef.current!;

    const rect = event.currentTarget.getBoundingClientRect();
    const skipTo = (event.nativeEvent.offsetX / rect.width) * video.duration;

    progressSeekData.current = skipTo;

    let formattedTime: string;

    if (skipTo > video.duration) {
      formattedTime = formatTime(video.duration);
    } else if (skipTo < 0) {
      formattedTime = '00:00';
    } else {
      formattedTime = formatTime(skipTo);
      setSeekTooltipPosition(event.nativeEvent.offsetX);
    }

    setSeekTooltip(formattedTime);
  }, []);

  const seekInputHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;

    const skipTo = progressSeekData.current || +event.target.value;

    video.currentTime = skipTo;
    setCurrentProgress((skipTo / video.duration) * 100);
    setSeekProgress(skipTo);
  }, []);

  const videoPlayHandler = useCallback(() => {
    setPlaybackState(true);
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackState(false);
  }, []);

  const videoLoadedHandler = useCallback(() => {
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);

    const video = videoRef.current!;

    video.volume = volume;

    if (autoPlay) {
      console.log('autoPlay');
      playPromise.current = video.play().catch((error) => {
        console.error('AutoPlay failed:', error);
        playPromise.current = null; // Reset if play fails
      });
    }

    setVideoDuration(video.duration);
    timeChangeHandler();
  }, [autoPlay, volume, timeChangeHandler, fullscreenChangeHandler]);

  const togglePlayHandler = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      playPromise.current = video.play().catch((error) => {
        console.error('Video play failed:', error);
        playPromise.current = null;
      });
    } else {
      video.pause();
      playPromise.current = null;
    }
  }, []);

  const rewindHandler = useCallback(() => {
    const video = videoRef.current!;

    video.currentTime -= 5;
  }, []);

  const fastForwardHandler = useCallback(() => {
    const video = videoRef.current!;

    video.currentTime += 5;
  }, []);

  const volumeInputChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;
    video.volume = +event.target.value;
  }, []);

  // Handles video element's volume change event
  const videoVolumeChangeHandler = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      setVolume(video.volume);

      if (video.volume === 0) {
        video.muted = true;
      } else {
        video.muted = false;
        prevVolume.current = video.volume; // Ensure prevVolume is always updated
      }
    },
    [setVolume],
  );

  // Mute/Unmute Handler
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

  console.log('re-render');

  return (
    <div ref={inViewRef} className="relative h-full w-full rounded-xl">
      {isFloating && (
        <div className="flex h-full w-full items-center justify-center bg-black text-3xl text-white">
          Playing in picture-in-picture
        </div>
      )}
      <div
        ref={videoContainerRef}
        className={twMerge(
          'vp-container relative z-50 flex h-full w-full flex-col bg-black text-white',
          isFloating
            ? 'animate-videoSticky is-floating fixed right-6 bottom-6 h-auto w-[300px] rounded-xl'
            : 'animate-videoInline relative',
        )}
      >
        <button
          type={'button'}
          onClick={closePip}
          className="absolute top-2 right-2 z-50 hidden cursor-pointer rounded-md bg-black p-1 [.is-floating_&]:block"
        >
          <span className="sr-only">Exit picture in picture</span>
          <IconX size={20} />
        </button>
        <div className="flex min-h-0 grow items-center justify-center">
          <video
            className="h-full"
            ref={videoRef}
            src={src}
            controls={false}
            onCanPlay={videoLoadedHandler}
            onClick={togglePlayHandler}
            onDoubleClick={toggleFullscreenHandler}
            onPlay={videoPlayHandler}
            onPause={videoPauseHandler}
            onVolumeChange={videoVolumeChangeHandler}
            onTimeUpdate={timeChangeHandler}
          />
        </div>
        <div className="vp-controls flex flex-col items-center justify-center border-t border-white bg-black px-5 py-2 text-white">
          <div className="vp-controls__header group flex h-full w-full items-center justify-center">
            <Progress
              currentTimeUI={currentTimeUI}
              remainingTimeUI={remainingTimeUI}
              bufferProgress={bufferProgress}
              currentProgress={currentProgress}
              videoDuration={videoDuration}
              seekProgress={seekProgress}
              seekTooltipPosition={seekTooltipPosition}
              seekTooltip={seekTooltip}
              onMouseMove={seekMouseMoveHandler}
              onSeek={seekInputHandler}
            />
          </div>
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
              <div className="flex gap-1">
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
}
