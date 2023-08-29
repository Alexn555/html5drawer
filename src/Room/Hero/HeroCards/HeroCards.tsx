import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './HeroCards.module.scss';
import { useAnimationFrame } from '../../../common/hooks/useAnimation';
import { CardItem, CardOwner, CardSize, CardValue, PlayerCardAmount, SelectedCardItem, Suit } from '../../../Config/constants/cards';
import Card from '../../../Room/Cards/Card/Card';
import { DeckEvents, SoundEvents } from '../../../Config/constants/events';
import { getRandomInt } from '../../../common/services/math';
import { GamePhase } from '../../../Config/constants/gameProcess';
import { MAIN_CONFIG } from '../../../Config/constants/config';

const HeroCards: FC = () => {
  const { emitter } = useMitt();
  const [position, setPosition] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [count, setDeckCount] = useState(0);
  const switchCardsRound = useRef<boolean>(false);
  const [selectedSW, setSelecteSW] = useState<SelectedCardItem[]>([]);
  const roundCount = useRef<number>(0);

  useEffect(() => {
    let counter = count;
    const interval = setInterval(() => {
      if (counter >= PlayerCardAmount) {
        clearInterval(interval);
      } else {
        setDeckCount(count => count + 1);
        emitter.emit(SoundEvents.CARD);
        counter++;
      }
    }, MAIN_CONFIG.DECK.HERO_SHUFFLE);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  useEffect(() => {
    setCards(setInitCards());
    toggleSwCards(false);

    emitter.on(GamePhase.Start, () => {
      toggleSwCards(false);
    });
    emitter.on(GamePhase.ChangeCards, () => {
      toggleSwCards(true);
    });
  
    emitter.on(GamePhase.NEXT_ROUND, () => {
      toggleSwCards(false);
      setSelecteSW([]);
    });
    emitter.on(DeckEvents.HeroCompletedSwitchCard, () => {
      toggleSwCards(false);
      setSelecteSW([]);
    });
    emitter.on(DeckEvents.HeroFirstCards, event => {
      setSelecteSW([]);
      if (roundCount.current > 1) {
        setDeckCount(0);
      }
      setCards(event.data);
      roundCount.current += 1;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAnimationFrame(() => {
    setPosition(0);
  });

  const toggleSwCards = (toggle: boolean) => {
    switchCardsRound.current = toggle;
  }

  const setInitCards = (): CardItem[] => {
    return [ 
        { value: CardValue.X, suit: Suit.Clubs  },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs },
        { value: CardValue.X, suit: Suit.Clubs }
    ];
  }

  const switchCard = (value: CardValue, suit: Suit, index: number) => {
    if (switchCardsRound.current) { 
      const exists = selectedSW.find((el) => el.index === index);
      if (!exists) {
        setSelecteSW([...selectedSW, { value, suit, index} ]);
      } else {
        setSelecteSW(selectedSW.filter(item => item.index !== index));
      }
    }
  }

  const confirmSwitchCard = () => {
    if (switchCardsRound.current) { 
      //@todo  debug check
      //hand.determineHandStreinght(cards);
      emitter.emit(DeckEvents.HeroSwitchCard, { data: selectedSW, original: cards });      
      toggleSwCards(true);
    }
  }

  return (
    <div
     className={styles.container}
     style={{
      transform: `translateY(${position}px)`
      }}
     >
       {cards.slice(0, count).map(({ value, suit }, index) => (
        <Card 
          key={`${value}${suit}${getRandomInt()}`}
          owner={CardOwner.Hero} 
          value={value}
          suit={suit}
          posX={index * CardSize.w}
          posY={selectedSW.find((el) => el.index === index) ? -10 : 0}
          click={() => { switchCard(value, suit, index); }}
        />
       ))}
       <div className={styles.switchCards}>
          <button disabled={!switchCardsRound.current} onClick={() => { confirmSwitchCard(); }}>Switch cards</button>
        </div>
    </div>
  );
}

export default HeroCards;
