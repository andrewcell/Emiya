import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {DialogTitle, TextField} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {AccountDialogProp} from './interfaces';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import {l} from '../locale';

class AccountDialog extends React.Component<AccountDialogProp, never> {
    constructor(props: AccountDialogProp) {
        super(props);
    }

    handleLogout = (): void => {
        localStorage.removeItem('token');
        window.location.replace('/admin/logout');
    }

    handleTerminate = (): void => {
        return;
    }

    render(): React.ReactElement {
        return (
            <>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>{this.props.username}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {l('layout.register.username')}: {this.props.username}<br />
                            {l('layout.register.email')}: {this.props.email}
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={this.handleTerminate} color={'secondary'} style={{color: 'red'}}>
                                {l('layout.account.terminate')}
                            </Button>
                            <Button onClick={this.handleLogout} color={'inherit'}>
                                {l('layout.account.logout')}
                            </Button>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                {l('layout.account.close')}
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}

export default AccountDialog;
