import React from 'react';
import ReactDOM from 'react-dom';
import { Card, CollectionItem, Collection, ProgressBar, Row, Col } from 'react-materialize';
import { l, detectLanguage, setLanguage } from './locale';
import Cookies from 'js-cookie';
import axios from 'axios';
import {PointsMainStates} from './points/interfaces';
import {emiyaJ, url} from './api';

class Points extends React.Component<any, PointsMainStates> {
    constructor(props: any) {
        super(props);
        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        setLanguage(Cookies.get('locale') as string);
        const token = Cookies.get('token');
        console.log(url(emiyaJ, 'asd','aasdfsadfsd'))
        axios.get(url(emiyaJ, 'points', 'get'), {headers: {token}})
            .then(r => console.log(r))
        this.state = {loaded: true, myPoints: new Map<string, number>()}
    }
    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.state.loaded) {
            return (
                <div>
                    <Card title={l('points.main.title')}>
                        <Collection>
                            <div className={'collection-item'}>
                                <Row>
                                    <Col s={2}>
                                        <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}
                                             style={{width: '64px'}}/>
                                    </Col>
                                    <Col s={10}>
                                        <p>잭슨 - Raymond</p>
                                        <ProgressBar progress={23}/>
                                    </Col>
                                </Row>
                            </div>
                            <div className={'collection-item'}>
                                <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}/>
                            </div>
                            <div className={'collection-item'}>
                                <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}/>
                            </div>
                            <div className={'collection-item'}>
                                <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}/>
                            </div>
                            <div className={'collection-item'}>
                                <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}/>
                            </div>
                            <div className={'collection-item'}>
                                <img src={'https://dodo.ij.rs/images/villagers/cat23.png'}/>
                            </div>
                        </Collection>
                    </Card>
                </div>
            )
        } else {
            return (
                <ProgressBar />
            )
        }
    }
}

ReactDOM.render(<Points />, document.getElementById('reactApp'));
