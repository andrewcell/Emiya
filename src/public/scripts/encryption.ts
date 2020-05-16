import {WordArray, enc, DecryptedMessage, AES} from 'crypto-js';

export const getKey = () => {
    return ['.container', 'vimac', 'body', 'sec', 'wait', 'react', 'production.js'].toString()
}

export const getString = (value: CryptoJS.DecryptedMessage): string => {
    return enc.Utf8.stringify(value)
}

export const decrypt = (base64: string): string => {
    return getString(AES.decrypt(base64, getKey()));
}
