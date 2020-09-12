import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {DialogTitle, TextField} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {AccountDialogProp} from './interfaces';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

class AccountDialog extends React.Component<AccountDialogProp, never> {
    constructor(props: AccountDialogProp) {
        super(props);
    }

    handleLogout = (): void => {
        localStorage.removeItem('token');
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