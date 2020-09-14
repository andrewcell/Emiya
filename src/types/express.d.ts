declare namespace Express {
    interface Session {
        myVillagers: string[];
        group: string;
        groups: string[];
        requireUpdate: boolean;
    }

    interface Request {
        body: {
            data: string | null;
        }
    }
}