import {Vue, Component} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';
import {l} from '../locale';

type localeInfo = {
    language: string;
    name: string;
}

type searchResult = {
    result: localeInfo[];
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
    locales: localeInfo[] = [
        {language: 'jp', name: 'nihonggo'},
        {language: 'kr', name: '한국어이름'},
        {language: 'en', name: 'EnglishName'},
        {language: 'zh', name: 'zhongguaname'},
        {language: 'ru', name: 'ruskiname'}
    ];
    result: searchResult[] = [
        {result: this.locales, name: '테스트'},
        {result: this.locales, name: '테스트2'},
        {result: this.locales, name: '테스트3'},
        {result: this.locales, name: '테스트5'},
    ];

    getConturyCode(code: string): string {
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
}