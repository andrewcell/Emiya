import React from 'react';
import {Clothes} from './interfaces';
import {Color} from './enums';
import {l} from '../locale';
import Cookies from 'js-cookie';
import {createStyles, GridListTile, StyleRules, WithStyles} from '@material-ui/core';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';

const styles = (): StyleRules => createStyles({
    tileBar: {
        background: 0,
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    image: {
        paddingBottom: 40
    },
    title: {
        color: 'black'
    }
})

interface ClothesProps extends WithStyles<typeof styles>{
    item: Clothes;
}

class ClothesItem extends React.Component<ClothesProps, never> {
    constructor(prop: ClothesProps) {
        super(prop);
    }

    getColorStyle = (color: Color): React.CSSProperties => {
        const style: React.CSSProperties = {
            color: 'white',
            backgroundColor: color,
            display: 'inline-block',
            fontSize: '10px',
        }
        switch (color as string) {
            case 'White':
                style.color = 'black';
                return style;
            case 'Beige':
                style.backgroundColor = '#d0b084';
                return style;
            case 'Lightblue':
            case 'Yellow':
                style.color = 'black';
                return style;
            case 'Colorful':
                style.backgroundColor = '#c48f1d'
                break;
        }
        return style;
    }

    getItemStyle = (): React.CSSProperties => {
        return {
            backgroundColor: 'orange',
            color: 'black',
            fontSize: '20px',
            width: '150px',
            height: '40px'
        };
    }

    getStyleStyle = (): React.CSSProperties => {
        return {
            color: 'black',
            fontWeight: 'bold',
            display: 'inline-block',
            borderRadius: '5px',
            fontSize: '10px',
        }
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        /* const style = {
            backgroundColor: 'white',
            borderColor: 'orange',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderRadius: '5px'
        } */

        const item = this.props.item;
        return (
            <GridListTile>
                <img src={`https://acnhcdn.com/latest/FtrIcon/${this.props.item.filename}.png`} alt={this.props.item.filename} className={this.props.classes.image} />
                <GridListTileBar title={
                    <Box fontSize={14} className={this.props.classes.title}>{(Cookies.get('locale') === 'ko_KR' ? item.nameKorean : item.name)}</Box>
                } subtitle={
                    <div>
                        <div id={'style'} style={this.getColorStyle(item.color1)}>
                            <div style={{margin: 2}}>{l('villagers.colors.'+item.color1.toLowerCase())}</div>
                        </div>
                        <div id={'style'} style={this.getColorStyle(item.color2)}>
                            <div style={{margin: 2}}>{l('villagers.colors.'+item.color2.toLowerCase())}</div>
                        </div>
                        <div id={'style'} style={this.getStyleStyle()}>
                            <div style={{margin: 2}}>{l('villagers.styles.'+item.style1.toLowerCase())}</div>
                        </div>
                    </div>
                } style={{marginTop: 20}} className={this.props.classes.tileBar}/>
            </GridListTile>
        )
    }
}

export default withStyles(styles)(ClothesItem);
