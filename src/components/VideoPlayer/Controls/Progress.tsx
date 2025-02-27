import React, { useCallback, useEffect, useState } from 'react';
import { debounce, formatTime } from '../helpers';

interface ProgressProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
}

const Progress = ({ videoRef, autoPlay }: ProgressProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);
  const [seekTooltip, setSeekTooltip] = useState('00:00');
  const [seekTooltipPosition, setSeekTooltipPosition] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const video = videoRef.current;

  // Handle time updates with debouncing
  const handleTimeUpdate = useCallback(() => {
    if (!video) return;
    const currentTime = video.currentTime;
    const duration = video.duration;
    setSeekProgress(currentTime);
    setCurrentProgress((currentTime / duration) * 100 || 0);

    const buffer = video.buffered;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer.start(buffer.length - 1 - i) <= currentTime) {
        setBufferProgress((buffer.end(buffer.length - 1 - i) / duration) * 100 || 0);
        break;
      }
    }
  }, [video]);

  const debouncedTimeUpdate = useCallback(debounce(handleTimeUpdate, 100), [handleTimeUpdate]);

  // Initialize and listen to video events
  useEffect(() => {
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setSeekProgress(video.currentTime);
      setCurrentProgress((video.currentTime / video.duration) * 100 || 0);

      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', debouncedTimeUpdate);

    if (video.duration) handleLoadedMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', debouncedTimeUpdate);
    };
  }, [video, debouncedTimeUpdate]);

  // Throttle seek tooltip updates
  const throttledSeekMouseMoveHandler = useCallback(
    (event: React.MouseEvent) => {
      if (!video) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const skipTo = (event.nativeEvent.offsetX / rect.width) * video.duration;
      const clampedSkipTo = Math.min(Math.max(skipTo, 0), video.duration);
      setSeekTooltip(formatTime(Math.round(clampedSkipTo)));
      setSeekTooltipPosition(event.nativeEvent.offsetX);
    },
    [video],
  );

  // Handle seeking
  const seekInputHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!video) return;
      const newTime = +event.target.value;
      video.currentTime = newTime; // Update video directly
      setSeekProgress(newTime);
      setCurrentProgress((newTime / videoDuration) * 100 || 0);
    },
    [video, videoDuration],
  );

  // Derive time UI from video state
  const currentTimeUI = formatTime(Math.round(seekProgress));
  const endTimeUI = formatTime(Math.round(videoDuration));

  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      <time className="vp-time min-w-14 text-left" dateTime={currentTimeUI}>
        {currentTimeUI}
      </time>
      <div className="vp-progress group relative h-full w-full">
        <div className="vp-progress__range relative flex h-full w-full items-center">
          <div className="vp-progress__range--background absolute h-1.5 w-full rounded-full bg-gray-700" />
          <div
            className="vp-progress__range--buffer absolute h-1.5 w-full rounded-full bg-red-400 transition-[width] duration-200"
            style={{ width: `${bufferProgress}%` }}
          />
          <div
            className="vp-progress__range--current relative flex h-1.5 w-full items-center rounded-full bg-red-700"
            style={{ width: `${currentProgress}%` }}
          >
            <div className="vp-progress__range--current__thumb absolute right-0 h-4 w-4 translate-x-1/2 scale-0 transform rounded-full bg-red-700 transition-transform duration-200 ease-out group-hover:scale-100" />
            <span
              className="vp-progress__tooltip pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 transform rounded-md border border-white bg-gray-950 px-3 py-1 text-sm font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ transform: `translateX(${seekTooltipPosition}px)` }}
            >
              {seekTooltip}
            </span>
          </div>
          <input
            className="vp-progress__range--seek absolute h-full w-full cursor-pointer rounded-full opacity-0"
            type="range"
            step="any"
            max={videoDuration}
            value={seekProgress}
            onMouseMove={throttledSeekMouseMoveHandler}
            onChange={seekInputHandler}
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={videoDuration}
            aria-valuenow={seekProgress}
            role="slider"
          />
        </div>
      </div>
      <time className="vp-time min-w-14 text-right" dateTime={endTimeUI}>
        {endTimeUI}
      </time>
    </div>
  );
};

export default Progress;
