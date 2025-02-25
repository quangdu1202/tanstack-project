import { Button } from '../Button';
import { IconViewportWide } from '@tabler/icons-react';
import React from 'react';

export const TheaterMode = () => {
  return (
    <Button label={'TheaterMode'} onClick={() => {}}>
      <IconViewportWide size={20} />
    </Button>
  );
};

export default React.memo(TheaterMode);
