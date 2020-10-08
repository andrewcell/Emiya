import {getLanguage} from '../locale';

export interface Locale {
    en: string;
    ko: string;
    ja: string;
}

export interface News {
    title: Locale;
    content: Locale;
    author: string;
    important: boolean;
    // eslint-disable-next-line camelcase
    created_at: number;
}

export const getContentByLocale = (content: Locale): string => {
    switch(getLanguage()) {
        case 'ko_KR':
            return content.ko
        case 'ja_JP':
            return content.ja
        default:
            return content.en
    }
}