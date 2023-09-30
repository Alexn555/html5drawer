export enum CardOwner {
    Hero = 'hero',
    Opponent = 'opponent',
    Deck = 'deck'
}

export const DeckProps = {
   amount: 52,
   suitsLength: 4,
   values: [
     2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
   ],
   suits: ['h','s','d','c']
} as const;

export const PlayerCardAmount = 5;

export const CardSize = {
    w: 40, //px
    h: 55 //px
} as const;

export enum Suit {
    Hearts = 'h',
    Spades = 's',
    Diamonds = 'd',
    Clubs = 'c'
}

export enum CardValue {
    Ace = 14,
    King = 13,
    Queen = 12,
    Jack = 11,
    Ten = 10,
    Nine = 9,
    Eight = 8,
    Seven = 7,
    Six = 6,
    Five = 5,
    Four = 4,
    Three = 3,
    Two = 2,
    X = 1
}

export type CardItem = {
    value: CardValue;
    suit: Suit;
}

export interface SelectedCardItem extends CardItem {
    index: number;
}