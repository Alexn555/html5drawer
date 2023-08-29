import { FC, useEffect, useRef, useState } from 'react';
import { useMitt } from 'react-mitt';
import { WindowEvents } from '../../Config/constants/events';
import styles from './Settings.module.scss';
import MainSettings from './MainSet/MainSet';
import AudioSettings from './Audio/AudioSet';
// import { listenForOutsideClicks } from '../../common/hooks/useOutsideClick';

enum Tabs {
  Main = 'main',
  Audio = 'audio'
}

const Settings: FC = () => {
  const { emitter } = useMitt();
  const [activeTab, setActiveTab] = useState(Tabs.Main);
  const [isOpen, setIsOpen] = useState(false);  
  const toggleWindow = () => setIsOpen(!isOpen);
  const tabRef = useRef(null);
  // const [listening, setListening] = useState(false);

  useEffect(() => {
    emitter.on(WindowEvents.OPEN_SETTINGS, () => {
        setIsOpen(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // use for outside click
  /* useEffect(listenForOutsideClicks(
    listening,
    setListening,
    tabRef,
    setIsOpen,
  )); */

  const toggleTab = (tab: Tabs) => {
    setActiveTab(tab);
  }

  return (
    <>
      {isOpen ?
        <div ref={tabRef} className={styles.container}>
            <h2>Settings</h2>
            <ul className={styles.navigation}>
                <li onClick={() => { toggleTab(Tabs.Main); }} 
                  className={activeTab === Tabs.Main ? 'active' : ''}>
                  Main
                </li>
                <li onClick={() => { toggleTab(Tabs.Audio); }} 
                  className={activeTab === Tabs.Audio ? 'active' : ''}>
                  Audio
                </li>
            </ul>
            <div className={styles.outlet}>
              {activeTab === Tabs.Main ? <MainSettings /> : <AudioSettings />}
            </div>
            <div className={styles.close}>
                <button onClick={toggleWindow}>
                  Close
                </button>
            </div>
        </div>
      : null}
    </>
  );
}

export default Settings;
