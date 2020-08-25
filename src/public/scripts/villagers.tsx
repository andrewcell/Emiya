import React from 'react';
import ReactDOM from 'react-dom';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {detectLanguage, getLanguage, getLoadingPhrase, l, setLanguage} from './locale';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import axios from 'axios';
import {decrypt, encrypt} from './encryption/AES';
import VillagerDetail from './villagers/VillagerDetail';
import VillagerSearchByClothes from './villagers/VillagerSearchByClothes';
import VillagersPreferGift from './villagers/VillagersPreferGift';
import {PageStatus} from './points/enums';
import Layout from './materialui/Layout';
import {Tabs} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import {Villager} from 'animal-crossing/lib/types/Villager';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';

interface VillagersState {
    pageStatus: PageStatus;
    allVillagers: Villager[];
    myVillagers: Villager[];
    loginStatus: boolean;
}

type VillagersProps = {};

class Villagers extends React.Component<VillagersProps, VillagersState> {
    constructor(prop: VillagersProps) {
        super(prop);

        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        setLanguage(Cookies.get('locale') as string);
    }

    componentDidMount(): void {
        axios.get('/villagers/react/villagers').then(response => {
            const villagersJson: Villager[] = JSON.parse(decrypt(response.data.data))
            this.setState({allVillagers: villagersJson});
            Axios.get('/admin/logincheck')
                .then(() => {
                    axios.get('/villagers/react/my/get').then(res => {
                        const arr: string[] = [];
                        const list = JSON.parse(decrypt(res.data.data));
                        list.forEach((value: string) => {
                            arr.push(value);
                        });
                        const filtered: Villager[] = villagersJson.filter((item: Villager) => {
                            return arr.includes(item.filename);
                        });
                        this.setState({
                            myVillagers: filtered,
                            loginStatus: true,
                            pageStatus: PageStatus.LOADED
                        });
                    });
                })
                .catch(() => {
                    const villagers = localStorage.getItem('myVillagers');
                    if (villagers == null) {
                        this.setState({myVillagers: [], pageStatus: PageStatus.LOADED});
                    } else {
                        try {
                            const parsed: string[] = JSON.parse(villagers);
                            const filtered: Villager[] = villagersJson.filter((item: Villager) => {
                                return parsed.includes(item.filename);
                            });
                            this.setState({myVillagers: filtered, pageStatus: PageStatus.LOADED});
                        } catch {
                            this.setState({myVillagers: [], pageStatus: PageStatus.LOADED});
                        }
                    }
                })
        })
    }

    setMyVillagers = (arr: Villager[]): void => {
        this.setState({myVillagers: arr});
    }

    addToMyVillagers = (villagerCode: string): Promise<string> => {
        const v = this.state.allVillagers.find(sv => sv.filename === villagerCode);
        if (v == null) return Promise.resolve('Internal Server Error.');
        const { myVillagers } = this.state;
        if (this.state.loginStatus) {
            const data = encrypt(JSON.stringify({code: villagerCode})).toString();
            return new Promise(resolve => {
                axios.post('/villagers/react/my/set', {data}).then(res => {
                    const response = res.data as { code: string; comment: string };
                    // if (response.code === 'villagers00') { }
                    this.addToMyVillagersState(v);
                    resolve(response.comment);
                }).catch(() => {
                    resolve('Internal Server Error.');
                });
            });
        } else {
            try {
                if (myVillagers.includes(v)) {
                    return Promise.resolve(l('villagers.my.exists'));
                }
                if (myVillagers.length >= 14) {
                    return Promise.resolve(l('villagers.my.full'));
                }
                this.addToMyVillagersState(v);
                const code = v.filename;
                const storage = localStorage.getItem('myVillagers');
                if (storage == null) {
                    localStorage.setItem('myVillagers', JSON.stringify([code]));
                } else {
                    localStorage.setItem('myVillagers', JSON.stringify(JSON.parse(storage).concat(code)));
                }
                return Promise.resolve(l('villagers.my.added'));
            } catch {
                return Promise.resolve('Internal Server Error.');
            }
        }
    }

    private addToMyVillagersState = (villager: Villager): void | Promise<void> => {
        this.setState(prevState => ({
            myVillagers: [...prevState.myVillagers, villager]
        }));
    }

