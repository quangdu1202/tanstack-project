import React, { useEffect, useRef, useState } from 'react';
import { Rewind } from './VideoPlayer/Buttons/Rewind';
import { Play } from './VideoPlayer/Buttons/Play';
import { FastForward } from './VideoPlayer/Buttons/FastForward';
import { Speed } from './VideoPlayer/Buttons/Speed';
import { PictureInPicture } from './VideoPlayer/Buttons/PictureInPicture';
import { Fullscreen } from './VideoPlayer/Buttons/Fullscreen';
import { VolumeControl } from './VideoPlayer/VolumeControl';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatTime } from './VideoPlayer/helpers/formatTime';
import { Progress } from './VideoPlayer/Progress';

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
  };

  const togglePlayHandler = () => {
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
  };

  const rewindHandler = () => {
    const video = videoRef.current!;

    video.currentTime -= 5;
  };

  const fastForwardHandler = () => {
    const video = videoRef.current!;

    video.currentTime += 5;
  };

  const [volume, setVolume] = useLocalStorage('videoPlayerVolume', 1);
  const prevVolume = useRef(1);

  const volumeInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;
    video.volume = +event.target.value;
  };

  // Handles video element's volume change event
  const videoVolumeChangeHandler = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    setVolume(video.volume);

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      prevVolume.current = video.volume; // Ensure prevVolume is always updated
    }
  };

  // Mute/Unmute Handler
  const toggleMuteHandler = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = prevVolume.current; // Restore previous volume
    } else {
      prevVolume.current = video.volume; // Save current volume before muting
      video.muted = true;
      video.volume = 0;
    }
  };

  const [currentTimeUI, setCurrentTimeUI] = useState('00:00');
  const [remainingTimeUI, setRemainingTimeUI] = useState('00:00');
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);

  const timeChangeHandler = () => {
    const video = videoRef.current!;
    const duration = video.duration || 0;
    const currentTime = video.currentTime || 0;
    const buffer = video.buffered;

    const formattedCurrentTime = formatTime(Math.round(currentTime));
    const formattedRemainedTime = formatTime(Math.round(duration) - Math.round(currentTime));

    setCurrentTimeUI(formattedCurrentTime);
    setRemainingTimeUI(formattedRemainedTime);

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
  };

  const [seekTooltip, setSeekTooltip] = useState('00:00');
  const [seekTooltipPosition, setSeekTooltipPosition] = useState(0);
  const progressSeekData = useRef(0);

  const seekMouseMoveHandler = (event: React.MouseEvent) => {
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
  };

  const seekInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;

    const skipTo = progressSeekData.current || +event.target.value;

    video.currentTime = skipTo;
    setCurrentProgress((skipTo / video.duration) * 100);
    setSeekProgress(skipTo);
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
        onTimeUpdate={timeChangeHandler}
      />
      <div className="vp-controls absolute right-0 bottom-0 left-0 z-20 flex h-24 flex-col items-center justify-center border-t border-white bg-black pb-2.5 text-white">
        <div className="vp-controls__header group flex h-full w-full items-center justify-center px-5">
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
