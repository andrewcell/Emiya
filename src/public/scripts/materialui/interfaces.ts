import {PageStatus} from '../points/enums';

export interface HeaderProp {
    loginStatus: boolean;
    username?: string;
    email?: string;
    title?: string;
    pageStatus: PageStatus;
    setLoginStatus: (loginStatus: boolean, username: string) => void;
}

export interface ApplicationBarMenuItem {
    title: string;
    link: string;
}

export interface ApplicationBarMenuGroupProp {
    title: string;
    menu: ApplicationBarMenuItem[];
}

export interface LoginDialogProp extends DialogProp {
    setLoginStatus: (loginStatus: boolean, username: string) => void;
}

export interface AccountDialogProp extends DialogProp {
    username: string;
    email: string;
}

export interface ApplicationBarProp {
    loginStatus: boolean;
    username?: string;
    handleOpen: () => void;
    pageStatus: PageStatus;
}

export interface DialogProp {
    open: boolean;
    handleClose: () => void;
}
