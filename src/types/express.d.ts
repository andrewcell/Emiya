import {VillagerStorage} from '@interfaces/MyVillagersDatabase';

declare namespace Express {
    interface Session {
        myVillagers: string[];
        group: string;
        groups: string[];
        requireUpdate: boolean;
        storage: VillagerStorage;
    }
}