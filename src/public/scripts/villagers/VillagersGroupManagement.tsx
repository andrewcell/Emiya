import React from 'react';
import {PageStatus} from '../points/enums';
import Typography from '@material-ui/core/Typography';
import Axios, {AxiosResponse} from 'axios';
import {Data} from '../repsonseBody';
import {decrypt} from '../encryption/AES';
import {Card, StyleRules, Theme, WithStyles} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {l} from '../locale';
import CardContent from '@material-ui/core/CardContent';
import withStyles from '@material-ui/core/styles/withStyles';
import CardActions from '@material-ui/core/CardActions';
import VillagersGroupChart from './VillagersGroupChart';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {VillagerStorage} from './interfaces';
import VillagersAddGroupDialog from './VillagersGroupCreateDialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

type deleteConfirmDialogProps = {
    open: boolean;
    closeDialog: () => void;
    groupName: string;
    changeGroup: (groupName: string) => void;
    groupList: string[];
    loginStatus: boolean;
    deleteGroup: (groupName: string) => Promise<boolean>;
    deleteGroupFromList: (name: string, reset: boolean) => void;
}

const DeleteConfirmDialog = (props: deleteConfirmDialogProps): React.ReactElement => {
    const { open, closeDialog, groupName, deleteGroup, deleteGroupFromList } = props;
    const [lockButton, setLockButton] = React.useState(false);
    const handleDelete = (): void => {
        setLockButton(true);
        void deleteGroup(groupName).then(reset => {
            setLockButton(false);
            closeDialog();
            deleteGroupFromList(groupName, reset);
        })
    }
    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>{l('villagers.group.confirmdelete')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{l('villagers.group.deleteconfirm')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color={'inherit'} onClick={closeDialog} disabled={lockButton}>{l('layout.login.close')}</Button>
                <Button color={'inherit'} onClick={handleDelete} disabled={lockButton}>{l('villagers.group.confirm')}</Button>
            </DialogActions>
        </Dialog>
    )
}

const style = (theme: Theme): StyleRules => ({
    select: {
        margin: theme.spacing(1),
        minWidth: 350
    }
})

interface VillagersGroupManagementProps extends WithStyles<typeof style> {
    loginStatus: boolean;
    selectedGroup: string;
    changeGroup: (groupName: string) => Promise<string>;
    codeToVillagerArray: (codes: string[]) => Villager[];
    createGroup: (groupName: string) => void;
    deleteGroup: (groupName: string) => Promise<boolean>;
    storage: {[key: string]: string[]};
}

interface VillagersGroupManagementState {
    status: PageStatus;
    createDialog: boolean;
    snackbar: boolean;
    snackbarMessage: string;
    deleteConfirm: boolean;
    deleteConfirmDialog: boolean;
}

class VillagersGroupManagement extends React.Component<VillagersGroupManagementProps, VillagersGroupManagementState> {
    constructor(props: VillagersGroupManagementProps) {
        super(props);
        this.state = {
            status: PageStatus.LOADED,
            createDialog: false,
            snackbar: false,
            snackbarMessage: '',
            deleteConfirm: false,
            deleteConfirmDialog: false
        }
    }

    componentDidMount(): void {
        /* if (this.props.loginStatus) {
            Axios.post('/villagers/groupmgmt', {})
                .then((r: AxiosResponse<Data>) => {
                    const storage = JSON.parse(decrypt(r.data.data)) as VillagerStorage;
                    this.setState({
                        status: PageStatus.LOADED,
                    })
                })
                .catch(() => {
                    this.setState({status: PageStatus.ERROR});
                })
        } else {
            try {
                const storageJson = localStorage.getItem('myVillagers')
                if (storageJson == null) {
                    this.setState({storage: {'Default': []}, status: PageStatus.LOADED, groupList: ['Default']})
                } else {
                    const storage = JSON.parse(storageJson) as VillagerStorage;
                    this.setState({
                        status: PageStatus.LOADED,
                    });
                }
            } catch {
                this.setState({status: PageStatus.ERROR});
            }
        } */
    }

    handleGroupChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>): void => {
        if (e.currentTarget.value != null) {
            void this.props.changeGroup(e.target.value as string);
        }
    }

    closeDialog = (): void => {
        this.setState({createDialog: false, deleteConfirmDialog: false});
    }

    openCreateDialog = (): void => {
        this.setState({createDialog: true});
    }

    addToGroupList = (name: string): void => {
        this.props.createGroup(name);
        /* const storage = this.state.storage;
        if (name in storage) { return; }
        storage[name] = [];
        this.setState(prevState => ({
            groupList: [...prevState.groupList, name],
            storage
        })); */
    }

    removeFromGroupList = (name: string, reset: boolean): void => {
        /* if (this.state.groupList.length === 1) {
            this.setState({groupList: ['Default'], storage: {'Default': []}});
            return;
        }
        if (reset) {
            this.setState({groupList: ['Default'], storage: {'Default': []}})
            return;
        }
        this.setState((prevState) => {
            const groupIndex = prevState.groupList.findIndex(i => {
                return i === name
            });
            const prevGroups = prevState.groupList;
            if (groupIndex !== -1 && groupIndex != null) {
                prevGroups.splice(groupIndex, 1);
            }
            return {groupList: prevGroups}
        })*/
    }

    setSnackbarMessage = (snackbarMessage: string): void => {
        this.setState({snackbar: true, snackbarMessage})
    }

    deleteGroup = (): void => {
        this.setState({deleteConfirmDialog: true});

    }

    render(): React.ReactNode | React.ReactElement {
        switch (this.state.status) {
            case PageStatus.LOADED:
                const { selectedGroup, classes, loginStatus, changeGroup, deleteGroup, storage } = this.props;
                const { snackbar, snackbarMessage } = this.state;
                const groupList = Object.keys(storage);
                const capitalize = (str: string): string => {
                    return str.charAt(0).toUpperCase() + str.slice(1)
                }
                const personalityChartLabels: string[] = [];
                return (
                    <>
                        <Snackbar open={snackbar} autoHideDuration={3000} message={snackbarMessage} action={
                            <IconButton size="small" color="inherit">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        } />
                        <DeleteConfirmDialog  open={this.state.deleteConfirmDialog} closeDialog={this.closeDialog} groupName={selectedGroup} changeGroup={changeGroup} groupList={groupList} loginStatus={loginStatus} deleteGroup={deleteGroup} deleteGroupFromList={this.removeFromGroupList} />
                        <VillagersAddGroupDialog open={this.state.createDialog} closeDialog={this.closeDialog} addToGroupList={this.addToGroupList} loginStatus={loginStatus}/>
                        <Container>
                            <Card>
                                <CardContent>
                                    <Grid container direction={'column'} justify={'center'} alignItems={'center'} spacing={3}>
                                        <Grid item>
                                            <FormControl className={classes.select}>
                                                <InputLabel id={'changeGroup'}>{l('villagers.group.change')}</InputLabel>
                                                <Select value={selectedGroup} onChange={this.handleGroupChange}>
                                                    {groupList.map(groupName => (
                                                        <MenuItem value={groupName} key={groupName}>{groupName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            {storage[selectedGroup].map(code => {
                                                return <img src={`https://acnhcdn.com/latest/NpcBromide/NpcNml${capitalize(code)}.png`} alt={code} key={code} style={{width: 64}} />
                                            })}
                                        </Grid>
                                    </Grid>

                                </CardContent>
                                <CardActions>
                                    <Button color={'inherit'} onClick={this.deleteGroup}>
                                        {l('villagers.group.delete')}
                                    </Button>
                                    <Button color={'primary'} onClick={this.openCreateDialog}>
                                        {l('villagers.group.add')}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Container>
                        <VillagersGroupChart codeToVillagerArray={this.props.codeToVillagerArray} storage={storage} />
                    </>
                )
            default:
                return <></>
        }

    }
}

export default withStyles(style)(VillagersGroupManagement);