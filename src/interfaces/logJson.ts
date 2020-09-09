/**
 * @packageDocumentation
 * @module Emibo
 */
export interface Log {
    /** Card number */
    cardNumber: string;
    /** English name of villager */
    name: string;
    /** Korean name of villager */
    nameKor: string;
    /** Timestamp */
    now: string;
    /** Client IP Address */
    ip: string;
    /** Used key string */
    key: string;
}

export interface LogJson {
    /** Log array */
    data: Log[];
}
