import ListItem from '@material-ui/core/ListItem';
import React from 'react';

const ListItemLink = (props: any): JSX.Element => {
    return <ListItem button component={'a'} {...props} />;
}

export default ListItemLink;