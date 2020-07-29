import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import Vuex from 'vuex';
import {CampsiteContent} from './CampsiteObjects';
import {Villager} from "../villagers/interfaces";

Vue.use(Vuex);

@Module({name: 'CampsiteStore'})
export default class CampsiteStore extends VuexModule {
    current: CampsiteContent | null = null;
    selectedVillager: Villager | null = null;

    @Mutation
    setCurrent(current: CampsiteContent): void {
        this.current = current;
    }

    @Mutation
    setVillager(villager: Villager): void {
        this.selectedVillager = villager;
    }
}