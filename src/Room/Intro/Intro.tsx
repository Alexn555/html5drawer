import { useCallback, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';

import styles from './Intro.module.scss';
import { MAIN_CONFIG } from '../../Config/constants/config';
import { GamePhase } from '../../Config/constants/gameProcess';
import StorageHandler from '../../common/services/sessionStorage';
import { SettingsEvents } from '../../Config/constants/events';

function Intro() {  
  const { emitter } = useMitt();
  const [visible, setVisible] = useState(true);
  const [mActive, setmActive] = useState(false);
  const sessionStore = StorageHandler.getInstance();

  useEffect(() => {
    setVisible(MAIN_CONFIG.INTRO_ENABLED);
    const savedHide = sessionStore.getEl(SettingsEvents.INTRO_HIDE);
    if (savedHide === 'true') {
      setVisible(false);
      emitter.emit(GamePhase.START_GAME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActive = useCallback(() => {
    setmActive(true);
    sessionStore.save(SettingsEvents.INTRO_HIDE, 'true')
  }, [setmActive]);

  const handleStartGame = useCallback(() => {
    setVisible(false);
    emitter.emit(GamePhase.START_GAME);
  }, [setVisible]);

  return (
    <>
       {visible ? 
          <div className={styles.container}>
            <h1>5 Card Draw Lite</h1>
            <p>Lite Draw game with Fold or Bet and 1 round of card changes</p>
            <p>This game uses sessionStorage to save settings</p>
            <button 
              className={`${styles.hideMessage} 
                ${mActive ? styles.msgActive : ''}`} 
              onClick={handleActive}>
                Do not show me this message again
            </button> 
            <p></p>
            <button 
              className={styles.start} 
              onClick={handleStartGame}>
              Start
            </button> 
          </div> 
       : null}
    </>
  );
}

export default Intro;
