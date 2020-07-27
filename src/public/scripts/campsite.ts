import Vue, {VNode} from 'vue';
import Campsite from './campsite/App.vue';
import vuetify from './vuetify';
import Vuex from 'vuex';
import LoginStatusStore from './vuetify/LoginStatusStore';
import VueRouter from 'vue-router'
import CampsiteMain from './campsite/Campsite.vue';
import CampsiteHistory from './campsite/CampsiteHistory.vue';

Vue.config.productionTip = false;

const store = new Vuex.Store({
    modules: {
        LoginStatusStore
    }
});

const router = new VueRouter({
    routes: [
        {path: '/history', component: CampsiteHistory},
        {path: '/', component: CampsiteMain}
    ]
});

Vue.use(Vuex);
Vue.use(VueRouter);

new Vue({
    vuetify,
    store,
    router,
    render: (h): VNode => h(Campsite),
}).$mount('#app');