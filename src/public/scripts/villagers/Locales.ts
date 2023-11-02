import {Color, Hobby, Personality, Style, Villager} from 'animal-crossing/lib/types/Villager';
import Cookies from 'js-cookie';
import {l} from '../locale';
import {Species} from './enums';

export const getMotto = (v: Villager): string => {
    const locale = Cookies.get('locale');
    switch (locale) {
        case 'ko_KR':
            return v.favoriteSaying;
        case 'ja_JP':
            return v.favoriteSaying;
        case 'en_US':
        default:
            return v.favoriteSaying;
    }
}

export const getName = (v: Villager): string => {
    const locale = Cookies.get('locale');
    switch (locale) {
        case 'ko_KR':
            return v.translations.kRko;
        case 'ja_JP':
            return v.translations.jPja;
        case 'en_US':
        default:
            return v.translations.uSen
    }
}

export const getPhrase = (v: Villager): string => {
    const locale = Cookies.get('locale');
    switch (locale) {
        case 'ko_KR':
            return v.catchphrases.kRko;
        case 'ja_JP':
            return v.catchphrases.jPja;
        case 'en_US':
        default:
            return v.catchphrases.uSen;
    }
}

export const getStyle = (v: Villager, index: 0 | 1): string => {
    return l('villagers.styles.' + v.styles[index].toLowerCase());
}

export const getStyleByStyle = (s: Style): string => {
    return l('villagers.styles.' + s.toLowerCase());
}

export const getColor = (v: Villager, index: 0 | 1): string => {
    return l('villagers.colors.' + v.colors[index].toLowerCase());
}

export const getColorByColor = (s: Color): string => {
    return l('villagers.colors.' + s.toLowerCase());
}

export const getPersonality = (p: Personality): string => {
    if (p === Personality.BigSister) {
        return l('villagers.personalities.sisterly');
    } else {
        return l('villagers.personalities.' + p.toLowerCase());
    }
}

export const getHobby = (h: Hobby): string => {
    return l('villagers.hobbies.' + h.toLowerCase());
}

export const getSpecies = (s: string): string => {
    return l('villagers.species.' + s.toLowerCase());
}
