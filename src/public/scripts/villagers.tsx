import React from 'react';
import ReactDOM from 'react-dom';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {detectLanguage, getLanguage, l, setLanguage} from './locale';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import LinkButtons from './villagers/LinkButtons';
import axios from 'axios';
import {Villager} from './villagers/interfaces';
import {decrypt} from './encryption/AES';
import VillagerDetail from './villagers/VillagerDetail';
import VillagerSearchByClothes from './villagers/VillagerSearchByClothes';
import VillagersPreferGift from './villagers/VillagersPreferGift';
import {PageStatus} from './points/enums';
import {Container, ProgressBar} from 'materialinse-reactjs';
import {objectToVillager} from './villagers/ObjectToVillager';
import Layout from './materialui/Layout';
import {Tabs} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';

interface VillagersState {
    pageStatus: PageStatus;
    allVillagers: Villager[];
    myVillagers: Villager[];
}

class Villagers extends React.Component<any, VillagersState> {
    constructor(prop: any) {
        super(prop);

        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        setLanguage(Cookies.get('locale') as string);
        this.setMyVillagers = this.setMyVillagers.bind(this);
        this.addToMyVillagers = this.addToMyVillagers.bind(this);
    }

    componentDidMount(): void {
        axios.get('/villagers/react/villagers').then(response => {
            const villagersJson = JSON.parse(decrypt(response.data.data))
            const array: Villager[] = [];
            villagersJson.forEach((v: any) => {
                const data = objectToVillager(v);
                array.push(data);
            });
            axios.get('/villagers/react/my/get').then(res => {
                const arr: string[] = [];
                const list = JSON.parse(decrypt(res.data.data));
                list.forEach((value: string) => {
                    arr.push(value);
                });
                const filtered: Villager[] = array.filter((item: Villager) => {
                    return arr.includes(item.code);
                });
                this.setState({myVillagers: filtered, allVillagers: array, pageStatus: PageStatus.LOADED});
            });
        });
    }

    setMyVillagers = (arr: Villager[]): void => {
        this.setState({myVillagers: arr});
    }

    addToMyVillagers = (villager: string): void => {
        const vill = this.state.allVillagers.filter((item: Villager) => {
            return villager === item.code;
        })
        this.setState(prevState => ({
            myVillagers: [...prevState.myVillagers, vill[0]]
        }));
    }

    removeVillager = (code: string): void => {
        this.setState((prevState) => {
            const index = prevState.myVillagers?.findIndex(i => {
                return i.code === code;
            });
            const prevMyVillagers = prevState.myVillagers;
            if (index !== -1 && index != null) {
                prevMyVillagers.splice(index, 1);
            }
            return {myVillagers: prevMyVillagers}
        })
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <>
                        <BrowserRouter>
                            <Route path={'/villagers'} render={({ location }): JSX.Element => (
                                    <>
                                        <Tabs value={location.pathname} style={{backgroundColor: '#4caf50', color: 'white'}}>
                                            <Tab label={l('villagers.nav.myvillagers')} value={'/villagers'} component={Link} to={'/villagers'} />
                                            <Tab label={l('villagers.nav.allvillagers')} value={'/villagers/list'} component={Link} to={'/villagers/list'} />
                                            <Tab label={l('villagers.nav.giftforvillagers')} value={'/villagers/gift'} component={Link} to={'/villagers/gift'} />
                                            <Tab label={l('villagers.nav.villagerstogift')} value={'/villagers/prefer'} component={Link} to={'/villagers/prefer'} />
                                        </Tabs>
                                        <Switch>
                                            <Route exact path={'/villagers'}>
                                                <MyVillagers locale={getLanguage()} data={this.state.allVillagers} my={this.state.myVillagers} refresh={this.setMyVillagers} renderComplete={this.state.pageStatus === PageStatus.LOADED} removeVillager={this.removeVillager} />
                                            </Route>
                                            <Route exact path={'/villagers/list'}>
                                                <VillagersList locale={getLanguage()} data={this.state.allVillagers} addVillager={this.addToMyVillagers} />
                                            </Route>
                                            <Route exact path={'/villagers/gift'}>
                                                <VillagerSearchByClothes myVillagers={this.state.myVillagers} />
                                            </Route>
                                            <Route exact path={'/villagers/prefer'}>
                                                <VillagersPreferGift data={this.state.allVillagers} />
                                            </Route>
                                            <Route path={'/villagers/:code'}  component={(props: any): React.ReactElement => <VillagerDetail fromParam={true} addVillager={this.addToMyVillagers} code={props.match.params.code} data={this.state.allVillagers} removeVillager={this.removeVillager}/>} />
                                        </Switch>
                                    </>
                                )}
                            />
                        </BrowserRouter>
                    </>
                )
            default:
                return (
                    <Container>
                        <ProgressBar />
                    </Container>
                )
        }
    }
}

export default Villagers;

ReactDOM.render(<Layout content={<Villagers />}  pageStatus={PageStatus.LOADED}/>, document.getElementById('reactApp'));
