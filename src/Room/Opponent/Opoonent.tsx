import { FC, useState } from 'react';
import styles from './Opponent.module.scss';
import { useAnimationFrame } from '../../common/hooks/useAnimation';
import OpponentCards from './OpponentCards/OpponentCards';

type PlayerAttributes = {
  name: string;
  stack: number;
  decision: string;
}

const Opponent: FC<PlayerAttributes> = (props: PlayerAttributes) => {
  const { name, stack, decision } = props;
  const [position, setPosition] = useState(0);
  useAnimationFrame(() => {
    setPosition(52);
  });
  return (
    <div 
     className={styles.container}
     style={{
       transform: `translateY(${position}px)`
      }}
    >
       <span>{name}</span>
       <OpponentCards />
       <div className={styles.stack}>{stack > 0 ? stack : 0}</div>
       {decision !== '' ? <div className={styles.decision}>
        {decision}
        </div> : null}
    </div>
  );
}

export default Opponent;
