export const MAIN_CONFIG = {
    INTRO_ENABLED: true,
    PLAYER_INIT_STACK: {
        HERO: 1000,
        OPPONENT: 1000
    },
    SETTINGS: {
        DISPLAY_BUTTON: true,
    },
    PLAYER_AMOUNT: 2,
    DECK: {
        MAX_VISIBLE: 12,
        SHUFFLE_SPEED: 100,
        HERO_SHUFFLE: 300,
        OPPONENT_SHUFFLE: 200,
    },
    GAME: {
        RESTART_ROUND_TIMEOUT: 4000,
        HERO_FOLD_TIMEOUT: 4000,
        END_GAME_STACK: 0,
        SHOWNDOWN_TIMEOUT: 6000
    },
    BETBOARD: {
        START_TIMEOUT: 1000,
    },
    POT: {
        GIVE_TO_PLAYER_WIN: 2000
    },
    OPPONENT: {
        DECISION_TIME: 2000,
        INIT_CLOSED_CARDS: true
    }
} as const;