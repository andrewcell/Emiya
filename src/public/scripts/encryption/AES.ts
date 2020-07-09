import {AES, enc, mode, pad, WordArray} from 'crypto-js';

export const getKey = (): string => {
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

export const decryptJava = (base64: string): string => {
    const key = enc.Base64.parse('***REMOVED***');
    const iv = enc.Base64.parse('***REMOVED***');
    return enc.Utf8.stringify(AES.decrypt(
        base64,
        key,
        {mode: mode.CBC, padding: pad.Pkcs7, iv}))
}

export const encryptJava = (raw: string): string => {
    const key = enc.Base64.parse('***REMOVED***');
    const iv = enc.Base64.parse('***REMOVED***');
    return AES.encrypt(raw, key, {mode: mode.CBC, padding: pad.Pkcs7, iv}).toString();
}
