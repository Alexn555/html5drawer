import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';
import ReactSlider from 'react-slider';
import StorageHandler from '../../../common/services/sessionStorage';
import { StorageKeys, stepValue } from '../../../Config/constants/settings';

import { SettingsEvents } from '../../../Config/constants/events';
import styles from './AudioSet.module.scss';

const AudioSettings: FC = () => {
  const { emitter } = useMitt();
  const [volume, setVolume] = useState(10);
  const sessionStore = StorageHandler.getInstance();

  useEffect(() => {
    const saved = sessionStore.getEl(StorageKeys.AUDIO_VOLUME);
    if (saved && saved !== '') {
      setVolume(parseInt(saved, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  const saveVolume = (value: number) => {
    setVolume(value);
    emitter.emit(SettingsEvents.AUDIO_VOLUME, { data: value });
    sessionStore.save(StorageKeys.AUDIO_VOLUME, value.toString());
  };

  return (
    <div> 
        <div className={styles.container}>
           <h2>Audio Settings</h2>
            <ReactSlider
              className={styles.audioSlider}
              thumbClassName={styles.audioThumb}
              trackClassName={styles.audioTrack}
              defaultValue={volume}
              value={volume}
              ariaLabel={'Low'}
              ariaValuetext={state => `Vol: ${state.valueNow}`}
              renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
              pearling
              onChange={(value) => { 
                saveVolume(value);
              }}
              step={stepValue}
              minDistance={stepValue}
            />
        </div>
    </div>
  );
}

export default AudioSettings;
