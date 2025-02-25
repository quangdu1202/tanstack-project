import { Button } from '../Button';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import React from 'react';

interface PlaybackProps {
  isPlaying: boolean;
  onClick: () => void;
}

const Play = ({ isPlaying, onClick }: PlaybackProps) => {
  return (
    <Button label={isPlaying ? 'Pause' : 'Play'} onClick={onClick}>
      {isPlaying ? <IconPlayerPauseFilled size={20} /> : <IconPlayerPlayFilled size={20} />}
    </Button>
  );
};

export default React.memo(Play);
