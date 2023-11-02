import React from 'react';
import {MyVillagersState} from './interfaces';
import {l} from '../locale';
import MyVillagersStatistics from './MyVillagersStatistics';
import VillagerDetail from './VillagerDetail';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Card} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import VillagerItem from './VillagerItem';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import {Villager} from 'animal-crossing/lib/types/Villager';
import VillagersGroupDialog from './VillagersGroupDialog';

interface MyVillagersProps {
    locale: string;
    my: Villager[];
    refresh: (arr: Villager[]) => void;
    renderComplete: boolean;
    removeVillager: (v: Villager) => Promise<string>;
    addVillager: (villagerCode: string) => Promise<string>;
    data: Villager[];
    groups: string[];
    selectedGroup: string;
    changeGroup: (groupName: string) => Promise<string>;
}

class MyVillagers extends React.Component<MyVillagersProps, MyVillagersState> {
    constructor(props: MyVillagersProps) {
        super(props);

        this.state = {
            locale: props.locale,
            code: [],
            selectedCode: '',
            dialog: false,
            groupDialog: false
        }
    }

    handleClickVillager = (code: string): void => {
        this.setState({selectedCode: code, dialog: true})
    }

    closeDialog = (): void => {
        this.setState({dialog: false, groupDialog: false})
    }

    getVillagerDetail = (code: string): JSX.Element => (
        <Dialog open={this.state.dialog} onClose={this.closeDialog} fullScreen>
            <VillagerDetail code={code} handleClose={this.closeDialog} addVillager={this.props.addVillager} removeVillager={this.props.removeVillager} data={this.props.data}/>
        </Dialog>
    )

    openGroupDialog = (): void => {
        this.setState({groupDialog: true})
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.props.renderComplete && this.props.my.length < 1) {
            return (
                <Container>
                    <Typography variant={'h5'}>{l('villagers.my.novillagers')}</Typography>
                </Container>
            )
        } else {
            const villagers: JSX.Element[] = []
            this.props.my.forEach((value: Villager) => {
                if (value != null) {
                    villagers.push(<VillagerItem v={value} handleClick={this.handleClickVillager}/>)
                }
            });

            return (
                <div>
                    <Card>
                        <CardContent>
                            <Typography variant={'h5'}>{l('villagers.my.title')}</Typography>
                            <GridList>
                                {villagers}
                            </GridList>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Tooltip title={''}>
                                <Button color={'primary'} onClick={this.openGroupDialog}>{l('villagers.my.changegroup')}</Button>
                            </Tooltip>
                        </CardActions>
                    </Card>
                    {this.getVillagerDetail(this.state.selectedCode)}
                    <MyVillagersStatistics my={this.props.my}/>
                    <VillagersGroupDialog open={this.state.groupDialog} handleClose={this.closeDialog} groups={this.props.groups} selectedGroup={this.props.selectedGroup} changeGroup={this.props.changeGroup}/>
                </div>
            )
        }
    }
}

export default MyVillagers;
