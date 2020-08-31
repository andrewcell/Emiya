import sqlite3, {SqliteError} from 'better-sqlite3';
import {getDataPath} from '@shared/functions';
import logger from '@shared/Logger';
import User, {UserDocument} from '@shared/User';

export const resize = (arr: any[], newSize: number, defaultValue: any): any[] => {
    const ad = arr;
    while(newSize > ad.length)
        ad.push(defaultValue);
    ad.length = newSize;
    return ad
}

export interface VillagerStorage {
    [key: string]: string[];
}

class MyVillagersDatabase {
    private static instance: MyVillagersDatabase;
    private constructor() {}

    public static getInstance(): MyVillagersDatabase {
        if (!MyVillagersDatabase.instance) {
            MyVillagersDatabase.instance = new MyVillagersDatabase();
        }
        return MyVillagersDatabase.instance
    }

    public close(): void {
        logger.info('My Villagers Database successfully closed.')
        // this.engine.close();
    }

    public getMyVillagers(userId: string): Promise<[string, string[], string[]]> {
        return new Promise((resolve) => {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        resolve([user.villagersGroup, user.villagers[user.villagersGroup], Object.keys(user.villagers)]);
                    }
                    return resolve(['', [], []]);
                })
                .catch((err: Error) => {
                    logger.error(err.message, err);
                    return resolve(['', [], []]);
                });
        });
    }

    public setMyVillager(userId: string, codeArray: string[]): Promise<void> {
        return new Promise<void>(resolve => {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        const storage = user.villagers
                        storage[user.villagersGroup] = codeArray;
                        User.findByIdAndUpdate(userId, {villagers: storage})
                            .then(() => resolve())
                            .catch(err => {logger.error(err.message, err); resolve()})
                    }
                })
                .catch(err => {
                    logger.error(err.message, err);
                    resolve();
                })
        });
    }

    public changeGroup(userId: string, groupName: string): Promise<string[]> {
        return new Promise<string[]>(resolve => {
        User.findById(userId)
            .then(user => {
                if (user) {
                    if (groupName in user.villagers) {
                        User.findByIdAndUpdate(userId, {villagerGroup: groupName})
                            .then(u => {
                                if (u != null) {
                                    resolve(u.villagers[u.villagersGroup])
                                }
                            })
                            .catch(err => {
                                logger.error(err.message, err);
                                resolve();
                            })
                    } else {
                        resolve(['error'])
                    }
                }
            })
            .catch(err => {
                logger.error(err.message, err);
                resolve();
            })
        });
    }

}
/* SQLite 3
class MyVillagersDatabase {
    private static instance: MyVillagersDatabase;
    // private engine = sqlite3('MyVillagers.db');

    // private columns = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

    private constructor() {}

    public static getInstance(): MyVillagersDatabase {
        if (!MyVillagersDatabase.instance) {
            MyVillagersDatabase.instance = new MyVillagersDatabase();
        }
        return MyVillagersDatabase.instance
    }

    public close(): void {
        logger.info('My Villagers Database successfully closed.')
        // this.engine.close();
    }

    public getMyVillagers(userId: string): string[] {
        try {
            const stmt = this.engine.prepare('SELECT first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth FROM my WHERE userid = ?').get(userId);
            const arr: string[] = [];
            for (const [k ,v] of Object.entries(stmt)) {
                if (this.columns.includes(k)) {
                    arr.push(v as string);
                }
            }
            return arr;
        } catch (e) {
            logger.error(e.message, e);
            return [];
        }
    }

    public setMyVillager(userId: string, dataArray: string[]): void {
        const length = dataArray.length;
        const data = resize(dataArray, 10, null);
        // UPDATE my SET first=?,second=?,third=?,fourth=?,fifth=?,sixth=?,seventh=?,eighth=?,ninth=?,tenth=? WHERE userid=?;
        const stmt = this.engine.prepare('INSERT OR REPLACE INTO my (first,second,third,fourth,fifth,sixth,seventh,eighth,ninth,tenth,userid) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
        const result = stmt.run(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],userId);
        if (result.changes === 1) {
            // return true;
        }
    }
}*/

export default MyVillagersDatabase
