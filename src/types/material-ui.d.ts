import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { TabsTypeMap } from '@material-ui/core';

declare module '@material-ui/core/Tabs' {
    export interface TabsTypeMap {
        textColor?: 'secondary';
    }
}