import React from 'react';
import ClothesItem from './ClothesItem';
import { ClothesPanelProps } from './interfaces';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class VillagerPreferClothesPanel extends React.Component<ClothesPanelProps, any> {
    constructor(prop: ClothesPanelProps) {
        super(prop);
    }
    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <>
                <Container>
                    <Typography variant={'h5'}>{this.props.title}</Typography>
                </Container>
                <GridList cellHeight={100} cols={3}>
                    {this.props.data.map(clothes => (
                        <ClothesItem item={clothes}  key={clothes.internalId} />
                    ))}
                </GridList>
            </>
        )
    }
}

export default VillagerPreferClothesPanel;
