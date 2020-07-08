import {PageStatus} from './enums';

export interface PointsState {
    myPoints: Map<string, number>;
    pageStatus: PageStatus;
    token: string | null;
}