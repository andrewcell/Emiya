import React from 'react';
import {AppBar, IconButton, Theme, Toolbar, Typography, Button, createStyles, List, Drawer} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';
import {HeaderProp} from './interfaces';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import useTheme from '@material-ui/core/styles/useTheme';
import clsx from 'clsx';
import {l} from "../locale";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        title: {
            flexGrow: 1
        }
    }),
);

const Header = (props: HeaderProp): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const {window} = props;
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = (): void => {
     setOpen(true);
    };

    const handleDrawerClose = (): void => {
     setOpen(false);
    };

    const container = window != null ? (): HTMLElement => window().document.body : null;

    return (
         <div className={classes.root}>
             <AppBar position="static" style={{backgroundColor: '#4caf50'}}>
                 <Toolbar>
                     <IconButton edge="start" className={clsx(classes.menuButton, open)} onClick={handleDrawerOpen} color="inherit" aria-label="menu">
                        <MenuIcon />
                     </IconButton>
                     <Typography variant="h5" className={classes.title}>
                         DodoSeki
                     </Typography>
                     <Button color="inherit">{l('layout.login')}</Button>
                 </Toolbar>
             </AppBar>
             <Drawer
                 container={container}
                 className={classes.drawer}
                 variant="persistent"
                 anchor={'left'}
                 open={open}
                 classes={{paper: classes.drawerPaper}}
                 ModalProps={{
                     keepMounted: true, // Better open performance on mobile.
                 }}
             >
                 <div className={classes.drawerHeader}>
                     <IconButton onClick={handleDrawerClose}>
                         <ChevronLeftIcon />
                     </IconButton>
                 </div>
                 <Divider />
                 <List>
                     {['1', '2', '3', '4'].map((text, index) => (
                         <ListItem button key={text}>
                             <ListItemIcon />
                             <ListItemText primary={text} />
                         </ListItem>
                     ))}
                 </List>
                 <Divider />
                 <List>
                     {['A', 'B', 'C'].map((text, index) => (
                         <ListItem button key={text}>
                             <ListItemIcon />
                             <ListItemText primary={text} />
                         </ListItem>
                     ))}
                 </List>
             </Drawer>
        </div>
    )
}

export default Header;