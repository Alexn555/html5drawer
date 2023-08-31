import { SoundEvents } from '../../Config/constants/events';

enum extensions {
    wav = 'wav',
    mp3 = 'mp3'
}

export function getSoundSource(event: SoundEvents, mainPath = `${process.env.PUBLIC_URL}/sounds/`) {
    let sound = '';
    switch (event) {
        case SoundEvents.CARD:
            sound = `card.${extensions.wav}`;
        break; 
        case SoundEvents.HERO_WIN:
            sound = `player_win.${extensions.mp3}`;
        break; 
        case SoundEvents.ROUND:
            sound = `player_win.${extensions.mp3}`;
        break; 
        case SoundEvents.OPPONENT_WIN:
            default:
            sound = `dealer_win.${extensions.wav}`;
        break; 
    }
    return `${mainPath}${sound}`; 
}

