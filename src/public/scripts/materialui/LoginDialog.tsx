import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {CircularProgress, createStyles, DialogTitle, TextField, Theme} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {LoginDialogProp} from './interfaces';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import {AJAX, AjaxResult} from '../ajax';
import {b64} from '../b64';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {l} from '../locale';
import Backdrop from '@material-ui/core/Backdrop';
import {Register} from '../register';
import RegisterDialog from './RegisterDialog';

enum MessageType {
    ERROR, SUCCESS, STANDBY
}

interface LoginDialogState {
    username: string;
    usernameInvalid: boolean;
    password: string;
    passwordInvalid: boolean;
    messageType: MessageType;
    message: string;
    snackbarOpen: boolean;
    process: boolean;
    registerDialog: boolean;
}

class LoginDialog extends React.Component<LoginDialogProp, LoginDialogState> {
    constructor(props: LoginDialogProp) {
        super(props);
        this.state = {
            username: '',
            usernameInvalid: true,
            password: '',
            passwordInvalid: true,
            messageType: MessageType.STANDBY,
            message: '',
            snackbarOpen: false,
            process: false,
            registerDialog: false
        }
    }

    handleLogin = (): void => {
        if (this.state.usernameInvalid || this.state.passwordInvalid) {
            this.setState({
                messageType: MessageType.ERROR,
                message: l('layout.login.invalidinput'),
                snackbarOpen: true,
            });
            return;
        }
        this.setState({process: true});
        AJAX.send({username: this.state.username, password: this.state.password}, new b64('L2FkbWluL2xvZ2lu'))
            .then((result: AjaxResult) => {
                switch (result.code as string) {
                    case 'login00':
                        localStorage.setItem('token', result.comment)
                        // this.props.setLoginStatus(true, result.comment)
                        location.reload()
                        break;
                    default:
                        this.setState({
                            messageType: MessageType.ERROR,
                            message: result.comment,
                            snackbarOpen: true,
                            process: false
                        });
                        break;
                }
            })
    }

    handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.currentTarget.value;
        switch (e.currentTarget.id) {
            case 'username':
                this.setState({username: value, usernameInvalid: !Register.validateUsername(value)})
                break;
            case 'password':
                this.setState({password: value, passwordInvalid: !Register.validatePassword(value)})
                break;
        }
    }

    handleSnackbarClose = (): void => {
        this.setState({snackbarOpen: false});
    }

    getSnackbar = (type: MessageType, message: string): JSX.Element => {
        let severity = 'success'
        const closeButton: JSX.Element = (
            <IconButton aria-label="close" color="secondary" onClick={this.handleSnackbarClose}>
                <CloseIcon/>
            </IconButton>
        )
        switch (type) {
            case MessageType.ERROR:
                severity = 'error'
            case MessageType.SUCCESS:
                /* <MuiAlert elevation={6} variant={'filled'} severity={severity}> */
                return <Snackbar open={this.state.snackbarOpen} autoHideDuration={4000}
                                 onClose={this.handleSnackbarClose} message={message} action={closeButton}/>
            case MessageType.STANDBY:
            default:
                return <></>
        }
    }

    handleRegister = (): void => {
        this.setState({registerDialog: true});
    }

    closeRegister = (): void => {
        this.setState({registerDialog: false});
    }

    handleEnterKey = (e: React.KeyboardEvent<Element>): void => {
        if (e.keyCode === 13) {
            this.handleLogin();
        }
    }

    render(): React.ReactElement {
        return (
            <>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>{l('layout.login.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {l('layout.login.description')}
                        </DialogContentText>
                        <TextField margin={'dense'} id={'username'} label={l('layout.login.username')}
                                   type={'text'} fullWidth onChange={this.handleFieldChange} error={this.state.usernameInvalid}/>
                        <TextField margin={'normal'} id={'password'} label={l('layout.login.password')}
                                   type={'password'} fullWidth onChange={this.handleFieldChange} error={this.state.passwordInvalid} onKeyDown={this.handleEnterKey}/>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                {l('layout.login.close')}
                            </Button>
                            <Button onClick={this.handleRegister} color={'inherit'}>
                                {l('layout.login.register')}
                            </Button>
                            <Button onClick={this.handleLogin} color={'primary'}>
                                {l('layout.login.login')}
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Backdrop open={this.state.process} style={{zIndex: 999999}}>
                    <CircularProgress color={'inherit'}/>
                </Backdrop>
                {this.getSnackbar(this.state.messageType, this.state.message)}
                <RegisterDialog open={this.state.registerDialog} handleClose={this.closeRegister} />
            </>
        )
    }
}


export default LoginDialog;
