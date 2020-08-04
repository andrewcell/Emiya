import React from 'react';
import {AppBar, Button, createStyles, Drawer, IconButton, List, Theme, Toolbar, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';
import {ApplicationBarMenuGroupProp, ApplicationBarProp} from './interfaces';
import useTheme from '@material-ui/core/styles/useTheme';
import {l} from '../locale';
import CssBaseline from '@material-ui/core/CssBaseline';
import ApplicationBarMenuGroup from './ApplicationBarMenuGroup';
import menuItems from '../menuItems';
import {PageStatus} from '../points/enums';
import Link from '@material-ui/core/Link';

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
        },
        list: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
        },
        ul: {
            padding: 0
        }
    }),
);

const ApplicationBar = (props: ApplicationBarProp): JSX.Element => {
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
            <List className={classes.list} subheader={<li />}>
                {menuItems.map((item: ApplicationBarMenuGroupProp) => (
                    <ApplicationBarMenuGroup title={item.title} menu={item.menu} key={item.title} />
                ))}
            </List>
        </div>
    )

    const TopRightButton = (): JSX.Element => {
        if (props.loginStatus) {
            return <Button color="inherit" onClick={props.handleOpen}>{props.username}</Button>
        } else {
            switch (props.pageStatus) {
                case PageStatus.LOADED:
                case PageStatus.ERROR:
                    return <Button color="inherit" onClick={props.handleOpen}>{l('layout.login')}</Button>
                default:
                    return <Typography>Loading</Typography>
            }
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        <Link href={'/'} color={'inherit'} style={{textDecoration: 'none'}}>
                            DodoSeki
                        </Link>
                    </Typography>
                    {TopRightButton()}
                </Toolbar>
            </AppBar>
            <Drawer className={classes.drawer} variant="temporary" anchor={'left'} open={open} onClose={toggleDrawer} ModalProps={{keepMounted: true}} classes={{paper: classes.drawerPaper}}>
                {menuItem}
            </Drawer>
        </div>
    )
}

export default ApplicationBar;