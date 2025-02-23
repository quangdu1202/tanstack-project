import { Button } from '../Button';
import { IconRewindForward5 } from '@tabler/icons-react';

interface RewindProps {
  onClick: () => void;
}

export const FastForward = ({ onClick }: RewindProps) => {
  return (
    <Button label={'FastForward 5s'} onClick={onClick}>
      <IconRewindForward5 size={20} />
    </Button>
  );
};
