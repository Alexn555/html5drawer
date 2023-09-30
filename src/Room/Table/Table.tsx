import { RefObject, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';
import styles from './Table.module.scss';
import { GamePhase } from '../../Config/constants/gameProcess';
import { setTableSource } from '../../common/services/settings';
import Deck from '../Cards/Deck/Deck';
import { DeckEvents, SettingsEvents, WindowEvents } from '../../Config/constants/events';
import { MAIN_CONFIG } from '../../Config/constants/config';
import Players from '../Players/Players';
import { PlayerNames } from '../../Config/constants/players';
import { roomColors, tables } from '../../Config/constants/settings';
import { excludeDublicate } from '../../common/services/eventHelper';

function Table() {
  const { emitter } = useMitt();
  const gamePhase = useRef<GamePhase>(GamePhase.Start); 
  const playersChangedCards = useRef<number>(0);
  const [isGameCompleted, setGameCompleted] = useState(false);
  const winner = useRef<string>('');
  const [, setforceUpdate] = useState(Date.now());
  const [roomColor, setRoomColor] = useState(roomColors[0].value);
  const [tableColor, setTableColor] = useState(tables[0].value);

  const PLAYER_AMOUNT = MAIN_CONFIG.PLAYER_AMOUNT;
  const [isPlayersVisible] = useState(true);
  const [deckVis, setDeckVis] = useState(false);
  const isDblEvent = useRef<boolean>(false);


  useEffect(() => {
    if (MAIN_CONFIG.INTRO_ENABLED) {
      emitter.on(GamePhase.START_GAME, () => {
        setGamePhase(GamePhase.Start);
        startRound();
      });
    } else {
      startRound();
    }
    emitter.on(GamePhase.NEXT_ROUND, () => {
      restart();
    });
    emitter.on(GamePhase.ChangeCards, () => {
      setGamePhase(GamePhase.ChangeCards);
    });
    emitter.on(GamePhase.SecondBetRound, () => {
      setGamePhase(GamePhase.SecondBetRound);
    });
    emitter.on(GamePhase.Showdown, () => {
      setTimeout(() => { 
        emitter.emit(GamePhase.NEXT_ROUND);
      }, MAIN_CONFIG.GAME.SHOWNDOWN_TIMEOUT);
    });

    // card switches
    emitter.on(DeckEvents.HeroCompletedSwitchCard, () => {
      //preventDoubleEvent(() => {
        playersChangedCards.current += 1;
        setEventDblPrevention(false);
        checkCardChanged();
      //});
    });
    emitter.on(DeckEvents.OpponentCompletedSwitchCard, () => {
      preventDoubleEvent(() => {
        playersChangedCards.current += 1;
        setEventDblPrevention(false);
        checkCardChanged();
      });
    });

    // round final stages
    emitter.on(GamePhase.HeroWinGame, () => {
      winner.current = PlayerNames.Hero;
      setGameCompleted(true);
    });
    emitter.on(GamePhase.OpponentWinGame, () => {
      winner.current = PlayerNames.Opponent;
      setGameCompleted(true);
    });

    // Settings 
    emitter.on(SettingsEvents.ROOM_COLOR, (event) => {
      setRoomColor(event.data);
    });
    emitter.on(SettingsEvents.TABLE_COLOR, (event) => {
      setTableColor(event.data);
    });

    return () => {
      emitter.off(GamePhase.Start, () => {});
      emitter.off(GamePhase.Showdown, () => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preventDoubleEvent = (cb: Function) => {
    excludeDublicate(isDblEvent.current, () => {
      cb();
      setEventDblPrevention(true);
    }, () => { setEventDblPrevention(false); });
  }

  const setEventDblPrevention = (toggle: boolean) => {
    isDblEvent.current = toggle;
  }

  const checkCardChanged = () => {
    if (gamePhase.current === GamePhase.ChangeCards &&
       playersChangedCards.current === PLAYER_AMOUNT) {
      emitter.emit(GamePhase.SecondBetRound);
      setforceUpdate(Date.now());
    }
  }

  const setGamePhase = (phase: GamePhase) => {
    gamePhase.current = phase;
    setEventDblPrevention(false);
    setforceUpdate(Date.now());
  }

  const showSettingsButton = (isVisible: boolean) => {
    return isVisible ? (
      <div className={styles.settings} onClick={() => { 
        emitter.emit(WindowEvents.OPEN_SETTINGS); 
      }}>
        <button>Settings</button>
      </div>
    ) : null;
  }
  
  const showDeck = (isVisible: boolean, gamePhase: GamePhase) => {
    return isVisible ? <Deck gamePhase={gamePhase} /> : null;
  }

  const showPlayers = (isVisible: boolean, gamePhase: RefObject<GamePhase>) => {
    return isVisible ? <Players gamePhase={gamePhase} /> : null;
  }

  const gameCompleted = (isCmpl: boolean) => {
    if (isCmpl) {
      const winnerStyle = winner.current === 'Hero' ? styles.heroWin : styles.opponentWin;
      return (<div className={styles.gameCompleted}>
        Game completed <br />
        <span className={winnerStyle}>Winner: {winner.current}</span>
      </div>);
    }
    return null;
  }

  const startRound = (timeout = 1000) => {
    setTimeout(() => { 
      setDeckVis(true); 
      showPlayers(true,  gamePhase);
    }, timeout);
  }

  const restart = () => {
    playersChangedCards.current = 0;
    setforceUpdate(Date.now());
    setDeckVis(true); 
    setGamePhase(GamePhase.Start);
  }

  return (
    <div 
      className={styles.container}
      style={{ 
        backgroundColor: roomColor,
        backgroundImage: `url(${setTableSource(tableColor)})`
      }}
    >
      {showSettingsButton(MAIN_CONFIG.SETTINGS.DISPLAY_BUTTON)}
      {showDeck(deckVis, gamePhase.current)}
      {showPlayers(isPlayersVisible,  gamePhase)}
      {gameCompleted(isGameCompleted)}
    </div>
  );
}

export default Table;
