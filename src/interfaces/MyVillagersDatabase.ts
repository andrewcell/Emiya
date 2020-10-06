/**
 * @packageDocumentation
 * @module EmiyaT
 */

import logger from '@shared/Logger';
import User from '@shared/User';

export interface VillagerStorage {
    [key: string]: string[];
}

export default class MyVillagersDatabase {
    private static instance: MyVillagersDatabase;

    /**
     * Single-ton constructor ignored.
     *
     * @private
     * @example
     * ```ts
     * const database = MyVillagersDatabase.getInstance();
     * ```
     */
    private constructor() {}

    /**
     * Get instance of MyVillagersDatabase if not initialized, create one and return.
     *
     * @returns {MyVillagersDatabase} - Instance of My villagers database.
     * @example
     * ```ts
     * const database = MyVillagersDatabase.getInstance();
     * ```
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
     * ```ts
     * void MyVillagersDatabase.getInstance().setMyVillager('userid123', ['cat23', 'cbr19']).then(() => { console.log('Updated! or maybe failed. Check your server log!') });
     * ```
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
     * ```ts
     * void MyVillagersDatabase.getInstance().changeGroup('userid123', 'OtherNintendoVillagers').then(villagers => {
     *     console.log(`Here is your villagers' codes: ${villagers}`);
     * });
     * ```
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
     * ```ts
     * void MyVillagersDatabase.getInstance().getStorage('userid123').then(storage => {
     *     Object.entries(storage).map(group => {
     *         console.log(`${group[0]}: ${group[1]}`);
     *     });
     * });
     * ```
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
     * @param {string} groupName - Name of new group.
     * @returns {boolean} - If worked without any error, returns true.
     * @example
     * ```ts
     * void addGroup('userid123', 'newGroup').then(isSuccess => { if (isSuccess) { console.log('Created!'); } });
     * ```
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

    /**
     * Delete group from exist villagers storage.
     *
     * @param {string} userId - Reference id of user document.
     * @param  {string} groupName - Name of new group.
     * @returns {string} - If worked without any error, returns new selected group name.
     * @example
     * ```ts
     * void deleteGroup('userid123', 'oldGroup').then(isSuccess => { if (isSuccess) { console.log('Deleted!'); } });
     * ```
     */
    public deleteGroup(userId: string, groupName: string): Promise<[string, boolean]> {
        const objectIsEmpty = (obj: VillagerStorage): boolean => {
            return Object.keys(obj).length === 0 && obj.constructor === Object
        }
        return new Promise(r => {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        const storage = user.villagers;
                        if (groupName in storage) {
                            const groupList = Object.keys(storage);
                            const index = groupList.indexOf(groupName);
                            if (index === -1) {
                                return r(['', false]);
                            } else {
                                delete storage[groupName];
                                if (objectIsEmpty(storage)) {
                                    User.findByIdAndUpdate(userId, {villagers: {'Default': []}, villagersGroup: 'Default'})
                                        .then(() => {
                                            return r(['Default', true]);
                                        })
                                        .catch((e: Error) => {
                                            logger.error(e.message, e);
                                            return r(['', false]);
                                        });
                                } else {
                                    let lastGroup = index - 1;
                                    if (lastGroup < 0) lastGroup = 1;
                                    User.findByIdAndUpdate(userId, {
                                        villagers: storage,
                                        villagersGroup: groupList[lastGroup]
                                    })
                                        .then(() => {
                                            return r([groupList[lastGroup], false]);
                                        })
                                        .catch((e: Error) => {
                                            logger.error(e.message, e);
                                            return r(['', false]);
                                        });
                                }
                            }
                        } else {
                            return r(['', false]);
                        }
                    }
                })
                .catch((e: Error) => {
                    logger.error(e.message, e);
                    return r(['', false]);
                });
        })
    }
}