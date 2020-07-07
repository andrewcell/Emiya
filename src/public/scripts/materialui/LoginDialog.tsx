import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {DialogTitle, TextField} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {LoginDialogProp} from './interfaces';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import {AJAX, AjaxResult} from '../ajax';
import $ from 'jquery';
import {b64} from '../b64';

interface LoginDialogState {
    username: string;
    password: string;
}

class LoginDialog extends React.Component<LoginDialogProp, LoginDialogState> {
    constructor(props: LoginDialogProp) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
        AJAX.send({username: this.state.username, password: this.state.password}, new b64('L2FkbWluL2xvZ2lu'))
            .then((result: AjaxResult) => {
                switch (result.code as string) {
                    case 'login00':
                        localStorage.setItem('token', result.comment)
                        location.reload()
                        break;
                    case 'login01':
                        M.toast({html: result.comment, classes: 'rounded'});
                        break;
                    case '500':
                        M.toast({html: result.comment, classes: 'rounded'});
                        break;
                }
            })
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

    render(): React.ReactElement {
        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To save your progress, Login to DodoSeki.
                    </DialogContentText>
                    <TextField autoFocus margin={'dense'} id={'username'} label={'Username'} type={'text'} fullWidth onChange={this.handleFieldChange}/>
                    <TextField autoFocus margin={'normal'} id={'password'} label={'Password'} type={'password'} fullWidth onChange={this.handleFieldChange}/>

                    <DialogActions>
                        <Button onClick={this.props.handleClose} color={'secondary'}>
                            Close
                        </Button>
                        <Button onClick={this.handleLogin} color={'primary'}>
                            Login
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}

export default LoginDialog;