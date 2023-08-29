import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './ChipsSelect.module.scss';
import { BetPhase, Bets } from '../../../../Config/constants/bets';
import Chip from './Chip/Chip';
import { BetsPhase, GamePhase } from '../../../../Config/constants/gameProcess';

type BetButtonAttributes = {
  betPhase: string;
}
 
const ChipSelect: FC<BetButtonAttributes> = (props: BetButtonAttributes) => {
  const { emitter } = useMitt();
  const { betPhase } = props;
  const [selectedBet, setSelectBet] = useState('');

  useEffect(() => {
    emitter.on(GamePhase.NEXT_ROUND, () => {
      reset();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChipSelectA = () => {
    setSelectBet(Bets[0].name);
    emitter.emit(BetsPhase.HeroChoosedBet, { value: Bets[0].value });
  }

  const onChipSelectB = () => {
    setSelectBet(Bets[1].name);
    emitter.emit(BetsPhase.HeroChoosedBet, { value: Bets[1].value });
  }

  const onChipSelectC = () => {
    setSelectBet(Bets[2].name);
    emitter.emit(BetsPhase.HeroChoosedBet, { value: Bets[2].value });
  }

  const reset = () => {
    setSelectBet('');
  }

  const showChipsSelects = () => {
    switch (betPhase) {  
        case BetPhase.BET:
            default:
        return (
            <>
              <Chip name={Bets[0].name} value={Bets[0].value} selected={selectedBet} disabled={false} cb={onChipSelectA} />
              <Chip name={Bets[1].name} value={Bets[1].value} selected={selectedBet} disabled={false} cb={onChipSelectB} />
              <Chip name={Bets[2].name} value={Bets[2].value} selected={selectedBet} disabled={false} cb={onChipSelectC} />
            </>
        );
    }
  }

  return (
    <div
     className={styles.container}
     >
      <div className={styles.buttons}>
        {showChipsSelects()}
      </div>
    </div>
  );
}

export default ChipSelect;
