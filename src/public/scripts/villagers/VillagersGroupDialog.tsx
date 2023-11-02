import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {l} from '../locale';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface VillagersGroupDialogProps {
    open: boolean;
    handleClose: () => void;
    groups: string[];
    selectedGroup: string;
    changeGroup: (groupName: string) => Promise<string>;
}

interface VillagersGroupDialogState {
    snackbar: boolean;
    snackbarMessage: string;
    selected: string;
}

class VillagersGroupDialog extends React.Component<VillagersGroupDialogProps, VillagersGroupDialogState> {
    constructor(props: VillagersGroupDialogProps) {
        super(props);
        this.state = {
            snackbar: false,
            snackbarMessage: '',
            selected: this.props.selectedGroup
        }
    }

    changeGroup = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>): void => {
        if (e.target.value != null) {
            this.setState({selected: e.target.value as string});
        }
    }

    closeSnackbar = (): void => {
        this.setState({snackbar: false, snackbarMessage: ''})
    }

    changeCurrentGroup = (): void => {
        void this.props.changeGroup(this.state.selected)
            .then(comment => {
                if (comment !== '') {
                    this.setState({snackbar: true, snackbarMessage: comment});
                }
            })
    }

    render(): React.ReactElement {
        const { groups } = this.props;
        const { snackbar, snackbarMessage, selected } = this.state;
        return (
            <>
                <Snackbar open={snackbar} autoHideDuration={3000} onClose={this.closeSnackbar} message={snackbarMessage} action={
                    <IconButton size="small" color="inherit" onClick={this.closeSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                } />
                <Dialog open={this.props.open} onClose={this.props.handleClose} fullWidth>
                    <DialogTitle>{l('villagers.groupdialog.title')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant={'outlined'} fullWidth>
                            <InputLabel id={'groupl'}>{l('villagers.groupdialog.group')}</InputLabel>
                            <Select id={'groupl'} labelId={'group'} value={selected} label={l('villagers.groupdialog.group')} onChange={this.changeGroup}>
                                {groups.map(groupName => {
                                    return <MenuItem value={groupName} key={groupName}>{groupName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                {l('layout.login.close')}
                            </Button>
                            <Button onClick={this.changeCurrentGroup} color={'primary'}>
                                {l('villagers.groupdialog.change')}
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}

export default VillagersGroupDialog;