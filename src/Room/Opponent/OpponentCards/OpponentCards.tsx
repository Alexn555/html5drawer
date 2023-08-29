import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';
import { getRandomInt } from '../../../common/services/math';

import styles from './OpponentCards.module.scss';
import { useAnimationFrame } from '../../../common/hooks/useAnimation';
import { CardItem, CardOwner, CardSize, CardValue, PlayerCardAmount, Suit } from '../../../Config/constants/cards';
import Card from '../../../Room/Cards/Card/Card';
import { DeckEvents } from '../../../Config/constants/events';
import { GamePhase } from '../../../Config/constants/gameProcess';
import OpponentAI from '../../../common/services/opponent';
import { MAIN_CONFIG } from '../../../Config/constants/config';

const OpponentCards: FC = () => {
  const { emitter } = useMitt();
  const opponentAI = new OpponentAI();
  const [position, setPosition] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [count, setDeckCount] = useState(0);
  const closedCards = useRef<boolean>(MAIN_CONFIG.OPPONENT.INIT_CLOSED_CARDS);
  const roundCount = useRef<number>(0);
  const swCardAmountLabel = useRef<string>('');

  useEffect(() => {
    let counter = count;
    const interval = setInterval(() => {
      if (counter >= PlayerCardAmount) {
        clearInterval(interval);
      } else {
        setDeckCount(count => count + 1);
        counter++;
      }
    }, MAIN_CONFIG.DECK.OPPONENT_SHUFFLE);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  useEffect(() => {
    setClosedCards();
    emitter.on(GamePhase.NEXT_ROUND, () => {
      setClosedCards();
    });
    emitter.on(GamePhase.SecondBetRound, () => {
      setSwLabel();
    });
    emitter.on(GamePhase.ChangeCards, () => {
      const demandNewCards = opponentAI.switchCards(cards);
      emitter.emit(DeckEvents.OpponentSwitchCard, { wantedAmount: demandNewCards, original: cards });
      setSwLabel(false, demandNewCards);
    });

    emitter.on(DeckEvents.OpponentFirstCards, event => {
      setSwLabel();
      if (roundCount.current > 1) {
        setDeckCount(0);
      }
      setCards(event.data);
      roundCount.current += 1;
    });

    emitter.on(GamePhase.Showdown, () => {
      setClosedCards(false);
    });

    setCards(setInitCards());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setClosedCards = (sw: boolean = MAIN_CONFIG.OPPONENT.INIT_CLOSED_CARDS) => {
    closedCards.current = sw;
  }

  const setSwLabel = (isInit = true, amount: number = 0) => {
    if (isInit) {
      swCardAmountLabel.current = '';
    } else {
      swCardAmountLabel.current = amount === 0 ? 'No Change' : `I change: ${amount}`;
    }
  }

  useAnimationFrame(() => {
    setPosition(0);
  });

  const setInitCards = (): CardItem[] => {
    return [ 
        { value: CardValue.X, suit: Suit.Clubs  },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs }
    ];
  }

  return (
    <div
     className={styles.container}
     style={{
      transform: `translateY(${position}px)`
      }}
     >
      {cards.slice(0, count).map(({ value, suit }, index) => {
       let val = closedCards.current ? CardValue.X : value;
       return (
        <Card 
            key={`${value}${suit}${getRandomInt()}`}
            owner={CardOwner.Opponent} 
            value={val}
            suit={suit}
            posX={index * CardSize.w}
            posY={0}
            click={()=>{}}
        />
      )})}
      {swCardAmountLabel.current !== '' ? 
       <div className={styles.changeCards}>
        {swCardAmountLabel.current}
       </div> 
      : null}
    </div>
  );
}

export default OpponentCards;
