import $ from 'jquery';
import {b64} from './b64';

export class AJAX {
    public static async send(data: any, url: b64): Promise<string> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: url.decode(),
                data: data,
                success: (data) => {
                    resolve(data.code as string);
                },
                error: (err) => {
                    reject('internalerror')
                }
            });
        });
    }
}
