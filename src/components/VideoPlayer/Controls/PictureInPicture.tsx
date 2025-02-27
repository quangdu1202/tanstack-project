import { Button } from '../Button';
import { IconPictureInPictureOn, IconPictureInPictureOff } from '@tabler/icons-react';
import React from 'react';

interface PictureInPictureProps {
  isFloating: boolean;
  onClick: () => void;
}

const PictureInPicture = ({ isFloating, onClick }: PictureInPictureProps) => {
  return (
    <Button label={isFloating ? 'Exit Picture in Picture' : 'Picture in Picture'} onClick={onClick}>
      {isFloating ? <IconPictureInPictureOff size={20} /> : <IconPictureInPictureOn size={20} />}
    </Button>
  );
};

export default React.memo(PictureInPicture);
