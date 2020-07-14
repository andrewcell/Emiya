import Vue, {VNode} from 'vue';
import Campsite from './campsite/App.vue';
import vuetify from './vuetify';

Vue.config.productionTip = false;

new Vue({
    render: (h): VNode => h(Campsite),
    vuetify
}).$mount('#app');