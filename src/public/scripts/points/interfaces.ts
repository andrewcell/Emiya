import {PageStatus} from './enums';

export interface PointsMainStates {
    myPoints: Map<string, number>;
    pageStatus: PageStatus;
}