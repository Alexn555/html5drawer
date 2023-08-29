export enum BetPhase {
  BET = 'bet',
  CALL = 'call',
  CHECK = 'check'
}

export enum ChipBetNames {
  betA = 'betA',
  betB = 'betB',
  betC = 'betC'
}

export enum OpponentDecision {
  BET = 'I bet',
  FOLD = 'I fold',
  CALL = 'I call'
}

export type Bet = {
  name: string;
  value: number;
}

export const Bets: Bet[] = [
  { name: ChipBetNames.betA, value: 50 },
  { name: ChipBetNames.betB, value: 100 },
  { name: ChipBetNames.betC, value: 200 }
];
