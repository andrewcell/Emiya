import ko from './locales/ko_KR';
import en from './locales/en_US';
import ja from './locales/ja_JP';
import Cookies from 'js-cookie';

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
        Cookies.set('locale', 'en_US');
    } else {
        language = data;
        languageConfigured = 'ko_KR';
        Cookies.set('locale', 'ko_KR');
    }
}

const getLanguage = (): string => {
    return languageConfigured
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

const missingLanguage = (): void => {
    const lang = Cookies.get('locale');
    if (lang == null || language.size <= 0) {
        setLanguage(detectLanguage(navigator.language));
    } else {
        if (!whitelist.has(lang)) {
            setLanguage('en_US');
            Cookies.set('locale', 'en_US');
        }
    }
}

const l = (key: string): string => {
    missingLanguage();
    const data = language.get(key)
    if (data == null) {
        // console.log(`"${key}": ""`);
        return '';

    } else {
        return data;
    }
}

export {l, setLanguage, detectLanguage, getLanguage};
