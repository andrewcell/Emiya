import Vue, {VNode} from 'vue';
import Campsite from './campsite/App.vue';

Vue.config.productionTip = false;

new Vue({
    render: (h): VNode => h(Campsite),
}).$mount('#app');