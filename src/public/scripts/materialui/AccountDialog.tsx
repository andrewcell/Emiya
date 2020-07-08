import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {DialogTitle, TextField} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {AccountDialogProp} from './interfaces';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

interface AccountDialogState {}


class AccountDialog extends React.Component<AccountDialogProp, AccountDialogState> {
    constructor(props: AccountDialogProp) {
        super(props);
        this.state = {

        }
    }

    handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.currentTarget.value;
        switch (e.currentTarget.id) {
            case 'username':
                this.setState({username: value})
                break;
            case 'password':
                this.setState({password: value})
                break;
        }
    }

    handleSnackbarClose = (): void => {
        this.setState({snackbarOpen: false});
    }

    /* getSnackbar = (type: MessageType, message: string): JSX.Element => {
        let severity = 'success'
        const closeButton: JSX.Element = (
            <IconButton aria-label="close" color="secondary" onClick={this.handleSnackbarClose}>
                <CloseIcon />
            </IconButton>
        )
        switch (type) {
            case MessageType.ERROR:
                severity = 'error'
            case MessageType.SUCCESS:
                /* <MuiAlert elevation={6} variant={'filled'} severity={severity}>
                return <Snackbar open={this.state.snackbarOpen} autoHideDuration={4000} onClose={this.handleSnackbarClose} message={message} action={closeButton} />
            case MessageType.STANDBY:
            default:
                return <></>
        }
    } */

    handleLogout = (): void => {
        localStorage.clear();
        window.location.replace('/admin/logout');
    }

    render(): React.ReactElement {
        return (
            <>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>{this.props.username}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Here is your detail of account. {this.props.username}
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={this.handleLogout} color={'inherit'}>
                                Logout
                            </Button>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                Close
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}

export default AccountDialog;