import { FC, useEffect, useState } from 'react';
import styles from './Chip.module.scss';
import { ChipBetNames } from '../../../../../Config/constants/bets';

type BetButtonAttributes = {
  name: string;
  value: number;
  selected: string;
  disabled: boolean;
  cb: Function
}

const Chip: FC<BetButtonAttributes> = (props: BetButtonAttributes) => {
  const { name, value, selected, cb, disabled = false } = props;
  const [image, setImage] = useState(''); 
  const [selectedBetCl, setSelectBetCl] = useState('');

  useEffect(() => {
    setImage(setImgSource(name));
  }, [name]);

  useEffect(() => {
    setSelectBetCl('');
    if (selected === name) {
      setSelectBetCl(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const setImgSource = (chipName: string): string => {
    const mainPath = '../../../../resources/chips/';
    let chip = 'd1';
    switch (chipName) {
        case ChipBetNames.betA:
            chip = 'd3';
            break; 
        case ChipBetNames.betB:
            chip = 'd2';
            break; 
        case ChipBetNames.betC:
            chip = 'd1';
            break; 
        default:
            chip = 'd1';
    }
    return `${mainPath}${chip}.png`;
  }

  return (
    <button
      className={selectedBetCl === '' ? styles.chip : styles.chipSelected}
      title={`Click to bet: ${value}`}
      style={{
        backgroundImage: `url('${image}')`,
      }}
      disabled={disabled}
      onClick={() => { 
        setSelectBetCl('selected');
        cb(); 
      }}
    >
    </button>
  );
}

export default Chip;
