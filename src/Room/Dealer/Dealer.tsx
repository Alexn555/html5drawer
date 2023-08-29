import { FC, useState } from 'react';
import styles from './Dealer.module.scss';
import { useAnimationFrame } from '../../common/hooks/useAnimation';

type PlayerAttributes = {
  name: string;
}

const Dealer: FC<PlayerAttributes> = (props: PlayerAttributes) => {
  const [position, setPosition] = useState(0);
  useAnimationFrame(() => {
    setPosition(52);
  })
  return (
    <div 
     className={styles.container}
     style={{
       transform: `translateY(${position}px)`
      }}
    >
       <span>{props.name} Dealer</span>
    </div>
  );
}

export default Dealer;
