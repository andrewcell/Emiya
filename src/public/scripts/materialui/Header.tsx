import React from 'react';
import ApplicationBar from './ApplicationBar';
import {HeaderProp} from './interfaces';
import LoginDialog from './LoginDialog';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import AccountDialog from './AccountDialog';

interface HeaderState {
    TopRightDialog: boolean;
}

class Header extends React.Component<HeaderProp, HeaderState> {
    constructor(props: HeaderProp) {
        super(props);
        createMuiTheme()
        this.state = {
            TopRightDialog: false,
        }
    }

    openDialog = (type: string): void => {
        switch (type) {
            case 'TopRight':
                this.setState({TopRightDialog: true})
        }
    }

    getOpenDialogFunction = (type: string): () => void => {
        switch (type) {
            case 'TopRight':
                return (): void => { this.setState({TopRightDialog: true}) }
            default:
                return (): void => {return;}
        }
    }

    closeDialog = (type: string): () => void => {
        switch (type) {
            case 'TopRight':
                return (): void => {
                    this.setState({TopRightDialog: false})
                }
            default:
                return (): void => {return;}
        }
    }

    getTopRightDialog = (): JSX.Element => {
        if (this.props.loginStatus && this.props.username != null && this.props.email != null) {
            return <AccountDialog open={this.state.TopRightDialog} handleClose={this.closeDialog('TopRight')} username={this.props.username} email={this.props.email}/>
        } else {
            return <LoginDialog open={this.state.TopRightDialog} handleClose={this.closeDialog('TopRight')} setLoginStatus={this.props.setLoginStatus}/>
        }
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <>
                <ApplicationBar pageStatus={this.props.pageStatus} loginStatus={this.props.loginStatus} username={this.props.username} handleOpen={this.getOpenDialogFunction('TopRight')}/>
                {this.getTopRightDialog()}
            </>
        )
    }
}
export default Header;
