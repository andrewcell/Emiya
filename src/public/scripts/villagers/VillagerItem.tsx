import React from 'react';
import withStyles, {StyleRules, WithStyles} from '@material-ui/core/styles/withStyles';
import {createStyles, Theme} from '@material-ui/core';
import GridListTile from '@material-ui/core/GridListTile';
import Box from '@material-ui/core/Box';
import Cookies from 'js-cookie';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {getName} from './Locales';

const style = (theme: Theme): StyleRules => createStyles({
    root: {
        margin: theme.spacing(2),
    },
    image: {
        paddingBottom: 40,
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            width: 70,
            height: 'auto'
        }
    },
    tileBar: {
        background: 0,
        color: 'black',
        textAlign: 'center',
    },
    title: {
        color: 'black',
        [theme.breakpoints.down('sm')]: {
            fontSize: 12
        }
    },
    titleWrap: {
        margin: 0
    }
});

interface VillagerItemProps extends WithStyles<typeof style> {
    v: Villager;
    handleClick: (code: string) => void;
}

class VillagerItem extends React.Component<VillagerItemProps, never> {
    constructor(props: VillagerItemProps) {
        super(props);
    }

    render(): React.ReactElement {
        const { v, classes } = this.props;
        const title = (
            <>
                <Box fontSize={14} className={classes.title}>{getName(v)}</Box>
            </>
        )

        return (
            <>
                <GridListTile onClick={(): void => this.props.handleClick(v.filename)}>
                    <img src={v.iconImage} alt={v.filename} className={classes.image} />
                    <GridListTileBar title={title} subtitle style={{marginTop: 20}} className={classes.tileBar} classes={{titleWrap: classes.titleWrap}}/>
                </GridListTile>
            </>
        )
    }
}

export default withStyles(style)(VillagerItem);