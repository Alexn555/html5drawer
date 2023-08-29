import { FC } from 'react';
import styles from './BetButton.module.scss';

type BetButtonAttributes = {
  name: string;
  disabled: boolean;
  cb: Function
}

const BetButton: FC<BetButtonAttributes> = (props: BetButtonAttributes) => {
  const { name, cb, disabled = false } = props;

  return (
    <button
     className={styles.button}
     disabled={disabled}
     onClick={(e) => { 
        e.stopPropagation();
        cb(); 
      }}
    >
      {name}
    </button>
  );
}

export default BetButton;
