import sqlite3 from 'better-sqlite3';
import {getDataPath} from '@shared/functions';
import logger from '@shared/Logger';

export class VillagerDatabase {
    private static instance: VillagerDatabase;
    private engine = sqlite3(getDataPath('villagers.db'));


    private constructor() { }

    public static getInstance(): VillagerDatabase {
      if (!VillagerDatabase.instance) {
          VillagerDatabase.instance = new VillagerDatabase();
      }
      return VillagerDatabase.instance
    }

    public close(): void {
        logger.info('Villager Database successfully closed.')
        this.engine.close();
    }

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

    public getAllVillager() {
        const stmt = this.engine.prepare('SELECT  a.id as id, a.personality, a.hobby, a.type, a.birthday, a.style1, a.style2, a.color1, a.color2, a.voicetone, a.species, a.code, d.korean as name_kor, d.english as name_english, c.korean as motto_kor, c.english as motto_english, b.korean as phrase_kor, b.english as phrase_english FROM villager as a INNER JOIN phrase as b ON a.phraseid=b.id INNER JOIN motto as c ON a.mottoid=c.id INNER JOIN name as d ON a.nameid=d.id;')
        return stmt.iterate();
    }

    public getAllVillagerByLanguage(language: string) {
        const stmt = this.engine.prepare('SELECT  a.id as id, a.personality, a.hobby, a.type, a.birthday, a.style1, a.style2, a.color1, a.color2, a.voicetone, a.species, a.code, d.korean as name_kor, d.english as name_english, c.korean as motto, b.korean as phrase_kor, b.english as phrase_english FROM villager as a INNER JOIN phrase as b ON a.phraseid=b.id INNER JOIN motto as c ON a.mottoid=c.id INNER JOIN name as d ON a.nameid=d.id;')
        return stmt.iterate();
    }
}

