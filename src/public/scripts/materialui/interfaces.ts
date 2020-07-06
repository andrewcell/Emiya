export interface HeaderProp {
    loginStatus: boolean;
    username: string;
    title?: string;
    window?: () => Window;
}

export interface ApplicationBarMenuItem {
    title: string;
    link: string;
}

export interface ApplicationBarMenuGroupProp {
    title: string;
    menu: ApplicationBarMenuItem[];
}