    removeVillagerFromState = (code: string): void => {
        this.setState((prevState) => {
            const index = prevState.myVillagers?.findIndex(i => {
                return i.filename === code;
            });
            const prevMyVillagers = prevState.myVillagers;
            if (index !== -1 && index != null) {
                prevMyVillagers.splice(index, 1);
            }
            return {myVillagers: prevMyVillagers}
        })
    }

    removeVillager = (v: Villager): Promise<string> => {
        if (this.state.loginStatus) {
            const encrypted = encrypt(JSON.stringify({code: v.filename})).toString();
            return new Promise(resolve => {
                axios.delete('/villagers/react/my/set', {data: {data: encrypted}}).then(res => {
                    // if (res.data.code === 'villagers00') { }
                    this.removeVillagerFromState(v.filename);
                    return resolve(res.data.comment);
                }).catch(() => {
                    return resolve('Internal Server Error.');
                })
            })
        } else {
            const storage = localStorage.getItem('myVillagers');
            if (storage == null) {
                return Promise.resolve(l('villagers.my.targetnotexists'));
            } else {
                if (storage.includes(v.filename)) {
                    this.removeVillagerFromState(v.filename);
                    return Promise.resolve(l('villagers.my.deletesuccess'));
                } else {
                    return Promise.resolve(l('villagers.my.targetnotexists'));
                }
            }
        }
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <>
                        <BrowserRouter>
                            <Route path={'/villagers'} render={({ location }): JSX.Element => (
                                    <>
                                        <Tabs value={location.pathname} style={{backgroundColor: '#4caf50', color: 'white'}} scrollButtons={'auto'}>
                                            <Tab label={l('villagers.nav.myvillagers')} value={'/villagers'} component={Link} to={'/villagers'} />
                                            <Tab label={l('villagers.nav.allvillagers')} value={'/villagers/list'} component={Link} to={'/villagers/list'} />
                                            <Tab label={l('villagers.nav.giftforvillagers')} value={'/villagers/gift'} component={Link} to={'/villagers/gift'} />
                                            <Tab label={l('villagers.nav.villagerstogift')} value={'/villagers/prefer'} component={Link} to={'/villagers/prefer'} />
                                        </Tabs>
                                        <Switch>
                                            <Route exact path={'/villagers'}>
                                                <MyVillagers locale={getLanguage()} my={this.state.myVillagers} refresh={this.setMyVillagers} renderComplete={this.state.pageStatus === PageStatus.LOADED} removeVillager={this.removeVillager} data={this.state.allVillagers}/>
                                            </Route>
                                            <Route exact path={'/villagers/list'}>
                                                <VillagersList locale={getLanguage()} addVillager={this.addToMyVillagers} removeVillager={this.removeVillager} data={this.state.allVillagers}/>
                                            </Route>
                                            <Route exact path={'/villagers/gift'}>
                                                <VillagerSearchByClothes myVillagers={this.state.myVillagers} />
                                            </Route>
                                            <Route exact path={'/villagers/prefer'}>
                                                <VillagersPreferGift data={this.state.allVillagers} />
                                            </Route>
                                            <Route path={'/villagers/:code'}  component={(props: any): React.ReactElement => <VillagerDetail fromParam={true} data={this.state.allVillagers} addVillager={this.addToMyVillagers} code={props.match.params.code} removeVillager={this.removeVillager}/>} />
                                        </Switch>
                                    </>
                                )}
                            />
                            <h1 style={{color: 'black'}}>{this.state.loginStatus}</h1>
                        </BrowserRouter>
                    </>
                )
            default:
                return (
                    <Grid container justify={'center'} alignItems={'center'} direction={'column'} spacing={1} >
                        <Grid item />
                        <Grid item>
                        <CircularProgress />
                        </Grid>
                        <Grid item>
                        <Typography variant={'h6'}>{getLoadingPhrase()}</Typography>
                        </Grid>
                    </Grid>
                )
        }
    }
}

export default Villagers;

ReactDOM.render(<Layout content={<Villagers />}  pageStatus={PageStatus.LOADED} />, document.getElementById('reactApp'));
