/**
 * @packageDocumentation
 * @hidden
 */

import axios from 'axios';
import logger from '@shared/Logger';

interface LanguageDatabase {
    [key: string]: number;
}

class Github {
    static data: LanguageDatabase = {};

    static refresh(): void {
        const get = (repo: string): Promise<void> => {
            return new Promise(resolve => {
                axios.get(`https://api.github.com/repos/***REMOVED***cell/${repo}/languages`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB}`
                    }
                }).then(r => {
                    for (const [key, value] of Object.entries(r.data as LanguageDatabase)) {
                        if (key in this.data) {
                            this.data[key] += value;
                        } else {
                            this.data[key] = value;
                        }
                    }
                    return resolve();
                }).catch(e => {
                    logger.error(e)
                    return resolve();
                })
            });
        }
        void get('Emiya').then(() => {return});
        void get('EmiyaJ').then(() => {return});
        void get('EmiyaP').then(() => {return});
        void get('Emibo').then(() => {return});
    }
}

export default Github;
