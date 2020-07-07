import React from 'react';
import {
    AppBar,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    Button,
    createStyles,
    List,
    Drawer,
    Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';
import {ApplicationBarMenuGroupProp, ApplicationBarProp} from './interfaces';
import useTheme from '@material-ui/core/styles/useTheme';
import {l} from '../locale';
import CssBaseline from '@material-ui/core/CssBaseline';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemLink from './LinkItemLink';
import ApplicationBarMenuGroup from './ApplicationBarMenuGroup';
import menuItems from '../menuItems';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {

                width: drawerWidth,
                flexShrink: 0,

        },
        title: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        drawerPaper: {
            width: drawerWidth,
        },
        menuTitle: {
            margin: theme.spacing(4, 0, 2)
        }
    }),
);

const Header = (props: ApplicationBarProp): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const closeDrawer = (value: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpen(value);
    };

    const toggleDrawer = (): void => {
        setOpen(!open);
    }

    const menuItem = (
        <div onClick={closeDrawer(false)} onKeyDown={closeDrawer(false)}>
            <List>
                {menuItems.map((item: ApplicationBarMenuGroupProp) => (
                    <ApplicationBarMenuGroup title={item.title} menu={item.menu} key={item.title} />
                ))}
            </List>
        </div>
    )
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        DodoSeki
                    </Typography>
                    <Button color="inherit" onClick={props.handleOpen}>{l('layout.login')}</Button>
                </Toolbar>
            </AppBar>
            <Drawer className={classes.drawer} variant="temporary" anchor={'left'} open={open} onClose={toggleDrawer} ModalProps={{keepMounted: true}} classes={{paper: classes.drawerPaper}}>
                {menuItem}
            </Drawer>
        </div>
    )
}

export default Header;