import { MittProvider } from 'react-mitt-wrapper';
import styles from './Room.module.scss';
import Table from './Table/Table';
import Sound from './Sound/Sound';
import Intro from './Intro/Intro';
import Settings from './Settings/Settings';

function Room() {
  return (
    <div className={styles.container}>
      <MittProvider>
        <Settings />
        <Intro />
        <Table />
        <Sound />
      </MittProvider>
    </div>
  );
}

export default Room;
