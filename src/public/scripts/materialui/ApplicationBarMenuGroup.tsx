import {ApplicationBarMenuGroupProp} from './interfaces';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {List} from '@material-ui/core';
import React from 'react';
import ListItemLink from './LinkItemLink';

const ApplicationBarMenuGroup = (props: ApplicationBarMenuGroupProp): JSX.Element => {
    return (
        <>
            <ListSubheader>{props.title}</ListSubheader>
            {props.menu.map((menu, index) => (
                <ListItemLink href={menu.link} key={index}>
                    <ListItemText primary={menu.title} />
                </ListItemLink>
            ))}
        </>
    )
}

export default ApplicationBarMenuGroup;