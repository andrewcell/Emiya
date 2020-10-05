import Vue, {VNode} from 'vue';
import Translation from './translation/App.vue';
import vuetify from './vuetify';
import Vuex from 'vuex';
import LoginStatusStore from './vuetify/LoginStatusStore';
import VueRouter from 'vue-router';

Vue.config.productionTip = false;

const store = new Vuex.Store({
    modules: {
        LoginStatusStore
    }
})

Vue.use(Vuex);

new Vue({
    vuetify,
    store,
    render: (h): VNode => h(Translation),
}).$mount('#app');