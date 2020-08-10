import axios from 'axios';
import moment from 'moment';
import {encrypt} from '@shared/Encryption';
import logger from '@shared/Logger';

interface LanguageDatabase {
    language: string;
    lines: number;
}

class Github {
    static data: LanguageDatabase[] = [];

    static refresh(): void {
        this.data = [];
        const get = (repo: string): Promise<void> => {
            return new Promise(resolve => {
                axios.get(`https://api.github.com/repos/***REMOVED***cell/${repo}/languages`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB}`
                    }
                }).then(r => {
                    for (const [key, value] of Object.entries(r.data)) {
                        const db: LanguageDatabase = {
                            language: key,
                            lines: value as number
                        }
                        this.data.push(db)
                    }
                    return resolve();
                }).catch(e => {
                    logger.error(e)
                    return resolve();
                })
            });
        }
        get('Emiya').then(() => {return});
        get('EmiyaJ').then(() => {return});
        get('EmiyaP').then(() => {return});
    }
}

export default Github;