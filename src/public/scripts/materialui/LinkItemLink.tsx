import ListItem from '@material-ui/core/ListItem';
import React from 'react';

const ListItemLink = (props: {children: JSX.Element, href: string, key: number}): JSX.Element => {
    return <ListItem button component={'a'} {...props} />;
}

export default ListItemLink;