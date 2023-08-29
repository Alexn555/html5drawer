import { FC, useEffect, useState } from 'react';
import styles from './Card.module.scss';
import { useAnimationFrame } from '../../../common/hooks/useAnimation';
import { CardOwner, CardValue, Suit } from '../../../Config/constants/cards';
import { getRandomInt } from '../../../common/services/math';

type CardAttributes = {
  owner: CardOwner,
  value: CardValue;
  suit: Suit;
  posX: number;
  posY: number;
  click: Function;
}

function setCardImgSource(value: CardValue, suit: Suit): string {
  const mainPath = `${process.env.PUBLIC_URL}/resources/cards/`;
  const card = value === CardValue.X ? 'x' : `${value}${suit}`;
  return `${mainPath}${card}.gif`;
}

const Card: FC<CardAttributes> = (props: CardAttributes) => {
  const { owner, value, suit, posX, posY, click } = props;
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [ownerCl, setOwnerCl] = useState<any>('');
  const [image, setImage] = useState(''); 
  const isTitleVis = false;

  useEffect(() => {
    setImage(setCardImgSource(value, suit));
    setOwnerCl(owner === CardOwner.Hero ? styles.heroCards : '');
  }, [value, suit, owner]);

  useAnimationFrame(() => {
    setPosition({ x: posX, y: posY + 4 });
  });

  return (
    <div
     key={`${value}${getRandomInt()}`}
     className={`${styles.container} ${ownerCl}`}
     onMouseDown={() => { click(); }}
     style={{
      backgroundImage: `url('${image}')`,
      transform: `translate(${position.x}px, ${position.y}px)`
      }}
     >
      { isTitleVis ? <span>{props.value}{props.suit}</span> : null}
    </div>
  );
}

export default Card;
