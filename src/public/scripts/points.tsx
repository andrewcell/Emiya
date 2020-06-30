import React from 'react';
import ReactDOM from 'react-dom';
import {detectLanguage, l, setLanguage} from './locale';
import Cookies from 'js-cookie';
import Axios from 'axios';
import {PointsMainStates} from './points/interfaces';
import {emiyaJ, url} from './api';
import {decryptJava} from './encryption/AES';
import {PageStatus} from './points/enums';
import PointsMainList from './points/PointsMainList';
import Header from './materialui/header';

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

    getContent(): JSX.Element {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <div>

                        <PointsMainList myPoints={this.state.myPoints} />

                    </div>
                )
            case PageStatus.ERROR:
                return (

                    <h5>{l('points.main.error')}</h5>

                )
            case PageStatus.LOADING:
            default:
                return (
                    <h3>Loading</h3>
                )
        }
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <header>
                    <Header/>
                </header>
                <section>
                    {this.getContent()}
                </section>
            </div>
        )
    }
}

ReactDOM.render(<Points />, document.getElementById('reactApp'));
