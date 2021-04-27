import React from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import Header from './Header';
import Axios, {AxiosResponse} from 'axios';
import {decrypt} from '../encryption/AES';
import {PageStatus} from '../points/enums';
import {Data} from '../repsonseBody';

interface LayoutProp {
    content: JSX.Element;
    pageStatus: PageStatus;
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
            .then((res: AxiosResponse<Data>) => {
                const encryptedData = res.data.data;
                const data = JSON.parse(decrypt(encryptedData)) as {username: string; email: string};
                this.setState({
                    loginStatus: true,
                    username: data.username
                })
            })
            .catch(() => {
                this.setState({
                    loginStatus: false
                })
            });
    }

    setLoginStatus = (loginStatus: boolean, username?: string): void => {
        this.setState({loginStatus, username})
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const theme = createMuiTheme({
            typography: {
                // fontFamily: ['Roboto', 'Helvetica', 'Arial', 'Kosugi Maru', 'sans-serif'].join(',')
            },
            palette: {
                primary: {
                    light: '#80e27e',
                    main: '#4caf50',
                    dark: '#087f23',
                    contrastText: '#fff'
                },
                secondary: {
                    main: '#c8e6c9'
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
