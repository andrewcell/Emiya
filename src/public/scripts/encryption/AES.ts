import {AES, enc, mode, pad, WordArray} from 'crypto-js';

export const getKey = (): string => {
    return 'Put_your_own_key_here'
}

export const getJavaKey = (): string => {
    return 'Put_your_own_java_key_here';
}

export const getJavaIv = (): string => {
    return 'Put_your_own_java_iv_here';
}

/**
 * Converts a decrypted message into a UTF-8 encoded string.
 *
 * @param {CryptoJS.DecryptedMessage} value - The decrypted message to be converted.
 * @returns {string} The UTF-8 encoded string representation of the decrypted message.
 */
export const getString = (value: CryptoJS.DecryptedMessage): string => {
    return enc.Utf8.stringify(value)
}

/**
 * Converts an encrypted WordArray to a UTF-8 string.
 *
 * @param {WordArray} value - The encrypted WordArray to be converted into a string.
 * @returns {string} The UTF-8 string representation of the given WordArray.
 */
export const getStringFromEncrypt = (value: WordArray): string => {
    return enc.Utf8.stringify(value)
}

/**
 * Decrypts an input Base64-encoded string using AES decryption.
 *
 * This function takes a Base64-encoded string as input and decrypts it
 * using an AES decryption algorithm. The decryption key is retrieved
 * from the `getKey` function. The output is returned as a plain string.
 *
 * @param {string} base64 - The Base64-encoded string to be decrypted.
 * @returns {string} The decrypted plain string.
 */
export const decrypt = (base64: string): string => {
    return getString(AES.decrypt(base64, getKey()));
}

/**
 * Encrypts a given string using the AES encryption algorithm.
 *
 * This function takes a plaintext string as input and applies the AES encryption algorithm
 * to secure the data. The encryption key is dynamically retrieved using the `getKey` function.
 * The output of the encryption is returned as a string.
 *
 * @param {string} data - The plaintext data to be encrypted.
 * @returns {string} The encrypted string.
 */
export const encrypt = (data: string): string => {
    return AES.encrypt(data, getKey()).toString();
}

/**
 * Decrypts a Base64-encoded string using AES encryption in CBC mode with PKCS#7 padding.
 *
 * @param {string} base64 - The Base64-encoded string to decrypt.
 * @returns {string} - The decrypted plaintext string.
 */
export const decryptJava = (base64: string): string => {
    const key = String(enc.Base64.parse(getJavaKey()));
    const iv = String(enc.Base64.parse(getJavaIv()));
    return enc.Utf8.stringify(AES.decrypt(
        base64,
        key,
        {mode: mode.CBC, padding: pad.Pkcs7, iv}))
}

/**
 * Encrypts a given plaintext string using AES encryption in CBC mode with PKCS7 padding.
 * The encryption process utilizes a predefined key and IV (Initialization Vector) in Base64 format.
 *
 * @param {string} raw - The plaintext string to be encrypted.
 * @returns {string} The Base64-encoded ciphertext resulting from the encryption process.
 */
export const encryptJava = (raw: string): string => {
    const key = String(enc.Base64.parse(getJavaKey()));
    const iv = String(enc.Base64.parse(getJavaIv()));
    return AES.encrypt(raw, key, {mode: mode.CBC, padding: pad.Pkcs7, iv}).toString();
}
