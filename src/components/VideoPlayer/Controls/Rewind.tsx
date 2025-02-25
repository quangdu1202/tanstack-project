import { Button } from '../Button';
import { IconRewindBackward5 } from '@tabler/icons-react';
import React from 'react';

interface RewindProps {
  onClick: () => void;
}

const Rewind = ({ onClick }: RewindProps) => {
  return (
    <Button label={'Rewind 5s'} onClick={onClick}>
      <IconRewindBackward5 size={20} />
    </Button>
  );
};

export default React.memo(Rewind);
