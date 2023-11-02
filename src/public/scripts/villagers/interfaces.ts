import {Catalog, ClothesType, Color, Season, Source, Species, Style} from './enums';
import { Villager } from 'animal-crossing/lib/types/Villager';

/* interface Villager {
    id: number;
    personality: string;
    hobby: string;
    type: 'A' | 'B' | 0 | 1;
    birthday: string;
    style1: Style;
    style2: Style;
    color1: Color;
    color2: Color;
    voicetone: number;
    species: Species | string;
    code: string;
    nameKor: string;
    nameEng: string;
    mottoKor: string;
    mottoEng: string;
    phraseKor: string;
    phraseEng: string;
    defaultClothes: string;
} */

interface VillagersListProp {
    locale: string;
    addVillager: (villager: string) => Promise<string>;
    removeVillager: (v: Villager) => Promise<string>;
    data: Villager[];
}

interface MyVillagersState {
    locale: string;
    code: string[];
    selectedCode: string;
    dialog: boolean;
    groupDialog: boolean;
}

interface SearchQuery {
    personality: string;
    type?: 'A' | 'B' | '';
    style: string;
    name: string;
    species: string;
    hobby: string;
    changed: boolean;
    code?: string;
    dialog: boolean;
    phrase: string;
    snackbar: boolean;
    snackbarMessage: string;
}

interface ClothesPanelProps {
    title: string;
    type: string;
    data: Clothes[];
}

interface Clothes {
    uniqueId: string;
    name: string;
    nameKorean: string;
    buy: number;
    sell: number;
    miles: number;
    color1: Color;
    color2: Color;
    style1: Style;
    style2: Style;
    season: Season;
    mannequin: boolean;
    catalog: Catalog;
    source: Source;
    internalId: number;
    filename: string;
    variation: string;
    type: ClothesType;
}

interface VillagerSearchByClothesPanelProp {
    title: string;
    data: Villager[];
}

export interface VillagerStorage {
    [key: string]: string[];
}

export interface VillagerStorageByVillager {
    [key: string]: Villager[];
}

export type Query = {[key: string]: string}

export {VillagersListProp, MyVillagersState, SearchQuery, ClothesPanelProps, Clothes, VillagerSearchByClothesPanelProp};
