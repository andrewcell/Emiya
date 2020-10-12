import Vue, {VNode} from 'vue';
import Cp from './cp/App.vue';
import vuetify from './vuetify';
import Vuex from 'vuex';
import LoginStatusStore from './vuetify/LoginStatusStore';
import VueRouter from 'vue-router';
import NewsWrite from './news/NewsWrite.vue';

Vue.config.productionTip = false;

const store = new Vuex.Store({
    modules: {
        LoginStatusStore
    }
})

const router = new VueRouter({
    routes: [
     //    {path: '/downloadlog', component: CampsiteHistory},
        {path: '/newswrite', component: NewsWrite}
    ]
});

Vue.use(Vuex);
Vue.use(VueRouter);

new Vue({
    vuetify,
    store,
    router,
    render: (h): VNode => h(Cp),
}).$mount('#app');