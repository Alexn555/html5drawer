import { CardItem, CardValue, Suit } from "../../Config/constants/cards";
import { getRandomInt } from "./math";

export const HandRankings = [
    { name: 'HighCard', value: 0 },
    { name: 'OnePair', value: 1 },
    { name: 'TwoPairs', value: 2 },
    { name: 'Set', value: 3 },
    { name: 'Straight', value: 4 },
    { name: 'Flush', value: 5 },
    { name: 'FullHouse', value: 6 },
    { name: 'Quads', value: 7 },
    { name: 'StraightFlush', value: 8 },
    { name: 'RoyalFlush', value: 9 }
]

type HandStreingth = {
    name: string;
    value: number;
    subValue: number;
}

type foundPair = any;

export default class HandAnalyzer {
    private static _instance: HandAnalyzer = new HandAnalyzer();

    constructor() {
      if(HandAnalyzer._instance){
        throw new Error("Error: Instantiation failed: Use StorageHandler.getInstance() instead.");
      }
      HandAnalyzer._instance = this;
    }

    lowStreight = [2, 3, 4, 5, 14];
    straightsValue = [4, 8, 9];
    mockCards = [
        { value: CardValue.Six, suit: Suit.Spades },
        { value: CardValue.Jack, suit: Suit.Diamonds },
        { value: CardValue.Three, suit: Suit.Spades },
        { value: CardValue.Four, suit: Suit.Spades },
        { value: CardValue.Five, suit: Suit.Spades }
    ];

    
    static getInstance(): HandAnalyzer {
        return HandAnalyzer._instance;
    }

    allAreEqual(array: (string | number)[]) {
        // eslint-disable-next-line
        const result = array.every(element => {
          if (element === array[0]) {
            return true;
          }
        });
        return result;
    }
    
    getPairs(values: number[]) {
        // eslint-disable-next-line
        const elementCounts = values.reduce((count: any, item) => (count[item] = count[item] + 1 || 1, count), {});
        let top = HandRankings;
        let highestHand = { 
            name: top[0].name, 
            value: top[0].value,
            subValue: CardValue.Two };
        let highCard: number = 2;
        let pairs: foundPair[] = [];
        let sets: foundPair[] = [];
        let quads: foundPair[] = [];
    
        const keys = Object.entries(elementCounts);
        keys.forEach(found => {
            if (found[1] === 1 && highCard < parseInt(found[0], 10)) {
                highCard = parseInt(found[0], 10);
            }
            if (found[1] === 2) { pairs.push(found); }
            if (found[1] === 3) { sets.push(found); }
            if (found[1] === 4) { quads.push(found); }
        });
    
        if (quads.length > 0) {
            return { name: top[7].name, value: top[7].value, subValue: parseInt(quads[0], 10) };
        }
        // is FullHouse
        if (sets.length > 0 && pairs.length > 0) {
            return { name: top[6].name, value: top[6].value, subValue: parseInt(sets[0], 10) };
        }
        // is Set
        if (sets.length > 0 && pairs.length === 0) {
            return { name: top[3].name, value: top[3].value, subValue: parseInt(sets[0], 10) };
        }
        // is Two or Pairs
        if (pairs.length > 0) {
            return { 
                name: top[pairs.length].name, 
                value: top[pairs.length].value, 
                subValue: parseInt(pairs[pairs.length-1], 10)
            };
        }
        // is HighCard
        if (pairs.length === 0){
            return { name: top[0].name, value: top[0].value, subValue: highCard };
        }
        return highestHand;
    }
    
    getStreight(curHand: HandStreingth, values: number[]): HandStreingth {
        const top = HandRankings;
        const isLowStr = this.checkLowStreight(values);
        const isSeq = this.isSequential(values);

        if (isLowStr) {
            return {
                name: top[4].name,
                value: top[4].value,
                subValue: CardValue.Five
            };
        }
        if (isSeq) {
            return {
                name: top[4].name,
                value: top[4].value,
                subValue: Math.max(...values)
            };
        }
        return curHand;
    }

    checkLowStreight(values: number[]) {
        const allFounded = this.lowStreight.every(val => values.includes(val) );
        return allFounded;
    }
    
    isSequential(array: number[]) {
        // lowest to high
        const lowArray = array.sort((a, b) => { return a - b; });
        for (let i = 1, len = lowArray.length; i < len; i++) {
          let cur = lowArray[i];
          let prev = lowArray[i - 1];
          // check if current value smaller than previous value
          if (cur < prev || (cur - prev !== 1)) {
            return false;
          }
        }
        return true;
    }

    determineHandStreinght(hand: CardItem[], isDebugMode = false): HandStreingth {
        if (isDebugMode) {
            hand = this.mockCards;
        }
        const top = HandRankings;
        let highestHand = { 
            name: top[0].name, 
            value: top[0].value,
            subValue: CardValue.Two };
        let subValue = CardValue.Two; // high card, high pair value
        let isStreight = false;
        let isFlush = false;
        let suits: string[] = [];
        let values: number[] = [];
      
        hand.forEach((card) => {
            suits.push(card.suit);
            values.push(card.value);
        });
    
        const pairsHand = this.getPairs(values);
        highestHand = pairsHand;
        highestHand = this.getStreight(highestHand, values);

        isStreight = this.straightsValue.some((found) => found === highestHand.value);
        isFlush = this.allAreEqual(suits);

        // flush
        if (pairsHand.value < 6 && isFlush && !isStreight) {
            highestHand = {
                name: HandRankings[5].name, 
                value: HandRankings[5].value,
                subValue: subValue };
        }
        // quads
        if (pairsHand.value === HandRankings[7].value) {
            highestHand = pairsHand;
        }
        // streight flush
        if (isFlush && isStreight) {
            const minRoyalCard = CardValue.Ten as number;
            if (Math.min(...values) === minRoyalCard) {
                 // Royal Flush
                highestHand = {
                    name: HandRankings[9].name, 
                    value: HandRankings[9].value,
                    subValue: subValue
                };
            } else {
                highestHand = {
                    name: HandRankings[8].name, 
                    value: HandRankings[8].value,
                    subValue: subValue
                };
            }
        }
    
        return highestHand;
    }
    
    comparePlayerHands(heroHand: CardItem[], opponentHand: CardItem[]): boolean {
        // to determine who has best hand
        const heroStreingth = this.determineHandStreinght(heroHand);
        const opponentStreignth = this.determineHandStreinght(opponentHand);        
        let isHeroWin = heroStreingth.value > opponentStreignth.value; 
        if (heroStreingth === opponentStreignth) {
            isHeroWin = heroStreingth.subValue > opponentStreignth.subValue;
            if (heroStreingth.subValue === opponentStreignth.subValue) {
                isHeroWin = getRandomInt(0, 1) === 1;
            }
        }
        return isHeroWin;
    }
}
