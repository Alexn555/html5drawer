import { FC, useState } from 'react';
import styles from './Hero.module.scss';
import { useAnimationFrame } from '../../common/hooks/useAnimation';
import HeroCards from './HeroCards/HeroCards';
import BetBoard from '../Cash/BetBoard/BetBoard';

type PlayerAttributes = {
  name: string;
  stack: number;
}

const Hero: FC<PlayerAttributes> = (props: PlayerAttributes) => {
  const { name, stack } = props;
  const [position, setPosition] = useState(0);
  const [isVisLabel] = useState(false);
  useAnimationFrame(() => {
    setPosition(-40);
  });
  return (
    <div
     className={styles.container}
     style={{
      transform: `translateY(${position}px)`
      }}
     >
      {isVisLabel ? <span>{name}</span> : null}
      <HeroCards />
      <BetBoard />
      <div className={styles.stack}>
        {stack > 0 ? stack : 0}
      </div>
    </div>
  );
}

export default Hero;
