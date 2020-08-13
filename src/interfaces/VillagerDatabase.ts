/* import {getDataPath} from '@shared/functions';
import logger from '@shared/Logger';
import {LocalizationString, Villager, VillagerRaw} from '@interfaces/villagerData';
import {readFileSync} from 'fs';
import {Color, Hobby, Personality, Species, Style} from '../public/scripts/villagers/enums';

export class VillagerDatabase {
    private static getLanguage(language: string): string {
        switch (language) {
            case 'ko_KR':
                return 'korean';
            case 'ja_JP':
                return 'japanese';
            default:
                return 'english';
        }
    }

    private static objectToVillager(object: VillagerRaw): Villager {
        return {
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
    }

    public static getAllVillager(): Villager[] {
        const jsonString: VillagerRaw[] = JSON.parse(readFileSync(getDataPath('Villagers.json'), 'utf8'))
        jsonString.map(vr => {
            this.objectToVillager()
        });
        /* const stmt = this.engine.prepare('SELECT  a.id as id, a.personality, a.hobby, a.type, a.birthday, a.style1, a.style2, a.color1, a.color2, a.voicetone, a.species, a.code, d.korean as name_kor, d.english as name_english, c.korean as motto_kor, c.english as motto_english, b.korean as phrase_kor, b.english as phrase_english, defaultclothes FROM villager as a INNER JOIN phrase as b ON a.phraseid=b.id INNER JOIN motto as c ON a.mottoid=c.id INNER JOIN name as d ON a.nameid=d.id;')
        return stmt.iterate();
    }

    public getAllVillagerByLanguage(language: string) {
        const stmt = this.engine.prepare('SELECT  a.id as id, a.personality, a.hobby, a.type, a.birthday, a.style1, a.style2, a.color1, a.color2, a.voicetone, a.species, a.code, d.korean as name_kor, d.english as name_english, c.korean as motto, b.korean as phrase_kor, b.english as phrase_english FROM villager as a INNER JOIN phrase as b ON a.phraseid=b.id INNER JOIN motto as c ON a.mottoid=c.id INNER JOIN name as d ON a.nameid=d.id;')
        return stmt.iterate();
    }
} */

