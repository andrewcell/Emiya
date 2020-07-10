import Axios from "axios";
import {emiyaJ} from "../api";

export class EmiyaJ {
    private static instance: EmiyaJ;

    private constructor() { return }

    public static getInstance(): EmiyaJ {
        if (!EmiyaJ.instance) {
            EmiyaJ.instance = new EmiyaJ();
        }
        return EmiyaJ.instance
    }

    private token: string = '';

    public send(data: string, path: string): void {
        Axios.post(emiyaJ + path, {data: data})
    }
}