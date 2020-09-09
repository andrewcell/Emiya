/**
 * @packageDocumentation
 * @module EmiyaT
 */

import logger from '@shared/Logger';
import User from '@shared/User';

export interface VillagerStorage {
    [key: string]: string[];
}

/**
 * Class of My villagers Database
 */
class MyVillagersDatabase {
    private static instance: MyVillagersDatabase;

    /**
     * Single-ton constructor ignored.
     *
     * @private
     * @example
     * const database = MyVillagersDatabase.getInstance();
     */
    private constructor() {}

    /**
     * Get instance of MyVillagersDatabase if not initialized, create one and return.
     *
     * @returns {MyVillagersDatabase} - Instance of My villagers database.
     * @example
     * const database = MyVillagersDatabase.getInstance();
     */
    public static getInstance(): MyVillagersDatabase {
        if (!MyVillagersDatabase.instance) {
            MyVillagersDatabase.instance = new MyVillagersDatabase();
        }
        return MyVillagersDatabase.instance
    }

    /**
     * Close database and disconnect remote server.
     *
     * @deprecated
     * @example
     * ```ts
     * MyVillagersDatabase.getInstance().close();
     * ```
     */
    public close(): void {
        logger.info('My Villagers Database successfully closed.')
        // this.engine.close();
    }

    /**
     * Get selected group name, my villagers code list, list of groups as array.
     *
     * @param {string} userId - ObjectId of user.
     * @returns {string[]} - Index 0- Selected group, 1- Code list of my villagers from selected group, 2- List of groups.
     * @example
     * ```ts
     * void MyVillagersDatabase.getInstance().getMyVillagers('userid123').then(arr => {
     *     const selectedGroup = arr[0];
     *     const myVillagers = arr[1];
     *     const groups = arr[2];
     *     console.log(`You selected this group : ${selectedGroup}, Your villagers: ${myVillagers}, Your groups: ${groups}`)
     * });
     * ```
     */
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

    /**
     * Update my villager code list to database.
     *
     * @param {string} userId - ObjectId of user.
     * @param {string[]} codeArray - Array of villagers codes.
     * @returns {Promise<void>} - Returns nothing even success or fail.
     * @example
     * void MyVillagersDatabase.getInstance().setMyVillager('userid123', ['cat23', 'cbr19']).then(() => { console.log('Updated! or maybe failed. Check your server log!') });
     */
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

    /**
     * Select a different group and update the selected group field.
     *
     * @param {string} userId - ObjectId of user.
     * @param {string} groupName - Name of exists group.
     * @returns {string[]} - Return my villagers' code list of the newly selected group. If the group does not exist or on error, return an empty array.
     * @example
     * void MyVillagersDatabase.getInstance().changeGroup('userid123', 'OtherNintendoVillagers').then(villagers => {
     *     console.log(`Here is your villagers' codes: ${villagers}`);
     * });
     */
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
                                resolve([]);
                            })
                    } else {
                        resolve([])
                    }
                }
            })
            .catch((err: Error) => {
                logger.error(err.message, err);
                resolve();
            })
        });
    }

    /**
     * Get whole villagers storage of user.
     *
     * @param {string} userId - ObjectId of user.
     * @returns {VillagerStorage} - Return storage from the database. If on error or not exists user, returns an empty object.
     * @example
     * void MyVillagersDatabase.getInstance().getStorage('userid123').then(storage => {
     *     Object.entries(storage).map(group => {
     *         console.log(`${group[0]}: ${group[1]}`);
     *     });
     * });
     */
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

    /**
     * Add group to exist villagers storage.
     *
     * @param {string} userId - Reference id of user document.
     * @param  {string} groupName - Name of new group.
     * @returns {boolean} - If worked without any error, returns true.
     * @example
     * void addGroup('userid123', 'newGroup').then(isSuccess => { if (isSuccess) { console.log('Created!'); } });
     */
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
