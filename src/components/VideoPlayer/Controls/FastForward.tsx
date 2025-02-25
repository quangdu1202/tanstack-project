import { Button } from '../Button';
import { IconRewindForward5 } from '@tabler/icons-react';
import React from 'react';

interface RewindProps {
  onClick: () => void;
}

const FastForward = ({ onClick }: RewindProps) => {
  return (
    <Button label={'FastForward 5s'} onClick={onClick}>
      <IconRewindForward5 size={20} />
    </Button>
  );
};

export default React.memo(FastForward);
