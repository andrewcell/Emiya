import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {DialogTitle, TextField} from '@material-ui/core';
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

enum MessageType {
    ERROR, SUCCESS, STANDBY
}

interface LoginDialogState {
    username: string;
    password: string;
    messageType: MessageType;
    message: string;
    snackbarOpen: boolean;
}

class LoginDialog extends React.Component<LoginDialogProp, LoginDialogState> {
    constructor(props: LoginDialogProp) {
        super(props);
        this.state = {
            username: '',
            password: '',
            messageType: MessageType.STANDBY,
            message: '',
            snackbarOpen: false
        }
    }

    handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
        AJAX.send({username: this.state.username, password: this.state.password}, new b64('L2FkbWluL2xvZ2lu'))
            .then((result: AjaxResult) => {
                switch (result.code as string) {
                    case 'login00':
                        localStorage.setItem('token', result.comment)
                        // this.props.setLoginStatus(true, result.comment)
                        location.reload()
                        break;
                    default:
                        this.setState({messageType: MessageType.ERROR, message: result.comment, snackbarOpen: true});
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

    handleSnackbarClose = (): void => {
        this.setState({snackbarOpen: false});
    }

    getSnackbar = (type: MessageType, message: string): JSX.Element => {
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
                /* <MuiAlert elevation={6} variant={'filled'} severity={severity}> */
                return <Snackbar open={this.state.snackbarOpen} autoHideDuration={4000} onClose={this.handleSnackbarClose} message={message} action={closeButton} />
            case MessageType.STANDBY:
            default:
                return <></>
        }
    }

    render(): React.ReactElement {
        return (
            <>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To save your progress, Login to DodoSeki.
                        </DialogContentText>
                        <TextField autoFocus margin={'dense'} id={'username'} label={'Username'} type={'text'} fullWidth onChange={this.handleFieldChange}/>
                        <TextField autoFocus margin={'normal'} id={'password'} label={'Password'} type={'password'} fullWidth onChange={this.handleFieldChange}/>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                Close
                            </Button>
                            <Button onClick={this.handleLogin} color={'primary'}>
                                Login
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                {this.getSnackbar(this.state.messageType, this.state.message)}
            </>
        )
    }
}

export default LoginDialog;