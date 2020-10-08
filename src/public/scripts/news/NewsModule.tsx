import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Axios, {AxiosResponse} from 'axios';
import {emiyaJ, url} from '../api';
import {PageStatus} from '../points/enums';
import {getContentByLocale, News} from './interface';
import {CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {l} from '../locale';

interface NewsModuleState {
    status: PageStatus;
    news: News[];
}

class NewsModule extends React.Component<unknown, NewsModuleState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            status: PageStatus.LOADING,
            news: []
        }
    }

    componentDidMount(): void {
        Axios.get(url(emiyaJ, 'news', 'get'))
            .then((r: AxiosResponse<{news: News[]}>) => {
                const news = r.data.news;
                let status = PageStatus.LOADED;
                if (news.length <= 0) {
                    status = PageStatus.EMPTY;
                }
                this.setState({status, news})
            })
            .catch(() => {
                this.setState({status: PageStatus.ERROR, news: []});
            })
    }

    getContent = (): React.ReactElement => {
        switch(this.state.status) {
            case PageStatus.LOADED:
                return (
                    <List>
                        {this.state.news.map(news => (
                            <ListItem button key={news.title.en}>
                                <ListItemText primary={getContentByLocale(news.title)} secondary={news.created_at}/>
                            </ListItem>
                        ))}
                    </List>
                )
            case PageStatus.ERROR:
                return (
                    <CardContent>
                        <Typography variant={'h6'}>
                            {l('news.error')}
                        </Typography>
                    </CardContent>
                )
            case PageStatus.EMPTY:
                return (
                    <CardContent>
                        <Typography variant={'h6'}>
                            {l('news.empty')}
                        </Typography>
                    </CardContent>
                )
            case PageStatus.LOADING:
            default:
                return (
                    <CardContent>
                        <Typography variant={'h6'}>
                            {l('news.loading')}
                        </Typography>
                    </CardContent>
                )
        }
    }

    render(): React.ReactElement {
        return (
            <Card>
                <CardHeader title={'News'}/>
                {this.getContent()}
            </Card>
        )
    }
}

export default NewsModule;