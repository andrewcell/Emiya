import Axios from "axios";
import {emiyaJ} from "../api";
import {l} from "../locale";

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

    public send(data: string, path: string): Promise<string> {
        if (this.token == null) {
            return Promise.reject(l('emiyaj.tokenempty'))
        }
        return new Promise<string>((resolve, reject) => {
            Axios.post(emiyaJ + path, {data}, {headers: {token: this.token}})
                .then(r => {
                    return resolve('')
                })
                .catch(e => {
                    return reject('')
                })
        })
    }
}