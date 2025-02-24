import React from 'react';

interface ProgressProps {
  currentTimeUI: string;
  remainingTimeUI: string;
  videoDuration: number;
  bufferProgress: number;
  currentProgress: number;
  seekProgress: number;
  seekTooltipPosition: number;
  seekTooltip: string;
  onMouseMove: (event: React.MouseEvent) => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Progress = ({
  currentTimeUI,
  remainingTimeUI,
  bufferProgress,
  currentProgress,
  videoDuration,
  seekProgress,
  seekTooltipPosition,
  seekTooltip,
  onMouseMove,
  onSeek,
}: ProgressProps) => {
  return (
    <>
      <time className="vp-time w-20 text-left" dateTime={currentTimeUI}>
        {currentTimeUI}
      </time>
      <div className="vp-progress relative h-full w-full">
        <div className="vp-progress__range relative flex h-full w-full items-center">
          <div className="vp-progress__range--background absolute h-1.5 w-full rounded-full bg-gray-700" />
          <div
            className="vp-progress__range--buffer absolute h-1.5 w-full rounded-full bg-red-400 transition-[width] duration-200"
            style={{ width: `${+bufferProgress.toFixed(0)}%` }}
          />
          <div
            className="vp-progress__range--current group relative flex h-1.5 w-full items-center rounded-full bg-red-700"
            style={{ width: `${+currentProgress.toFixed(0)}%` }}
          >
            <div className="vp-progress__range--current__thumb absolute right-0 h-4 w-4 translate-x-1/2 scale-0 transform rounded-full bg-red-700 transition-transform duration-200 ease-out group-hover:scale-100" />
            <span
              className="vp-progress__tooltip pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 transform rounded-md border border-white bg-gray-950 px-3 py-1 text-sm font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ transform: `translateX(${+seekTooltipPosition}px)` }}
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
            onMouseMove={onMouseMove}
            onChange={onSeek}
          />
        </div>
      </div>
      <time className="vp-time w-20 text-right" dateTime={remainingTimeUI}>
        {remainingTimeUI}
      </time>
    </>
  );
};
