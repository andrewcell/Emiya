import ko from './locales/ko_KR.json';
import en from './locales/en_US.json';
import ja from './locales/ja_JP.json';
import Cookies from 'js-cookie';

const whitelist = ['en_US', 'ko_KR', 'ja_JP'];

let languageConfigured = '';

const setLanguage = (lang: string): void | Promise<void> => {
    const data = whitelist.find(language => language === lang);
    if (data == null) {
        languageConfigured = 'en_US';
        Cookies.set('locale', 'en_US');
    } else {
        languageConfigured = lang;
        Cookies.set('locale', lang);
    }
    return Promise.resolve()
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

const missingLanguage = (): Promise<void> => {
    return new Promise<void>((resolve) => {
        const lang = Cookies.get('locale');
        if (lang == null) {
            setLanguage(detectLanguage(navigator.language));
            return resolve();
        }
        const whitelisted = whitelist.find(language => language === lang)
        if (whitelisted == null) {
            setLanguage('en_US');
            Cookies.set('locale', 'en_US');
        } else {
            if (languageConfigured === '') {
                setLanguage(lang);
            }
        }
        return resolve()
    })
}

const l = (key: string): string => {
    missingLanguage().then();
    let str: string | undefined = '';
    switch (languageConfigured) {
        case 'ko_KR':
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            str = ko[key];
            break;
        case 'en_US':
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            str = en[key];
            break;
        case 'ja_JP':
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            str = ja[key];

    }
    if (str == null) {
        return '';

    } else {
        return str;
    }
}

const getLoadingPhrase = (): string => {
    const random = (min: number, max: number): number => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return  Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return l('villagers.loading.s' + random(6, 1));
}

export {l, setLanguage, detectLanguage, getLanguage, getLoadingPhrase};
