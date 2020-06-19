import ko from './locales/ko_KR';
import en from './locales/en_US';
import ja from './locales/ja_JP';

const whitelist = new Map([
        ['en_US', en],
        ['ko_KR', ko],
        ['ja_JP', ja]
]);

let language = new Map();

let languageConfigured = '';

const setLanguage = (lang: string): void => {
    const data = whitelist.get(lang);
    if (data == null) {
        language = en;
        languageConfigured = 'en_US';
    } else {
        language = data;
        languageConfigured = 'ko_KR';
    }
}

const getLanguage = (): string => {
    return languageConfigured
}

const l = (key: string): string => {
    const data = language.get(key)
    if (data == null) {
        // console.log(`"${key}": ""`);
        return '';

    } else {
        return data;
    }
}

const detectLanguage = (lang: string | null): string => {
    switch (lang) {
        case 'ja':
        case 'ja-JP':
        case 'ja_JP':
            return 'ja_JP'
        case 'ko':
        case 'ko-KR':
        case 'ko_KR':
            return 'ko_KR'
        case 'en':
        case 'en-US':
        case 'en_US':
        default:
            return 'en_US'
    }
}

export {l, setLanguage, detectLanguage, getLanguage};
