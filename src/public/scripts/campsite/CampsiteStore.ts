import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import Vuex from 'vuex';
import {CampsiteContent} from './CampsiteObjects';
import {Villager} from '../villagers/interfaces';
import {EmiyaJ} from '../emiyaj/sendWithToken';
import {encryptJava} from '../encryption/AES';

Vue.use(Vuex);

@Module({name: 'CampsiteStore'})
export default class CampsiteStore extends VuexModule {
    current: CampsiteContent | null = null;
    contents: CampsiteContent[] = [];
    selectedVillager: Villager | null = null;

    private send(): Promise<void> {
        return new Promise((resolve) => {
            const body = [this.current].concat(this.contents)
            EmiyaJ.getInstance().send(encryptJava(JSON.stringify(body)), EmiyaJ.path('campsite'))
                .then(() => {return resolve();})
                .catch((err: string) => {
                    return Promise.reject(err);
                });
        })
    }

    @Mutation
    setCurrent(current: CampsiteContent): void {
        const body = [current].concat(this.contents)
        console.log(encryptJava(JSON.stringify(body)));
        EmiyaJ.getInstance().send(encryptJava(JSON.stringify(body)), EmiyaJ.path('campsite/'))
            .then(() => {
                this.current = current;
                return;
            })
            .catch((err: string) => {
                // return Promise.reject(err);
            });
    }

    @Mutation
    setCurrentWithoutApply(current: CampsiteContent): void {
        this.current = current;
    }

    @Mutation
    setContents(array: CampsiteContent[]): void {
        this.contents = array;
        this.send().then(() => {return;})
    }

    @Mutation
    setContentsWithoutApply(array: CampsiteContent[]): void {
        this.contents = array;
    }

    @Mutation
    setVillager(villager: Villager): void {
        this.selectedVillager = villager;
    }
}
