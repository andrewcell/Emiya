import $ from 'jquery';
import {b64} from './b64';

export class AJAX {
    public static async send(data: any, url: b64): Promise<AjaxResult> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: url.decode(),
                data: data,
                success: (data) => {
                    resolve({code: data.code, comment: data.comment});
                },
                error: (err) => {
                    resolve({code: 500, comment: 'Internal Server Error.'})
                }
            });
        });
    }
}

export interface AjaxResult {
    code: string | number,
    comment: string
}
