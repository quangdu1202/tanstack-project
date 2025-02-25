import { Button } from '../Button';
import { IconMultiplier1x } from '@tabler/icons-react';
import React from 'react';

export const Speed = () => {
  return (
    <Button label={'Speed'} onClick={() => {}}>
      <IconMultiplier1x size={30} />
    </Button>
  );
};

export default React.memo(Speed);
