import {AJAX, AjaxResult} from './ajax';
import { b64 } from './b64';

export class Register {
    public static async register(username: string, password: string, password2: string, email: string): Promise<AjaxResult> {
        const result: AjaxResult = await AJAX.send({username, password, password2, email}, new b64('L2FkbWluL3JlZ2lzdGVy'));
        const registerResult: RegisterCode = RegisterCode[result.code as keyof typeof RegisterCode]
        switch (registerResult) {
            case RegisterCode.Success:
                return Promise.resolve({code: result.code, comment: 'success'});
                break;
            case RegisterCode.PasswordValidationFailed:
            case RegisterCode.PasswordDoNotMatch:
            case RegisterCode.UsernameOccupied:
            case RegisterCode.EmailOccupied:
            case RegisterCode.BannedClient:
            default:
                return Promise.resolve({code: result.code, comment: result.comment});
        }
    }

    public static checkPassword(password: string, password2: string): boolean {
        return password === password2
    }

    public static validatePassword(password: string): boolean {
        const regex = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
        if (password.length < 6) {
            return false;
        }

        if (password.match(regex)) {
            return true;
        } else {
            return false;
        }

    }
}

enum RegisterCode {
    Success = 'register00',
    PasswordValidationFailed = 'register01',
    PasswordDoNotMatch = 'register02',
    UsernameOccupied = 'register03',
    EmailOccupied = 'register04',
    BannedClient = 'register05',
    InternalError = '500'
}

