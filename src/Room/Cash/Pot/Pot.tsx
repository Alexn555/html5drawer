import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './Pot.module.scss';
import { BetsPhase, GamePhase } from '../../../Config/constants/gameProcess';
import { MAIN_CONFIG } from '../../../Config/constants/config';

type PlayerAttributes = {
  amount: number;
}

const Pot: FC<PlayerAttributes> = (props: PlayerAttributes) => {
  const { emitter } = useMitt();
  const { amount } = props;
  const [opacity, setOpacity] = useState(0);
  const [positionCl, setPositionCl] = useState<any>(styles.start);

  useEffect(() => {
    emitter.on(BetsPhase.HeroBet, () => {
      setOpacity(1);
    });
    emitter.on(BetsPhase.OpponentCall, () => {
      setOpacity(1);
    });
    emitter.on(BetsPhase.OpponentFold, () => {
      setOpacity(1);
      setPositionCl(styles.toHero);
    });
    emitter.on(BetsPhase.HeroFold, () => {
      setOpacity(1);
      setPositionCl(styles.toOpponent);
    });
    emitter.on(GamePhase.NEXT_ROUND, () => {
      setOpacity(0);
      setPositionCl(styles.start);
    });
    emitter.on(GamePhase.HeroWinRound, () => {
      setOpacity(1);
      setTimeout(() => {
        setPositionCl(styles.toHero);
      }, MAIN_CONFIG.POT.GIVE_TO_PLAYER_WIN);
    });
    emitter.on(GamePhase.OpponentWinRound, () => {
      setOpacity(1);
      setTimeout(() => {
        setPositionCl(styles.toOpponent);
      }, MAIN_CONFIG.POT.GIVE_TO_PLAYER_WIN);
    });
    emitter.on(BetsPhase.HeroFold, () => {
      setOpacity(1);
      setPositionCl(styles.toOpponent);
    });
    setPositionCl(styles.start);
    setOpacity(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
     className={`${styles.container}`}
    >
      <div className={`${styles.pot} ${positionCl}`}
       style={{ opacity: opacity }}
      >
        {amount > -1 ? 
        <span style={{ 
          transform: `translateX(${amount > 0 ? -20: 0}px)`}}
        >
          {amount}
        </span> : null}
      </div>
    </div>
  );
}

export default Pot;
