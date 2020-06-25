import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Col, Collection, Container, ProgressBar, Row} from 'materialinse-react';
import {detectLanguage, l, setLanguage} from './locale';
import Cookies from 'js-cookie';
import Axios from 'axios';
import {PointsMainStates} from './points/interfaces';
import {emiyaJ, url} from './api';
import {decryptJava} from './encryption/AES';
import {PageStatus} from './points/enums';
import PointsMainList from './points/PointsMainList';

class Points extends React.Component<any, PointsMainStates> {
    constructor(props: any) {
        super(props);
        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        setLanguage(Cookies.get('locale') as string);
    }

    componentDidMount(): void {
        const token = Cookies.get('token');
        Axios.get(url(emiyaJ, 'points', 'get'), {headers: {token}})
            .then(r => {
                const data = JSON.parse(decryptJava(r.data.data))
                this.setState({pageStatus: PageStatus.LOADED, myPoints: new Map(Object.entries(data))})
            })
            .catch(() => {
                this.setState({pageStatus: PageStatus.ERROR, myPoints: new Map<string, number>()})
            });
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <div>
                        <Card title={l('points.main.title')}>
                            <PointsMainList myPoints={this.state.myPoints} />
                        </Card>
                    </div>
                )
            case PageStatus.ERROR:
                return (
                    <Container>
                        <h5>{l('points.main.error')}</h5>
                    </Container>
                )
            case PageStatus.LOADING:
            default:
                return (
                    <Container>
                        <ProgressBar />
                    </Container>
                )
        }
    }
}

ReactDOM.render(<Points />, document.getElementById('reactApp'));
