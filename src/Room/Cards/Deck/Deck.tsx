import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './Deck.module.scss';
import { useAnimationFrame } from '../../../common/hooks/useAnimation';
import { GamePhase } from '../../../Config/constants/gameProcess';
import { CardItem, CardOwner, CardValue, PlayerCardAmount } from '../../../Config/constants/cards';
import HandAnalyzer from '../../../common/services/hand';

import Card from '../../../Room/Cards/Card/Card';
import DeckHandler from '../../../common/services/deck';
import { getRandomInt } from '../../../common/services/math';
import { DeckEvents } from '../../../Config/constants/events';
import { MAIN_CONFIG } from '../../../Config/constants/config';

type DeckAttributes = {
  gamePhase: GamePhase,
}

const Deck: FC<DeckAttributes> = (props: DeckAttributes) => {
  const { gamePhase } = props;
  const hand = new HandAnalyzer();
  const deckHandler = new DeckHandler();
  const { emitter } = useMitt();
  const [position, setPosition] = useState(0);
  const [deckCards, setDeckCards] = useState<CardItem[]>([]);
  const heroCards = useRef<CardItem[]>([]);
  const opponentCards = useRef<CardItem[]>([]);
  const [visDeckCards, setVisDeckCards] = useState<CardItem[]>([]);
  const [visDeckCount, setVisDeckCount] = useState(0);
  const DeckVisAmount = MAIN_CONFIG.DECK.MAX_VISIBLE;

  const deckIndexes = {
    oppFirstIndex: 0,
    oppSwitchIndex: 15,
    heroFirstIndex: 5,
    heroSwitchIndex: 10
  }

  useEffect(() => {
    let counter = visDeckCount;
    const interval = setInterval(() => {
      if (counter >= DeckVisAmount) {
        clearInterval(interval);
      } else {
        setVisDeckCount(count => count + 1);
        counter++;
      }
    }, MAIN_CONFIG.DECK.SHUFFLE_SPEED);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visDeckCards]);

  useEffect(() => {
    switch(gamePhase) {
      case GamePhase.Start:
        // create and shuffle deck
        createGameDeck();
      break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);

  useEffect(() => {
    emitter.on(DeckEvents.HeroSwitchCard, (event) => {
      const unwantedCards = event.data;
      if (unwantedCards && unwantedCards.length > 0) {
        // remove unwanted from original
        const { original } = event;
        for(let i = original.length - 1; i >= 0; i--){
          for( let j = 0; j < unwantedCards.length; j++){
              if(original[i] && 
                (original[i].value === unwantedCards[j].value &&
                   original[i].suit === unwantedCards[j].suit)){
                original.splice(i, 1);
              }
           }
        }
        const freshCards = deckCards.splice(deckIndexes.heroSwitchIndex, PlayerCardAmount - original.length);
        const newHeroCards: CardItem[] = [...original, ...freshCards];
        emitter.emit(DeckEvents.HeroFirstCards, { data: newHeroCards });
      }
      emitter.emit(DeckEvents.HeroCompletedSwitchCard);
    });

    emitter.on(DeckEvents.OpponentSwitchCard, (event) => {
      const { wantedAmount, original } = event;
      if (wantedAmount > 0) {
        const mainCards = original.slice(0, wantedAmount);
        const freshCards = deckCards.splice(deckIndexes.oppSwitchIndex, PlayerCardAmount - mainCards.length);
        const newOpponentCards: CardItem[] = [...mainCards, ...freshCards];
        emitter.emit(DeckEvents.OpponentFirstCards, { data: newOpponentCards });
      }
      emitter.emit(DeckEvents.OpponentCompletedSwitchCard);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckCards]);

  useEffect(() => {
    emitter.on(GamePhase.NEXT_ROUND, () => {
      createPlayerCards([], []);
      setVisDeckCount(0);
      setTimeout(() => { createGameDeck(); }, 1000);
    });
    emitter.on(GamePhase.Showdown, () => {
      const isHeroWin = hand.comparePlayerHands(heroCards.current, opponentCards.current);
      const event = isHeroWin ? GamePhase.HeroWinRound : GamePhase.OpponentWinRound;
      emitter.emit(event);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAnimationFrame(() => {
    // depending on phase set / shuffle / give cards
    setPosition(0);
  });

  useEffect(() => {
    // when deck completes -> give cards to players
    if (visDeckCount >= DeckVisAmount) {
      createPlayerCards(
        deckCards.splice(deckIndexes.oppFirstIndex, PlayerCardAmount), 
        deckCards.splice(deckIndexes.heroFirstIndex, PlayerCardAmount)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visDeckCount, deckCards]);

  const setHeroCards = (cards: CardItem[]) => {
    heroCards.current = cards;
  }
  const setOppCards = (cards: CardItem[]) => {
    opponentCards.current = cards;
  }

  const createGameDeck = () => {
    // create and shuffle deck
    const shuffledCards = deckHandler.openDeck();
    setDeckCards(shuffledCards);
    setVisDeckCards(shuffledCards);
  }

  const createPlayerCards = (oppCards: CardItem[], heroCards: CardItem[]) => {
    emitter.emit(DeckEvents.OpponentFirstCards, { data: oppCards});
    emitter.emit(DeckEvents.HeroFirstCards, { data: heroCards });
    setHeroCards(heroCards);
    setOppCards(oppCards);
  }

  const deckCardList = visDeckCards.slice(0, visDeckCount).map(({ value, suit }, index) => (
    <Card 
        key={`${value}${suit}${getRandomInt()}`}
        owner={CardOwner.Deck} 
        value={CardValue.X}
        suit={suit}
        posX={(index * 4)}
        posY={10}
        click={()=>{}}
    />
   ));

  return (
    <div
     className={styles.container}
     style={{
      transform: `translateY(${position}px)`
      }}
     >
      {deckCardList}
    </div>
  );
}

export default Deck;
