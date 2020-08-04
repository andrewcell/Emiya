import React from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import Header from './Header';
import Axios from 'axios';
import {decrypt} from '../encryption/AES';
import {PageStatus} from '../points/enums';

interface LayoutProp {
    content: JSX.Element;
    pageStatus: PageStatus;
    customProp?: any;
}

interface LayoutState {
    loginStatus: boolean;
    username?: string;
}

class Layout extends React.Component<LayoutProp, LayoutState> {
    constructor(props: LayoutProp) {
        super(props);
        this.state = {
            loginStatus: false
        }
    }

    componentDidMount(): void {
        Axios.get('/admin/loginstatus')
            .then((res) => {
                const encryptedData = res.data.data;
                const data = JSON.parse(decrypt(encryptedData)) as {username: string; email: string};
                this.setState({
                    loginStatus: true,
                    username: data.username
                })
            })
    }

    setLoginStatus = (loginStatus: boolean, username?: string): void => {
        this.setState({loginStatus, username})
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    light: '#80e27e',
                    main: '#4caf50',
                    dark: '#087f23',
                    contrastText: '#fff'
                }
            },
        })
        return (
            <MuiThemeProvider theme={theme}>
                <Header loginStatus={this.state.loginStatus} username={this.state.username} setLoginStatus={this.setLoginStatus} pageStatus={this.props.pageStatus} />
                {this.props.content}
            </MuiThemeProvider>
        )
    }
}

export default Layout;