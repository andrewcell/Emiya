/**
 * @packageDocumentation
 * @module EmiyaT
 */
import {WordArray, enc, mode, pad, AES, DecryptedMessage} from 'crypto-js';

/**
 * Generate a key from secret word combinations.
 *
 * @returns {string} - Return key for encrypt/decrypt payload.
 * @example
 * ```ts
 * import { AES, WordArray } from 'crypto-js';
 * import { getKey } from 'Encryption';
 * const key: string = getKey();
 * const encrypted: WordArray = AES.encrypt('Plain data', key);
 * ```
 */
export const getKey = (): string => {
    return [***REMOVED***].toString()
}

/**
 * Convert the DecryptedMessage from Crypto-js to String using UTF-8
 *
 * @param {DecryptedMessage} value - DecryptedMessage from result of decrypt.
 * @returns {string} - Plain data before encrypt.
 * @example
 * ```ts
 * import { AES, DecryptedMessage } from 'crypto-js';
 * import { getString } from 'Encryption';
 * const decryptedMessage: DecryptedMessage = AES.decrypt('base64String', 'key');
 * const data: string = getString(decryptedMessage);
 * console.log('Decrypted! : ' + data);
 * ```
 */
export const getString = (value: DecryptedMessage): string => {
    return enc.Utf8.stringify(value)
}

/**
 * Convert Crypto-js WordArray to String.
 *
 * @param {WordArray} value - WordArray to convert string.
 * @returns {string} - Plain data before encrypt.
 * @deprecated
 */
export const getStringFromEncrypt = (value: WordArray): string => {
    return enc.Utf8.stringify(value)
}

/**
 * Decrypt base64 encoded ciphertext string using default key (key from getKey()).
 *
 * @param {string} base64 - Base64 string.
 * @returns {string} - Plain data before encrypt. Use getString().
 * @example
 * ```ts
 * import { decrypt } from 'Encryption';
 * const data: string = decrypt('fancyBase64EncodedCipherText');
 * console.log('Decrypted! : ' + data);
 * ```
 */
export const decrypt = (base64: string): string => {
    return getString(AES.decrypt(base64, getKey()));
}

/**
 * Encrypt plain data to base64 encoded ciphertext string using default key (key from getKey()).
 * @param {string} data - Plain data to encrypt.
 * @returns {string} - Base64 encoded ciphertext.
 * @example
 * ```ts
 * import { encrypt } from 'Encryption';
 * const encrypted: string = encrypt('verySecretInformation222');
 * console.log('Encrypted! : ' + encrypted);
 * ```
 */
export const encrypt = (data: string): string => {
    return AES.encrypt(data, getKey()).toString();
}

/**
 * Decrypt base64 encoded ciphertext from Java/Kotlin Application. (the key must be entered manually.)
 * @param {string} base64 - Base64 encoded ciphertext, encrypted in Java/Kotlin Application.
 * @returns {string} - Plain data before encrypt.
 * @example
 * ```ts
 * import { decryptJava } from 'Encryption';
 * const data: string = decryptJava('base64String');
 * console.log('Decrypted! : ' + data);
 * ```
 */
export const decryptJava = (base64: string): string => {
    const key = enc.Base64.parse('***REMOVED***');
    const iv = enc.Base64.parse('***REMOVED***');
    return enc.Utf8.stringify(AES.decrypt(
        base64,
        key,
        {mode: mode.CBC, padding: pad.Pkcs7, iv}))
}

/**
 * Encrypt plain data to base64 encoded ciphertext for Java/Kotlin Application. (the key must be entered manually.)
 *
 * @param {string} raw - Plain data to encrypt, decrypt in Java/Kotlin Application.
 * @returns {string} - Base64 encoded ciphertext.
 * @example
 * ```ts
 * import { encryptJava } from 'Encryption';
 * const encrypted: string = encryptJava('superSecretInformationForJava');
 * console.log('Encrypted! : ' + encrypted);
 * ```
 */
export const encryptJava = (raw: string): string => {
    const key = enc.Base64.parse('***REMOVED***');
    const iv = enc.Base64.parse('***REMOVED***');
    return AES.encrypt(raw, key, {mode: mode.CBC, padding: pad.Pkcs7, iv}).toString();
}