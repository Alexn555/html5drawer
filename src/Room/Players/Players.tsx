import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';
import { deductFromStack } from '../../common/services/math';
import Hero from '../Hero/Hero';
import Opponent from '../Opponent/Opoonent';
import styles from './Players.module.scss';
import { GamePhase, BetsPhase, CountEvent } from '../../Config/constants/gameProcess';
import Dealer from '../Dealer/Dealer';
import { MAIN_CONFIG } from '../../Config/constants/config';
import OpponentAI from '../../common/services/opponent';
import { excludeDublicate } from '../../common/services/eventHelper';
import { OpponentDecision } from '../../Config/constants/bets';
import Pot from '../Cash/Pot/Pot';

type PlayerAttributes = {
  gamePhase: React.RefObject<GamePhase>;
}

const Players: FC<PlayerAttributes> = (props: PlayerAttributes) => {
  const { emitter } = useMitt();
  const { gamePhase } = props;
  const opponentAI = OpponentAI.getInstance();
  const decisionTime = MAIN_CONFIG.OPPONENT.DECISION_TIME;
  const [isDealerVis] = useState(false);
  const [oppDecision, setOppDecision] = useState('');
  const [isOpponentVis, setOpponentVis] = useState(false);
  const [isHeroVis, setHeroVis] = useState(false);
  const playersChangedCards = useRef<number>(0);
  const playersMovedSecondRound = useRef<number>(0);
  const PLAYER_AMOUNT = MAIN_CONFIG.PLAYER_AMOUNT;
  const [, setforceUpdate] = useState(Date.now());

  const [potVis, setPotVis] = useState(false);
  const potAmountRef = useRef<number>(0);
  const heroStack = useRef<number>(MAIN_CONFIG.PLAYER_INIT_STACK.HERO);
  const opponentStack = useRef<number>(MAIN_CONFIG.PLAYER_INIT_STACK.OPPONENT);
  const isDblEvent = useRef<boolean>(false);

  useEffect(() => {
    if (MAIN_CONFIG.INTRO_ENABLED) {
        emitter.on(GamePhase.START_GAME, () => {
          startRound();
        });
    } else {
      startRound();
    }
    emitter.on(GamePhase.NEXT_ROUND, () => {
      preventDoubleEvent(() => {
        restart();
      });
    });
    emitter.on(GamePhase.ChangeCards, () => {
      setPlayerBets(0, false);
    });
    emitter.on(GamePhase.SecondBetRound, () => {
      setPlayerBets(0, false);
    });
    emitter.on(CountEvent.PLAYER_SECOND_BET, () => {
      setPlayerBets(1, true);
      allBetCompleted();
    });

    // actions
    emitter.on(BetsPhase.HeroBet, (event) => {
      preventDoubleEvent(() => {
        potAmountRef.current += event.value;
        setHeroStack(deductFromStack(heroStack.current, event.value));
        makeOpponentDecision(GamePhase.HeroBet, event.value);
        emitter.emit(CountEvent.PLAYER_SECOND_BET);
      });
    });
    emitter.on(BetsPhase.HeroCall, (event) => {
      setHeroStack(deductFromStack(heroStack.current, event.value));
    });
    emitter.on(BetsPhase.HeroFold, () => {
      emitter.emit(GamePhase.OpponentWinRound);
    });
    emitter.on(BetsPhase.OpponentCall, (event) => {   
      preventDoubleEvent(() => {
        setOpponentStack(deductFromStack(opponentStack.current, event.value));
        // change cards
        if (gamePhase.current === GamePhase.Start) {
          emitter.emit(GamePhase.ChangeCards);
        }
        if (gamePhase.current === GamePhase.SecondBetRound) {
          emitter.emit(CountEvent.PLAYER_SECOND_BET);
        }
      });    
    });
    emitter.on(BetsPhase.OpponentBet, (event) => {
      emitter.emit(CountEvent.PLAYER_SECOND_BET);
      setOpponentStack(deductFromStack(opponentStack.current, event.value));
    });
    emitter.on(BetsPhase.OpponentFold, () => {
      emitter.emit(GamePhase.HeroWinRound);
    });

    emitter.on(GamePhase.HeroWinRound, () => {
      preventDoubleEvent(() => {
        setHeroStack(heroStack.current + potAmountRef.current);
        setTimeout(() => {
          emitter.emit(GamePhase.NEXT_ROUND);
        }, MAIN_CONFIG.GAME.RESTART_ROUND_TIMEOUT);
      });
    });
    emitter.on(GamePhase.OpponentWinRound, () => {
      preventDoubleEvent(() => {
        setOpponentStack(opponentStack.current + potAmountRef.current);
        setTimeout(() => {
          emitter.emit(GamePhase.NEXT_ROUND);
        }, MAIN_CONFIG.GAME.RESTART_ROUND_TIMEOUT);
      });
    });

    return () => {
      emitter.off(BetsPhase.HeroBet, () => {});
      emitter.off(BetsPhase.OpponentCall, () => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeOpponentDecision = (phase: string, playerBet: number) => {
    setTimeout(() => {
      setEventDblPrevention(false);
      switch(phase) {
        case GamePhase.HeroBet: // opponent fold or call
          default:
          const shouldFold = opponentAI.fold(opponentStack.current);
          if (shouldFold) {
            emitter.emit(BetsPhase.OpponentFold);
            createDecisionLabel(OpponentDecision.FOLD);
          } else {
            emitter.emit(BetsPhase.OpponentCall, { value: playerBet });
            potAmountRef.current += playerBet;
            createDecisionLabel(OpponentDecision.CALL);
            setPlayerBets(1, true);
          }
        break;
      }
      createDecisionLabel('', 2000);
    }, decisionTime);
  }

  const allBetCompleted = () => {
    if (gamePhase.current === GamePhase.SecondBetRound && 
      playersMovedSecondRound.current >= PLAYER_AMOUNT) {
      emitter.emit(GamePhase.Showdown);
    }
  }

  const preventDoubleEvent = (cb: Function) => {
    excludeDublicate(isDblEvent.current, () => {
      cb();
      setEventDblPrevention(true);
    }, () => { setEventDblPrevention(false); });
  }

  const setEventDblPrevention = (toggle: boolean) => {
    isDblEvent.current = toggle;
  }

  const setPlayerBets = (value: number, isAddition = false) => {
    playersMovedSecondRound.current = isAddition ? playersMovedSecondRound.current + value : value;
  }

  const createDecisionLabel = (label: OpponentDecision | string, timeout = 200) => {
    setTimeout(() => {
      setOppDecision(label);
    }, timeout);
  }

  const showDealer = (isVisible: boolean) => {
    return isVisible ? <Dealer name="Dealer" /> : null;
  }

  const showPot = (isVisible: boolean) => {
    return isVisible ? <Pot amount={potAmountRef.current} /> : null;
  }
  
  const showOpponent = (isVisible: boolean) => {
    return isVisible ? <Opponent 
      name="Opponent" 
      stack={opponentStack.current} 
      decision={oppDecision} /> : null;
  }
  
  const showHero = (isVisible: boolean) => {
    return isVisible ? <Hero name="Hero" stack={heroStack.current} /> : null;
  }

  const startRound = (timeout = 1000) => {
    setTimeout(() => { 
      setEventDblPrevention(false);
      setPotVis(true); 
      setOpponentVis(true);
      setHeroVis(true); 
    }, timeout);
  }

  const restart = () => {
    if (heroStack.current === MAIN_CONFIG.GAME.END_GAME_STACK) {
      emitter.emit(GamePhase.OpponentWinGame);
      return;
    }
    if (opponentStack.current === MAIN_CONFIG.GAME.END_GAME_STACK) {
      emitter.emit(GamePhase.HeroWinGame);
      return;
    }

    setEventDblPrevention(false);
    setPlayerBets(0, false);
    potAmountRef.current = 0;
    playersChangedCards.current = 0;
  }

  const setHeroStack = (amount: number) => {
    heroStack.current = amount > 0 ? amount : 0;
    setforceUpdate(Date.now());
  }

  const setOpponentStack = (amount: number) => {
    opponentStack.current = amount > 0 ? amount: 0;
    setforceUpdate(Date.now());
  }

  return (
    <div className={styles.container}>
      {showDealer(isDealerVis)}
      {showOpponent(isOpponentVis)}
      {showHero(isHeroVis)}
      {showPot(potVis)}
    </div>
  );
}

export default Players;
