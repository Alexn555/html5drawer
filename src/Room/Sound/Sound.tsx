import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';
import useSound from 'use-sound';
import { SettingsEvents, SoundEvents } from '../../Config/constants/events';
import styles from './Sound.module.scss';
import { getSoundSource } from '../../common/services/soundManager';
import { decimalConvert } from '../../common/services/math';
import { BetsPhase, GamePhase } from '../../Config/constants/gameProcess';

const Sound: FC = () => {
  const { emitter } = useMitt();
  const audioRef = useRef<HTMLButtonElement>(null);
  const audioRef2 = useRef<HTMLButtonElement>(null);
  const [volume, setVolume] = useState(0); // 0 till 1
  const [currentSound, setCurrentSound] = useState<SoundEvents>('' as SoundEvents);
  const [currentSound2, setCurrentSound2] = useState<SoundEvents>('' as SoundEvents);
  const [playCard] = useSound(getSoundSource(SoundEvents.CARD), { volume: volume });
  const [playHeroWin] = useSound(getSoundSource(SoundEvents.HERO_WIN), { volume: volume });
  const [playOpponentWin] = useSound(getSoundSource(SoundEvents.OPPONENT_WIN), { volume: volume });
  const [playRound] = useSound(getSoundSource(SoundEvents.ROUND), { volume: volume });

  useEffect(() => {
    emitter.on(SettingsEvents.AUDIO_VOLUME, (event) => {
        const vol = decimalConvert(event.data);
        setVolume(vol);
        audioRef.current?.click();
    });
    emitter.on(SoundEvents.CARD, () => {
        // program way to click on audio (browser limitation)
        setCurrentSound(SoundEvents.CARD);
        audioRef.current?.click();
    });
    emitter.on(SoundEvents.ROUND, () => {
        setCurrentSound(SoundEvents.ROUND);
        audioRef.current?.click();
    });
    emitter.on(BetsPhase.HeroBet, () => {
        setCurrentSound(SoundEvents.HERO_WIN);
        audioRef.current?.click();
    });
    emitter.on(BetsPhase.HeroFold, () => {
        setCurrentSound(SoundEvents.OPPONENT_WIN);
        audioRef.current?.click();
    });
    emitter.on(GamePhase.HeroWinRound, () => {
        setCurrentSound2(SoundEvents.HERO_WIN);
        audioRef2.current?.click();
    });
    emitter.on(GamePhase.OpponentWinRound, () => {
        setCurrentSound2(SoundEvents.OPPONENT_WIN);
        audioRef2.current?.click();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAudio = () => {
    setVolume(volume === 1 ? 0.1 : 1);
  }

  return (
    <div> 
        <button onClick={() => {
             playRound(); 
             toggleAudio();
            }}>Audio {volume === 1 ? 'off': 'on'} </button>
        <div className={styles.invButtons}>
            <button ref={audioRef} onClick={() => {
                switch(currentSound) {
                    case SoundEvents.CARD:
                        default:
                          playCard(); 
                        break;
                    case SoundEvents.ROUND:
                          playRound(); 
                        break;
                }
            }}>
            </button>
            <button ref={audioRef2} onClick={() => {
                switch(currentSound2) {
                    case SoundEvents.HERO_WIN:
                        default:
                          playHeroWin(); 
                        break;
                    case SoundEvents.OPPONENT_WIN:
                          playOpponentWin(); 
                        break;
                }
            }}>
            </button>
        </div>
    </div>
  );
}

export default Sound;
