import { Button } from '../Button';
import { IconRewindBackward5 } from '@tabler/icons-react';

interface RewindProps {
  onClick: () => void;
}

export const Rewind = ({ onClick }: RewindProps) => {
  return (
    <Button label={'Rewind 5s'} onClick={onClick}>
      <IconRewindBackward5 size={20} />
    </Button>
  );
};
