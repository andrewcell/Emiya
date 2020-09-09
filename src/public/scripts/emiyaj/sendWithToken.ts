import Axios from 'axios';
import {emiyaJ} from '../api';
import {l} from '../locale';
import {TokenResult} from './TokenResult';

interface Response {
    code: string;
    comment: string;
    data: string | null;
}

export class EmiyaJ {
    private static instance: EmiyaJ;

    private constructor() { return }

    public static getInstance(): EmiyaJ {
        if (!EmiyaJ.instance) {
            EmiyaJ.instance = new EmiyaJ();
        }
        return EmiyaJ.instance
    }

    private token = localStorage.getItem('token');

    private setToken(): void {
        this.token = localStorage.getItem('token');
    }

    public static path(...path: string[]): string {
        let url = '';
        path.map(str => {
            url += `/${str}`;
        })
        return url;
    }

    public get(path: string): Promise<string> {
        this.setToken();
        if (this.token == null) {
            return Promise.reject(l('emiyaj.tokenempty'))
        }
        return new Promise<string>((resolve, reject) => {
            Axios.get(emiyaJ + path, {headers: {token: this.token}})
                .then(r => {
                    const res = r.data as Response
                    switch (res.code) {
                        case TokenResult.EXPIRED:
                            location.replace('/admin/logout');
                            return reject(l('emiya.tokenexpired'));
                        default:
                            if (res.data != null) {
                                return resolve(res.data);
                            } else {
                                return resolve('');
                            }
                    }
                })
                .catch(e => {
                    return reject(e);
                })
        });
    }

    public send(data: string, path: string): Promise<string> {
        const message = this.prehandleToken()
        if (this.prehandleToken() == null) {
            return new Promise<string>((resolve, reject) => {
                Axios.post(emiyaJ + path, {data}, {headers: {token: this.token}})
                    .then(r => {
                        const res = r.data as Response
                        switch (res.code) {
                            case TokenResult.EXPIRED:
                                location.replace('/admin/logout');
                                return reject(l('emiya.tokenexpired'));
                            default:
                                if (res.data != null) {
                                    return resolve(res.data);
                                } else {
                                    return resolve('');
                                }
                        }
                    })
                    .catch(() => {
                        return reject(l('emiyaj.invaliderror'))
                    })
            })
        } else {
            return Promise.reject(message);
        }
    }

    private prehandleToken(): string | null {
        this.setToken();
        if (this.token == null) {
            return l('emiyaj.tokenempty')
        } else {
            return null
        }
    }
}