import Vue from 'vue';
import Vuex from 'vuex';
import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {CampsiteContent} from '../campsite/CampsiteObjects';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {EmiyaJ} from '../emiyaj/sendWithToken';
import {encryptJava} from '../encryption/AES';
import {Category, Item} from 'animal-crossing/lib/types/Item';

Vue.use(Vuex);

@Module({name: 'TranslationStore'})
export default class TranslationStore extends VuexModule {
    selectedItem: Item = {
        buy: 0,
        name: '',
        recipe: null,
        sell: null,
        source: [],
        sourceSheet: Category.Bags,
        translations: null
    };

    @Mutation
    setSelect(item: Item): void {
        this.selectedItem = item;
    }
}
