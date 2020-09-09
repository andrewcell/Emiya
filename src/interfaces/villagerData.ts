/**
 * @packageDocumentation
 * @module Emibo
 */
export interface EmiboVillager {
    /** Name */ name: string;
    name_kor: string;
    num: string;
    number: string;
    file: string;
    image: string;
    series: string;
    personality: string[];
    species: string[];
    phrase: string[];
    birthday: string;
    sex: string;
    star: string;
}
/* import {Color, Hobby, Personality, Species, Style} from '../public/scripts/villagers/enums';

export interface VillagerRaw {
    Name: string;
    IconImage: string;
    PhotoImage: string;
    HouseImage: string;
    Species: string;
    Gender: string;
    Personality: string;
    Subtype: string;
    Hobby: string;
    Birthday: string;
    Catchphrase: string;
    FavoriteSong: string;
    FavoriteSaying: string;
    Style1: string;
    Style2: string;
    Color1: string;
    Color2: string;
    DefaultClothing: number;
    Wallpaper: string;
    Flooring: string;
    FurnitureList: string;
    FurnitureNameList: string;
    NameColor: string;
    BubbleColor: string;
    Filename: string;
    UniqueEntryId: string;
}

export interface LocalizationString {
    Korean: string;
    English: string;
    Japanese: string;
}

export interface Villager {
    name: LocalizationString;
    iconImageUrl: string;
    posterImageUrl: string;
    houseImageUrl: string;
    species: Species;
    male: boolean;
    personality: Personality;
    subtype: 'A' | 'B';
    hobby: Hobby;
    birthday: Date;
    catchphrase: LocalizationString;
    song: LocalizationString;
    saying: LocalizationString;
    style1: Style;
    style2: Style;
    color1: Color;
    color2: Color;
    defaultClothing: number;
    wallpaper: LocalizationString;
    flooring: LocalizationString;
    furnitureList: string;
    furnitureNameList: string;
    nameColor: number;
    bubbleColor: number;
    code: string;
    uniqueEntryId: string;
}

export interface VillagerJSON {
    data: Villager[]
}
*/
