import { Bets } from "../../Config/constants/bets";
import HandAnalyzer from '../../common/services/hand';
import { CardItem } from "../../Config/constants/cards";
import { getRandomInt } from "./math";

enum AgreesiveStyles {
    Aggr = 70,  // percent
    Medium = 50,
    Tight = 40
}

/* Opponent AI */
export default class OpponentAI {
    hand;
    constructor () {
        this.hand = new HandAnalyzer();
    }

    bet(stack: number, heroStack: number): number {
        let bet = Math.floor(Math.random() * Bets.length);
        if (stack < bet) {
            bet = Bets[Bets.length -1].value;
        }
        if (heroStack < Bets[1].value) {
            bet = Bets[Bets.length -1].value;
        }
        return bet;
    }

    switchCards(cards: CardItem[]): number {
        // almost never change from [n] top hand
        const handStr = this.hand.determineHandStreinght(cards);
        const noChange = 0;
        let demandNwCards = noChange;
        const randomAmount = getRandomInt(1, 2); // sometimes 1 or 2 cards
        if (handStr.value > 2) {
            demandNwCards = getRandomInt(0, 2) === 1 ? randomAmount : noChange;
        } else {
            demandNwCards = randomAmount;
        }
        return demandNwCards;
    }

    fold(stack: number): boolean {
        let shouldFold = false;
        const randomWeight = this.getRandomWeight();
        if (stack > 200) {
            shouldFold = randomWeight < AgreesiveStyles.Tight;
        }
        return shouldFold;
    }

    callTo(stack: number, heroStack: number): boolean {
        let isCall = false;
        const randomWeight = this.getRandomWeight();
        if (stack < 100) {
            return true;
        }
        if (heroStack < Bets[Bets.length -1].value) {
          isCall = randomWeight < 80;
        } else {
          isCall = randomWeight < AgreesiveStyles.Tight;
        }
        return isCall;
    }

    getRandomWeight() {
        return Math.random() * 100;
    }
}