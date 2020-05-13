import axios from 'axios';
    let data: any = {};
    const whitelist: string[] = ['en_US', 'ko_KR'];
    let language = '';
const setLanguage = (lang: string) => {
        if (whitelist.includes(lang)) {
            axios.get(`/locales/${lang}.json`).then(res => {
                data = res.data;
                language = lang;
                return;
            })
        }
    }
const getData = () => {
        if (data === {}) {
            setLanguage(language);
        }
        return data;
    }

const l = (key: string): string => {
    const dataa = getData();
    if (dataa[key] != null) {
        return dataa[key];
    } else {
        return '';
    }
}

export {l, setLanguage};