import React from 'react';
import ApplicationBar from './ApplicationBar';
import {HeaderProp} from './interfaces';
import LoginDialog from './LoginDialog';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

interface HeaderState {
    loginDialog: boolean;

}

class Header extends React.Component<HeaderProp, HeaderState> {
    constructor(props: HeaderProp) {
        super(props);
        createMuiTheme()
        this.state = {
            loginDialog: false
        }
    }

    openDialog = (type: string): void => {
        switch (type) {
            case 'login':
                this.setState({loginDialog: true})
        }
    }

    getOpenDialogFunction = (type: string): () => void => {
        switch (type) {
            case 'login':
                return (): void => { this.setState({loginDialog: true}) }
            default:
                return (): void => {return;}
        }
    }

    closeDialog = (type: string): () => void => {
        switch (type) {
            case 'login':
                return (): void => {
                    this.setState({loginDialog: false})
                }
            default:
                return (): void => {return;}
        }
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <>
                <ApplicationBar loginStatus={this.props.loginStatus} username={this.props.username} handleOpen={this.getOpenDialogFunction('login')}/>
                <LoginDialog open={this.state.loginDialog} handleClose={this.closeDialog('login')} />
            </>
        )
    }
}
export default Header;
