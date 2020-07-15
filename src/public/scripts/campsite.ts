import Vue, {VNode} from 'vue';
import Campsite from './campsite/App.vue';
import vuetify from './vuetify';

Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: (h): VNode => h(Campsite),
}).$mount('#app');