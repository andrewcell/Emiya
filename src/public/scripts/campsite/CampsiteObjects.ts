export interface CampsiteTry {
    code: string;
    personality: string;
    month: number;
    day: number;
    year: number;
}

export interface CampsiteContent {
    targetCode: string;
    done: boolean;
    tries: CampsiteTry[];
}