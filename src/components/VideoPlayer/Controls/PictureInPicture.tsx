import { Button } from '../Button';
import { IconPictureInPictureOn } from '@tabler/icons-react';
import React from 'react';

const PictureInPicture = () => {
  return (
    <Button label={'Picture In Picture'} onClick={() => {}}>
      <IconPictureInPictureOn size={20} />
    </Button>
  );
};

export default React.memo(PictureInPicture);
