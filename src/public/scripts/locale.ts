import ko from './locales/ko_KR';
import en from './locales/en_US';
import ja from './locales/ja_JP';

const whitelist = new Map([
        ['en_US', en],
        ['ko_KR', ko],
        ['ja_JP', ja]
]);

let language = new Map();

const setLanguage = (lang: string) => {
    const data = whitelist.get(lang);
    if (data == null) {
        language = en;
    } else {
        language = data;
    }
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

export {l, setLanguage};
