import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './BetButtons.module.scss';
import { BetPhase } from '../../../../Config/constants/bets';
import BetButton from './BetButton/BetButton';
import { BetsPhase } from '../../../../Config/constants/gameProcess';
import ChipSelect from '../ChipsSelect/ChipsSelect';

type BetButtonAttributes = {
  betPhase: string;
}

const BetButtons: FC<BetButtonAttributes> = (props: BetButtonAttributes) => {
  const { emitter } = useMitt();
  const { betPhase } = props;
  const [betValue, setBetValue] = useState(0);
  const [enabledBet, setEnableBet] = useState(true);

  useEffect(() => {
    emitter.on(BetsPhase.HeroChoosedBet, (event) => {
      setBetValue(event.value);
      setEnableBet(true);
    });
    setEnableBet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBet = () => {
    emitter.emit(BetsPhase.HeroBet, { value: betValue });
  }

  const onFold = () => {
    emitter.emit(BetsPhase.HeroFold);
  }

  const onCall = () => {
    emitter.emit(BetsPhase.HeroCall, { value: betValue });
  }

  const showChips = () => {
    switch (betPhase) {
        case BetPhase.BET:
            default:
        return (
            <ChipSelect betPhase={betPhase} />
        );
    }
  }

  const showBetButtons = () => {
    switch (betPhase) {
        case BetPhase.CALL:
        return (
            <>
              <BetButton name='Fold' disabled={false} cb={onFold} />
              <BetButton name='Call' disabled={!enabledBet} cb={onCall} />
            </>
        );
        case BetPhase.BET:
            default:
        return (
            <>
              <BetButton name='Fold' disabled={false} cb={onFold} />
              <BetButton name='Bet' disabled={!enabledBet} cb={onBet} />
            </>
        );
    }
  }

  return (
    <div
     className={styles.container}
     >
      {showChips()}
      <div className={styles.buttons}>
        {showBetButtons()}
      </div>
    </div>
  );
}

export default BetButtons;
