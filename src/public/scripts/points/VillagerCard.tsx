import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {PageStatus} from './enums';
import {CircularProgress} from '@material-ui/core';
import Axios from 'axios';
import {decrypt, encrypt} from '../encryption/AES';
import {Villager} from '../villagers/interfaces';
import villagerObjectToVillager from '../villagers/villagerObjectToVillager';

interface VillagerCardProp {
    villagerCode: string;
    points: number;
}

interface VillagerCardState {
    status: PageStatus;
    villager?: Villager;
}

const CenteredCircularProgress = (): JSX.Element => (
    <Box p={1}>
        <Card>
            <CardContent>
                <Box textAlign={'center'} >
                    <CircularProgress />
                </Box>
            </CardContent>
            <CardActions>
                <Typography>Please wait...</Typography>
            </CardActions>
        </Card>
    </Box>
)

class VillagerCard extends React.Component<VillagerCardProp, VillagerCardState> {
    constructor(props: VillagerCardProp) {
        super(props);
        this.state = {
            status: PageStatus.LOADING
        }
    }

    componentDidMount(): void {
        Axios.post('/villagers/getvillager', {code: encrypt(this.props.villagerCode)})
            .then(r => {
                const data = JSON.parse(decrypt(r.data.data as string));
                this.setState({
                    villager: villagerObjectToVillager(data),
                    status: PageStatus.LOADED
                });
            })
            .catch(() => {
                this.setState({status: PageStatus.ERROR})
            })
    }

    render(): React.ReactElement {
        switch (this.state.status) {
            case PageStatus.LOADED:
                return (
                    <Box p={1}>
                        <Card>
                            <CardContent>
                                <img src={'/images/villagers/' + this.props.villagerCode + '.png'} />
                                <Typography>
                                    {this.state.villager?.nameKor}
                                </Typography>
                                <Typography>
                                    {this.state.villager?.phraseKor}
                                </Typography>
                                <Typography>
                                    {this.props.points}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button>Delete</Button>
                            </CardActions>
                        </Card>
                    </Box>
                )
            default:
                return <CenteredCircularProgress />
        }
    }
}

export default VillagerCard;