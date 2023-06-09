/**
 * @packageDocumentation
 * @module EmiyaT
 */
import logger from './Logger';
import path from 'path'
import {VillagerStorage} from "@interfaces/MyVillagersDatabase";

/**
 * Log error into Logger
 * @param {Error} err - Error
 * @example
 * ```ts
 * try {
 *     const a = 1 / 0;
 * } catch (e: Error) {
 *     pErr(e);
 * }
 * ```
 */
export const pErr = (err: Error): void => {
    if (err) {
        logger.error(err);
    }
};

export const getRandomInt = (): number => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const getDataPath = (filename: string): string => {
    return path.join(__dirname, '../data/' + filename);
}

export const getRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const objectIsEmpty = (obj: VillagerStorage): boolean => {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}