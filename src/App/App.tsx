import Room from '../Room/Room';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.main}>
      <header className={styles.logo}>
      </header>
      <Room />
    </div>
  );
}

export default App;
