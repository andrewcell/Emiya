import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

@Module({name: 'LoginStatusStore'})
export default class LoginStatusStore extends VuexModule {
    login = false;
    username: string | null = '';

    @Mutation
    setLoginStatus(status: boolean): void {
        this.login = status;
    }

    @Mutation
    setUsername(username: string): void {
        this.username = username;
    }
}