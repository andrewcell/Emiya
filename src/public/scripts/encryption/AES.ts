import {WordArray, enc, DecryptedMessage, AES} from 'crypto-js';

export const getKey = () => {
    return [***REMOVED***].toString()
}

export const getString = (value: CryptoJS.DecryptedMessage): string => {
    return enc.Utf8.stringify(value)
}

export const getStringFromEncrypt = (value: WordArray): string => {
    return enc.Utf8.stringify(value)
}

export const decrypt = (base64: string): string => {
    return getString(AES.decrypt(base64, getKey()));
}

export const encrypt = (data: string): string => {
    return AES.encrypt(data, getKey()).toString();
}
