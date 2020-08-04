import {ApplicationBarMenuGroupProp} from './interfaces';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import ListItemLink from './LinkItemLink';

const ApplicationBarMenuGroup = (props: ApplicationBarMenuGroupProp): JSX.Element => {
    return (
        <>
            <li>
                <ul style={{padding: 0}}>
                    <ListSubheader>{props.title}</ListSubheader>
                    {props.menu.map((menu, index) => (
                        <ListItemLink href={menu.link} key={index}>
                            <ListItemText primary={menu.title} />
                        </ListItemLink>
                    ))}
                </ul>
            </li>
        </>
    )
}

export default ApplicationBarMenuGroup;