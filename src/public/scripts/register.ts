import {AJAX, AjaxResult} from './ajax';
import { b64 } from './b64';
import {encrypt, decrypt} from './encryption/AES';

export class Register {
    public static async register(username: string, password: string, password2: string, email: string): Promise<AjaxResult> {
        const result: AjaxResult = await AJAX.send({data: encrypt(JSON.stringify({username, password, password2, email}))}, new b64('L2FkbWluL3JlZ2lzdGVy'));
        const registerResult: RegisterCode = RegisterCode[result.code as keyof typeof RegisterCode]
        return Promise.resolve({code: result.code, comment: result.comment, enumResult: registerResult});
    }

    public static checkPassword(password: string, password2: string): boolean {
        return password === password2
    }

    public static validatePassword(password: string): boolean {
        const regex = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
        if (password.length < 6) {
            return false;
        }

        return !!password.match(regex);
    }

    public static validateUsername(username: string): boolean {
        const regex = /[^a-z\d]/i;
        if (username.length < 4 || username.length > 24) {
            return false;
        }
        return !regex.exec(username);
    }
}

export enum RegisterCode {
    Success = 'register00',
    PasswordValidationFailed = 'register01',
    PasswordDoNotMatch = 'register02',
    UsernameOccupied = 'register03',
    EmailOccupied = 'register04',
    BannedClient = 'register05',
    RegisterNotAllowed = 'register06',
    EmailVerificationRequired = 'register07',
    InternalError = '500'
}

