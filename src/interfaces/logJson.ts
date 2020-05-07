
export interface Log {
    cardNumber: string;
    name: string;
    nameKor: string;
    now: string;
    ip: string;
    key: string;
}

export interface LogJson {
    data: Log[];
}
