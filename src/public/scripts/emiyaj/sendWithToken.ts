import Axios from 'axios';
import {emiyaJ} from '../api';
import {l} from '../locale';

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
        console.log(this.token);
        this.setToken();
        if (this.token == null) {
            return Promise.reject(l('emiyaj.tokenempty'))
        }
        return new Promise<string>((resolve, reject) => {
            Axios.get(emiyaJ + path, {headers: {token: this.token}})
                .then(r => {
                    console.log(r)
                    return resolve(r.data)
                })
                .catch(e => {
                    return reject(e);
                })
        });
    }

    public send(data: string, path: string): Promise<string> {
        this.setToken();
        if (this.token == null) {
            return Promise.reject(l('emiyaj.tokenempty'))
        }
        return new Promise<string>((resolve, reject) => {
            Axios.post(emiyaJ + path, {data}, {headers: {token: this.token}})
                .then(r => {
                    console.log(r)
                    return resolve('')
                })
                .catch(e => {
                    return reject(e)
                })
        })
    }
}