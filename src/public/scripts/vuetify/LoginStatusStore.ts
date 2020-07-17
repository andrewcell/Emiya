import {Module, Mutation, VuexModule} from 'vuex-module-decorators';

@Module
export default class LoginStatusStore extends VuexModule {
    login = false;
    username = '';

    @Mutation
    setLoginStatus(status: boolean): void {
        this.login = status;
    }
}