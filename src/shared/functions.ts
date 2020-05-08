import logger from './Logger';
import path from 'path'

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