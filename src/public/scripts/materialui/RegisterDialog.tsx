import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import {CircularProgress, createStyles, DialogTitle, TextField, Theme} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {DialogProp, LoginDialogProp} from './interfaces';
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

enum MessageType {
    ERROR, SUCCESS, STANDBY
}

interface RegisterDialogState {
    username: string;
    usernameInvalid: boolean;
    password: string;
    passwordInvalid: boolean;
    passwordMatch: boolean;
    password2: string;
    messageType: MessageType;
    message: string;
    snackbarOpen: boolean;
    process: boolean;
    email: string;
    emailInvalid: boolean;
    success: boolean;
}

class RegisterDialog extends React.Component<DialogProp, RegisterDialogState> {
    constructor(props: LoginDialogProp) {
        super(props);
        this.state = {
            success: false,
            username: '',
            usernameInvalid: true,
            password: '',
            password2: '',
            email: '',
            emailInvalid: false,
            passwordInvalid: true,
            passwordMatch: false,
            messageType: MessageType.STANDBY,
            message: '',
            snackbarOpen: false,
            process: false
        }
    }

    handleRegister = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if (this.state.usernameInvalid || this.state.passwordInvalid || this.state.emailInvalid || !this.state.passwordMatch) {
            this.setState({
                messageType: MessageType.ERROR,
                message: l('layout.register.invalidinput'),
                snackbarOpen: true,
            });
            return;
        }
        this.setState({process: true});
        void Register.register(this.state.username, this.state.password, this.state.password2, this.state.email)
            .then((result: AjaxResult) => {
                this.setState({process: false, snackbarOpen: true, messageType: MessageType.SUCCESS, message: result.comment});
                if (result.code === 'register07') {
                    this.setState({success: true});
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
                let match = false;
                if (value === this.state.password2) {
                    match = true;
                }
                this.setState({password: value, passwordInvalid: !Register.validatePassword(value), passwordMatch: match})
                break;
            case 'password2':
                this.setState({password2: value, passwordMatch: this.state.password === value})
                break;
            case 'email':
                this.setState({email: value})
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

    getContent = (): JSX.Element => {
        if (this.state.success) {
            return (
                <>
                    <DialogContentText>
                        {l('layout.register.success')}
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color={'inherit'}>
                            {l('layout.register.close')}
                        </Button>
                    </DialogActions>
                </>
            )
        } else {
            return (
                <>
                    <DialogContentText>
                        {l('layout.register.description')}
                    </DialogContentText>
                    <TextField margin={'dense'} id={'username'} label={l('layout.register.username')}
                               type={'text'} fullWidth onChange={this.handleFieldChange}
                               error={this.state.usernameInvalid}/>
                    <TextField margin={'normal'} id={'password'} label={l('layout.register.password')}
                               type={'password'} fullWidth onChange={this.handleFieldChange}
                               error={this.state.passwordInvalid}/>
                    <TextField margin={'normal'} id={'password2'} label={l('layout.register.password2')}
                               type={'password'} fullWidth onChange={this.handleFieldChange}
                               error={!this.state.passwordMatch}/>
                    <TextField margin={'normal'} id={'email'} label={l('layout.register.email')}
                               type={'email'} fullWidth onChange={this.handleFieldChange} />
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color={'inherit'}>
                            {l('layout.register.close')}
                        </Button>
                        <Button onClick={this.handleRegister} color={'primary'}>
                            {l('layout.register.register')}
                        </Button>
                    </DialogActions>
                </>
            )
        }
    }

    render(): React.ReactElement {
        return (
            <>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>{l('layout.register.title')}</DialogTitle>
                    <DialogContent>
                        {this.getContent()}
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

export default RegisterDialog;
