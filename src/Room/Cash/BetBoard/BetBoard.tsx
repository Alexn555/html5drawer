import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './BetBoard.module.scss';
import BetButtons from './BetButtons/BetButtons';
import { BetsPhase, GamePhase } from '../../../Config/constants/gameProcess';
import { MAIN_CONFIG } from '../../../Config/constants/config';
import { DeckEvents } from '../../../Config/constants/events';

const BetBoard: FC = () => {
  const [betPhase] = useState('');
  const { emitter } = useMitt();
  const [disableBoard, setDisableBoard] = useState(false);

  useEffect(() => {
    emitter.on(BetsPhase.HeroBet, () => {
      setDisableBoard(true);
    });
    emitter.on(BetsPhase.HeroFold, () => {
      setDisableBoard(true);
      setTimeout(() => { setDisableBoard(false); }, MAIN_CONFIG.GAME.HERO_FOLD_TIMEOUT);
    });
    emitter.on(GamePhase.NEXT_ROUND, () => {
      setDisableBoard(true);
      setTimeout(() => { setDisableBoard(false); }, MAIN_CONFIG.BETBOARD.START_TIMEOUT);
    });
    emitter.on(GamePhase.ChangeCards, () => {
      setDisableBoard(true);
    });
    emitter.on(DeckEvents.HeroCompletedSwitchCard, () => {
      setDisableBoard(false);
    });
    emitter.on(GamePhase.SecondBetRound, () => {
      setDisableBoard(false);
    });
    emitter.on(GamePhase.Showdown, () => {
      setDisableBoard(true);
    });
    setDisableBoard(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
     className={styles.container}
     >
      &nbsp;
      <BetButtons betPhase={betPhase} />
      {disableBoard ? <div className={styles.disabler}></div> : null}
    </div>
  );
}

export default BetBoard;
