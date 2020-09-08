import logger from '@shared/Logger';
import User from '@shared/User';

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
                            .catch((e: Error) => {logger.error(e.message, e); resolve()})
                    }
                })
                .catch((err: Error) => {
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
                        User.findByIdAndUpdate(userId, {villagersGroup: groupName})
                            .then(u => {
                                if (u != null) {
                                    resolve(u.villagers[groupName])
                                }
                            })
                            .catch((e: Error) => {
                                logger.error(e.message, e);
                                resolve();
                            })
                    } else {
                        resolve(['error'])
                    }
                }
            })
            .catch((err: Error) => {
                logger.error(err.message, err);
                resolve();
            })
        });
    }

    public getStorage(userId: string): Promise<VillagerStorage> {
        return new Promise<VillagerStorage>((resolve) => {
        User.findById(userId)
            .then(user => {
                if (user) {
                    return resolve(user.villagers);
                } else {
                    return {};
                }
            })
            .catch((e: Error) => {
                logger.error(e.message, e);
                return {};
            });
        })
    }

    public addGroup(userId: string, groupName: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        const villagers = user.villagers;
                        if (groupName in villagers) {
                            return resolve(false);
                        }
                        villagers[groupName] = [];
                        User.findByIdAndUpdate(userId, {villagers})
                            .then(() => {
                                return resolve(true);
                            })
                            .catch((e: Error) => {
                                logger.error(e.message, e);
                                return resolve(false);
                            })
                    }
                })
                .catch((e: Error) => {
                    logger.error(e.message, e);
                    return resolve(false);
                })
        })
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
