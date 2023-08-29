
export enum GamePhase {
    Start = 'start',
    START_GAME = 'start_game',
    NEXT_ROUND = 'next_round',
    Reset = 'reset',
    HeroBet = 'hero_bet',
    ChangeCards = 'change_cards',
    SecondBetRound = 'second_bet_round',
    Showdown = 'showdown',
    RestartRound = 'restart_round',
    HeroWinRound = 'hero_win_round',
    OpponentWinRound = 'opponent_win_round',
    HeroWinGame = 'heroWinGame',
    OpponentWinGame = 'opponentWinGame'
}

export enum BetsPhase {
    HeroChoosedBet = 'hero_choosed_bet',
    HeroBet = 'hero_bet',
    HeroCall = 'hero_call',
    HeroFold = 'hero_fold',
    OpponentBet = 'opponent_bet',
    OpponentCall = 'opponent_call',
    OpponentFold = 'opponent_fold',
    OpponentCloseBET = 'opponent_close_bet',
}

export enum CountEvent {
    PLAYER_SWITCH_CARDS = 'count_players_swtich_card',
    PLAYER_SECOND_BET = 'count_second_bets'
}
