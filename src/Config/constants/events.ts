export enum DeckEvents {
    HeroFirstCards = 'hero_first_cards',
    OpponentFirstCards = 'opponent_first_cards',
    HeroSwitchCard = 'hero_switch_card',
    OpponentSwitchCard = 'opponent_switch_card',
    OpponentCompletedSwitchCard = 'opponent_completed_switch_card',
    HeroCompletedSwitchCard = 'hero_completed_switch_card'
}

export enum WindowEvents {
    OPEN_SETTINGS = 'open_settings'
}


export enum SettingsEvents {
    INTRO_HIDE = 'intro_hide',
    ROOM_COLOR = 'room_color',
    TABLE_COLOR = 'table_color',
    AUDIO_VOLUME = 'audio_volume'
}

export enum SoundEvents {
    BET = 'bet',
    CARD = 'card',
    ROUND = 'round',
    HERO_WIN = 'hero_won',
    OPPONENT_WIN = 'opponent_win',
    LOSE = 'lose'
}