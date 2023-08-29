import { FC, useEffect, useState } from 'react';
import { useMitt } from 'react-mitt';
import StorageHandler from '../../../common/services/sessionStorage';

import { SettingsEvents } from '../../../Config/constants/events';
import styles from './MainSet.module.scss';
import Select from '../../../UI/Select/Select';
import { StorageKeys, roomColors, tables } from '../../../Config/constants/settings';

const MainSettings: FC = () => {
  const { emitter } = useMitt();
  const sessionStore = new StorageHandler();
  const [roomColor, setRoomColor] = useState('');
  const [table, setTable] = useState('');

  useEffect(() => {
    const savedRoom = sessionStore.getEl(StorageKeys.ROOM_COLOR);
    const savedTable = sessionStore.getEl(StorageKeys.TABLE_COLOR);

    if (savedRoom && savedRoom !== '') {
      setRoomColor(savedRoom)
    }
    if (savedTable && savedTable !== '') {
      setTable(savedTable)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRoomColor = (selected: string) => {
    setRoomColor(selected); 
    sessionStore.save(StorageKeys.ROOM_COLOR, selected);
    emitter.emit(SettingsEvents.ROOM_COLOR, { data: selected });
  };

  const setTableColor = (selected: string) => {
    setTable(selected);
    sessionStore.save(StorageKeys.TABLE_COLOR, selected); 
    emitter.emit(SettingsEvents.TABLE_COLOR, { data: selected });
  };

  return (
    <div> 
        <div className={styles.container}>
           <h2>Main Settings</h2>
            
           <div className={styles.field}>
              <label>Room Color: </label>
              <Select
                id='roomColor'
                content={roomColors}
                selected={roomColor}
                cb={(selected: string) => {                
                  saveRoomColor(selected);
                }}
              />
           </div>
           <div className={styles.field}>
              <label>Table: </label>
              <Select
                id='tableColor'
                content={tables}
                selected={table}
                cb={(selected: string) => {
                  setTableColor(selected);
                }}
              />
           </div>
        </div>
    </div>
  );
}

export default MainSettings;
