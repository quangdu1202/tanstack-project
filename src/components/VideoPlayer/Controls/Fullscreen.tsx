import { Button } from '../Button';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';
import React from 'react';

interface FullscreenProps {
  isFullscreen: boolean;
  onClick: () => void;
}

const Fullscreen: React.FC<FullscreenProps> = ({ isFullscreen, onClick }) => {
  return (
    <Button label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={onClick}>
      {isFullscreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
    </Button>
  );
};

export default React.memo(Fullscreen);
