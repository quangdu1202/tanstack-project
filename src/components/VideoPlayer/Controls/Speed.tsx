import { Button } from '../Button';
import {
  IconMultiplier05x,
  IconMultiplier1x,
  IconMultiplier15x,
  IconMultiplier2x,
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const speedOptions = [
  { value: 0.5, icon: IconMultiplier05x, label: '0.5x' },
  { value: 1, icon: IconMultiplier1x, label: '1x' },
  { value: 1.5, icon: IconMultiplier15x, label: '1.5x' },
  { value: 2, icon: IconMultiplier2x, label: '2x' },
];

interface SpeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const Speed = ({ videoRef }: SpeedProps) => {
  const [speed, setSpeed] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get the current icon based on selected speed
  const CurrentIcon =
    speedOptions.find((option) => option.value === speed)?.icon || IconMultiplier1x;

  // Handle speed change
  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = newSpeed;
      }
      setSpeed(newSpeed);
      setIsOpen(false);
    },
    [videoRef],
  );

  // Toggle dropdown menu
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update component when video speed changes externally
  useEffect(() => {
    const handleRateChange = () => {
      if (videoRef.current) {
        setSpeed(videoRef.current.playbackRate);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ratechange', handleRateChange);
    }

    return () => {
      if (video) {
        video.removeEventListener('ratechange', handleRateChange);
      }
    };
  }, [videoRef]);

  return (
    <div className="relative" ref={menuRef}>
      <Button label="Speed" onClick={toggleMenu}>
        <CurrentIcon size={30} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 flex flex-col rounded-md bg-black p-1 shadow-lg">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSpeedChange(option.value)}
              className={twMerge(
                'flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-700',
                speed === option.value ? 'bg-gray-800 font-bold' : 'bg-transparent',
              )}
            >
              <option.icon size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(Speed);
