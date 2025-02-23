import React, { useEffect, useRef, useState } from 'react';
import { Rewind } from './VideoPlayer/Buttons/Rewind';
import { Play } from './VideoPlayer/Buttons/Play';
import { FastForward } from './VideoPlayer/Buttons/FastForward';
import { Speed } from './VideoPlayer/Buttons/Speed';
import { PictureInPicture } from './VideoPlayer/Buttons/PictureInPicture';
import { Fullscreen } from './VideoPlayer/Buttons/Fullscreen';
import { Button as ControlButton } from './VideoPlayer/Button';
import { IconVolume } from '@tabler/icons-react';
import { VolumeControl } from './VideoPlayer/VolumeControl';

export function VideoPlayer({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState(false);
  const playPromise = useRef<Promise<void> | null>(null);

  const videoPlayHandler = () => {
    setPlaybackState(true);
  };

  const videoPauseHandler = () => {
    setPlaybackState(false);
  };

  const videoLoadedHandler = () => {
    const video = videoRef.current!;

    if (autoPlay) {
      console.log('autoPlay');
      playPromise.current = video.play().catch((error) => {
        console.error('AutoPlay failed:', error);
        playPromise.current = null; // Reset if play fails
      });
    }
  };

  const togglePlayHandler = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      // Start playing and store the promise
      playPromise.current = video.play().catch((error) => {
        console.error('Video play failed:', error);
        playPromise.current = null; // Reset if play fails
      });
    } else {
      // If the video is playing, we try to pause
      if (playPromise.current) {
        playPromise.current.then(() => {
          if (!video.paused) {
            video.pause();
            playPromise.current = null; // Reset after pausing
          }
        });
      } else {
        // If there's no pending promise, pause immediately
        video.pause();
        playPromise.current = null;
      }
    }
  };

  const rewindHandler = () => {
    const video = videoRef.current!;

    video.currentTime -= 5;
  };

  const fastForwardHandler = () => {
    const video = videoRef.current!;

    video.currentTime += 5;
  };

  const [volume, setVolume] = useState(0);

  const volumeInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Number(event.target.value) / 100;
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setVolume(newVolume * 100);
  };

  // This handles video element's volume change event
  const videoVolumeChangeHandler = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    setVolume(video.muted ? 0 : video.volume * 100);
  };

  // Mute/Unmute Handler
  const toggleMuteHandler = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setVolume(video.muted ? 0 : video.volume * 100);
  };

  return (
    <div className="vp-container relative flex h-full w-full flex-col justify-center overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        src={src}
        controls={false}
        onPlay={videoPlayHandler}
        onPause={videoPauseHandler}
        onCanPlay={videoLoadedHandler}
        onVolumeChange={videoVolumeChangeHandler}
      />
      <div className="vp-controls absolute right-0 bottom-0 left-0 z-20 flex h-24 flex-col items-center justify-center border-t border-white bg-black pb-2.5 text-white">
        <div className="vp-controls__header group flex h-full w-full items-center justify-center px-5">
          <time className="vp-time w-20 text-left" dateTime="00:00">
            16:00:00
          </time>
          <div className="vp-progress relative h-1.5 w-full">
            <div className="vp-progress__range relative flex h-full w-full items-center">
              <div className="vp-progress__range--background absolute h-full w-full rounded-full bg-gray-700" />
              <div className="vp-progress__range--buffer absolute h-full w-full rounded-full bg-red-400 transition-[width] duration-200" />
              <div className="vp-progress__range--current group relative flex h-full w-full items-center rounded-full bg-red-700">
                <div className="vp-progress__range--current__thumb absolute right-0 h-4 w-4 translate-x-1/2 scale-0 transform rounded-full bg-red-700 transition-transform duration-200 ease-out group-hover:scale-100" />
              </div>
              <input
                className="vp-progress__range--seek absolute h-full w-full cursor-pointer rounded-full opacity-0"
                type="range"
                step="any"
              />
            </div>
            <span className="vp-progress__tooltip pointer-events-none absolute bottom-10 -translate-x-1/2 transform rounded-md bg-gray-950 px-3 py-2 font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              00:00
            </span>
          </div>
          <time className="vp-time w-20 text-right" dateTime="00:00">
            00:00
          </time>
        </div>
        <div className="vp-controls__body flex h-1/2 w-full items-center justify-between gap-6 px-5">
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
              <Fullscreen />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
