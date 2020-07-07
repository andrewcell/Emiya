import React from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import Header from './Header';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

interface LayoutProp {
    content: JSX.Element;
    loginStatus: boolean;
    username: string;
    customProp?: any;
}

class Layout extends React.Component<LayoutProp, any> {
    constructor(props: LayoutProp) {
        super(props);
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
                <Header loginStatus={this.props.loginStatus} username={this.props.username} />
                <Container>
                    {this.props.content}
                </Container>
            </MuiThemeProvider>
        )
    }
}

export default Layout;