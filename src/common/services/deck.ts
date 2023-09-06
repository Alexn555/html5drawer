import { CardItem, DeckProps, Suit } from "../../Config/constants/cards";

export default class Deck {
    private static _instance: Deck = new Deck();
    
    constructor() {
      if(Deck._instance){
          throw new Error("Error: Instantiation failed: Use StorageHandler.getInstance() instead.");
      }
      Deck._instance = this;
    }
  
    static getInstance(): Deck {
        return Deck._instance;
    }
      
    openDeck(): CardItem[] {
        const deck = this.createDeck();
        return this.shuffle(deck);
    }

    createDeck(): CardItem[] {
        const { values, suits } = DeckProps;
        let deck = new Array<CardItem>();

        for (let i = 0; i < suits.length; i++) {
            for (let x = 0; x < values.length; x++) {
                let card = { value: values[x], suit: suits[i] as Suit };
                deck.push(card);
            }
        }
        return deck;
    }

    // eslint-disable-next-line
    convertCards(cardsData: CardItem[]) {
        const realCards: CardItem[] = [];
        cardsData.forEach((card) => {
            return realCards.push({ value: card.value, suit: card.suit });
        });
        return realCards;
    }

    shuffle(deck: CardItem[]): CardItem[] {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }
}
