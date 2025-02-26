import { Button as ControlButton } from '../Button';
import { IconVolume, IconVolume2, IconVolume3 } from '@tabler/icons-react';
import React from 'react';

interface VolumeControlProps {
  value: number;
  onClick: () => void;
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const VolumeControl = ({ value, onClick, onChangeValue }: VolumeControlProps) => {
  return (
    <div className="group/volume-control vp-volume relative flex min-w-28 items-center gap-3">
      <ControlButton label={value > 0 ? 'Mute' : 'Unmute'} onClick={onClick}>
        {value === 0 && <IconVolume3 width={20} height={20} />}
        {0 < value && value < 0.5 && <IconVolume2 width={20} height={20} />}
        {value >= 0.5 && <IconVolume width={20} height={20} />}
      </ControlButton>
      <div className="vp-volume__range relative flex h-1.5 w-full max-w-24 items-center opacity-0 transition-opacity duration-200 ease-out group-hover/volume-control:opacity-100">
        <div className="vp-progress__range--background absolute h-full w-full rounded-full bg-gray-700" />
        <div
          className="group vp-progress__range--current relative flex h-full w-full items-center rounded-full bg-red-700"
          style={{ width: `${+(value * 100).toFixed(0)}%` }}
        >
          <div className="vp-progress__range--current__thumb absolute right-0 h-4 w-4 translate-x-1/2 scale-0 transform rounded-full bg-red-700 transition-transform duration-200 ease-out group-hover/volume-control:scale-100" />
        </div>
        <input
          className="vp-progress__range--seek absolute h-full w-full cursor-pointer rounded-full opacity-0"
          type="range"
          value={value}
          max="1"
          step="0.05"
          onChange={onChangeValue}
        />
        <div className="absolute left-full ml-4 cursor-default">{+(value * 100).toFixed(0)}</div>
      </div>
    </div>
  );
};

export default React.memo(VolumeControl);
