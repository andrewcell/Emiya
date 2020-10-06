import {Component, Vue} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';
import {getLanguage, l} from '../locale';
import Axios, {AxiosResponse} from 'axios';
import {encrypt} from '../encryption/AES';
import regex from 'xregexp';

const regexPattern = regex('[^\\p{Ll}\\p{Lu}\\p{Lt}\\p{Lm}\\p{Lo}\'\\- _]');

type localeInfo = {
    language: string;
    name: string;
}

type searchResult = {
    result: localeInfo[];
    image: string | undefined;
    name: string;
}

@Component({
    components: {
        Layout
    }
})
export default class Translation extends Vue {
    l = l;
    languages = ['kr', 'us']
    search = ''
    locales: localeInfo[] = [];
    result: searchResult[] = [];
    showImage = false;
    atLeastFour =  [
        (v: string): string | boolean => !!v || l('translations.emptyfield'),
        (v: string): string | boolean => v.length >= this.getLetterLimit() || l('translations.atleast'),
        (v: string): string | boolean => !regex.test(v, regexPattern) || l('translations.unacceptable')
    ]
    method = 0
    valid = false

    getLetterLimit(): number {
        const language = getLanguage();
        switch (language) {
            case 'ko_KR':
                return 2
            case 'ja_JP':
                return 3
            case 'en_US':
            default:
                return 4
        }
    }

    getCountryCode(code: string): string {
        switch (code) {
            case 'jp':
                return 'jp';
            case 'zh':
                return 'tw';
            case 'ru':
                return 'ru';
            case 'kr':
                return 'kr';
            case 'en':
            default:
                return 'us';
        }
    }

    clearContent(): void {
        this.result = [];
    }

    query(): void {
        if (this.valid) {
            void Axios.post('translation', {
                data: encrypt(JSON.stringify({
                    keyword: regex.replace(this.search, regexPattern, '', 'all').trim(),
                    method: this.method
                }))
            })
            .then((r: AxiosResponse<searchResult[]>) => {
                this.result = r.data;
            })
        }
    }
}