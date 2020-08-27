declare namespace Express {
    interface Session {
        myVillagers: string[];
        group: string;
        requireUpdate: boolean;
    }
}