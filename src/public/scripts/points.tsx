import React from 'react';
import ReactDOM from 'react-dom';
import {detectLanguage, l, setLanguage} from './locale';
import Cookies from 'js-cookie';
import Axios, {AxiosResponse} from 'axios';
import {PointsState} from './points/interfaces';
import {emiyaJ, url} from './api';
import {decryptJava} from './encryption/AES';
import {PageStatus} from './points/enums';
import PointsMainList from './points/PointsMainList';
import Layout from './materialui/Layout';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

type PointsProps = unknown;

class Points extends React.Component<PointsProps, PointsState> {
    constructor(props: PointsProps) {
        super(props);
        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        void setLanguage(Cookies.get('locale') as string);
        this.state = {
            token: localStorage.getItem('token'),
            pageStatus: PageStatus.LOADING,
            myPoints: new Map<string, number>()
        }
    }

    componentDidMount(): void {
        const token = this.state.token;
        if (token != null) {
            Axios.get(url(emiyaJ, 'points', 'get'), {headers: {token}})
                .then((r: AxiosResponse<{data: string}>) => {
                    const data = JSON.parse(decryptJava(r.data.data))
                    this.setState({pageStatus: PageStatus.LOADED, myPoints: new Map(Object.entries(data))})
                })
                .catch(() => {
                    this.setState({pageStatus: PageStatus.ERROR, myPoints: new Map<string, number>()})
                });
        } else {
            this.setState({pageStatus: PageStatus.ERROR})
        }
    }

    getContent(): JSX.Element {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <div>
                        <PointsMainList myPoints={this.state.myPoints}/>
                    </div>
                )
            case PageStatus.ERROR:
                return <Typography variant={'h5'}>{l('points.main.error')}</Typography>
            case PageStatus.LOADING:
            default:
                return <Grid
                    container
                    spacing={0}
                    direction={'column'}
                    alignItems={'center'}
                    justify={'center'}
                    style={{minHeight: '100vh'}}
                >
                    <CircularProgress/>
                </Grid>
        }
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <>
                <Layout content={<Container>{this.getContent()}</Container>} pageStatus={this.state.pageStatus}/>
            </>
        )
    }
}

ReactDOM.render(<Points />, document.getElementById('reactApp'));
