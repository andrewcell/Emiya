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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import zIndex from '@material-ui/core/styles/zIndex';
import withStyles from '@material-ui/core/styles/withStyles';
import {Register} from '../register';

enum MessageType {
    ERROR, SUCCESS, STANDBY
}

interface LoginDialogState {
    username: string;
    usernameValidation: boolean;
    password: string;
    passwordValidation: boolean;
    messageType: MessageType;
    message: string;
    snackbarOpen: boolean;
    process: boolean;
}

class LoginDialog extends React.Component<LoginDialogProp, LoginDialogState> {
    constructor(props: LoginDialogProp) {
        super(props);
        this.state = {
            username: '',
            usernameValidation: false,
            password: '',
            passwordValidation: false,
            messageType: MessageType.STANDBY,
            message: '',
            snackbarOpen: false,
            process: false
        }
    }

    handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if (this.state.usernameValidation || this.state.passwordValidation) {
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
                this.setState({username: value, usernameValidation: !Register.validateUsername(value)})
                break;
            case 'password':
                this.setState({password: value, passwordValidation: !Register.validatePassword(value)})
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
                                   type={'text'} fullWidth onChange={this.handleFieldChange} error={this.state.usernameValidation}/>
                        <TextField margin={'normal'} id={'password'} label={l('layout.login.password')}
                                   type={'password'} fullWidth onChange={this.handleFieldChange} error={this.state.passwordValidation}/>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color={'inherit'}>
                                {l('layout.login.close')}
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
            </>
        )
    }
}


export default LoginDialog;