export interface HeaderProp {
    loginStatus: boolean;
    username?: string;
    title?: string;
}

export interface ApplicationBarMenuItem {
    title: string;
    link: string;
}

export interface ApplicationBarMenuGroupProp {
    title: string;
    menu: ApplicationBarMenuItem[];
}

export interface LoginDialogProp {
    open: boolean;
    handleClose: () => void;
}

export interface ApplicationBarProp {
    loginStatus: boolean;
    username?: string;
    handleOpen: () => void;
}