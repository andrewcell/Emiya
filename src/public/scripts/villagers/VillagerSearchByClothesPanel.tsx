import React from 'react';
import {  VillagerSearchByClothesPanelProp } from './interfaces';
import {Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';

class VillagerSearchByClothesPanel extends React.Component<VillagerSearchByClothesPanelProp, any> {
    constructor(prop: VillagerSearchByClothesPanelProp) {
        super(prop);
    }


    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Container>
                <Typography variant={'h6'}>{this.props.title}</Typography>
                {this.props.data.map(v => (
                    <img src={v.iconImage} key={v.filename} alt={v.filename}/>
                ))}
            </Container>
        )
    }
}

export default VillagerSearchByClothesPanel;
