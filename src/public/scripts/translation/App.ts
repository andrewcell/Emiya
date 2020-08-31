import {Vue, Component} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';
import {l} from '../locale';

type localeInfo = {
    language: string;
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
        {language: 'kr', name: ''}
    ];

}