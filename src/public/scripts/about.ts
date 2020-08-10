import Vue, {VNode} from 'vue';
import About from './about/App.vue';
import vuetify from './vuetify';
import Vuex from 'vuex';
import LoginStatusStore from './vuetify/LoginStatusStore';

Vue.config.productionTip = false;

const store = new Vuex.Store({
    modules: {
        LoginStatusStore
    }
})

Vue.use(Vuex)

new Vue({
    vuetify,
    store,
    render: (h): VNode => h(About),
}).$mount('#app');