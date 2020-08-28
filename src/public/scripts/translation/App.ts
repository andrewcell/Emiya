import {Vue, Component} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';
import {l} from '../locale';

@Component({
    components: {
        Layout
    }
})
export default class Translation extends Vue {
    l = l;
}