import React from 'react';
import ReactDOM from 'react-dom';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {detectLanguage, getLanguage, getLoadingPhrase, l, setLanguage} from './locale';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import axios from 'axios';
import Axios, {AxiosResponse} from 'axios';
import {decrypt, encrypt} from './encryption/AES';
// import VillagerDetail from './villagers/VillagerDetail';
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
import {CodeCommentData, Data, LoginResponse} from './repsonseBody';
import VillagersGroupManagement from './villagers/VillagersGroupManagement';

interface VillagersState {
    pageStatus: PageStatus;
    allVillagers: Villager[];
    myVillagers: Villager[];
    loginStatus: boolean;
    selectedGroup: string;
    storage: {[key: string]: string[]};
}

type VillagersProps = unknown;

type getVillagersData = [string, string[], string[], VillagerStorage];

interface VillagerStorage {
    [key: string]: string[];
}

class Villagers extends React.Component<VillagersProps, VillagersState> {
    constructor(prop: VillagersProps) {
        super(prop);
        if (Cookies.get('locale') == null) {
            const lang = detectLanguage(navigator.language);
            Cookies.set('locale', lang);
        }
        void setLanguage(Cookies.get('locale') as string);
    }

    componentDidMount(): void {
        axios.get('/villagers/react/villagers')
            .then((response: AxiosResponse<Data>) => {
                const villagersJson = JSON.parse(decrypt(response.data.data)) as Villager[]
                this.setState({allVillagers: villagersJson});
                Axios.get('/admin/logincheck')
                    .then(() => {
                        axios.get('/villagers/react/my/get').then((res: AxiosResponse<Data>) => {
                            const storage = JSON.parse(decrypt(res.data.data)) as getVillagersData;
                            const selectedGroup = storage[0]
                            const villagersCodes: string[] = storage[1]
                            const filtered: Villager[] = villagersJson.filter((item: Villager) => {
                                return villagersCodes.includes(item.filename);
                            });
                            this.setState({
                                myVillagers: filtered,
                                loginStatus: true,
                                pageStatus: PageStatus.LOADED,
                                storage: storage[3],
                                selectedGroup
                            });
                        }).catch(() => {this.setState({pageStatus: PageStatus.ERROR})})
                    })
                    .catch(() => {
                        const villagers = localStorage.getItem('myVillagers');
                        const selectedGroup = localStorage.getItem('group');
                        localStorage.setItem('group', 'Default');
                        if (villagers == null || selectedGroup == null) {
                            this.setState({
                                myVillagers: [],
                                selectedGroup: 'Default',
                                pageStatus: PageStatus.LOADED,
                                storage: {'Default': []}
                            });
                        } else {
                            try {
                                localStorage.setItem('group', selectedGroup);
                                const storage = JSON.parse(villagers) as VillagerStorage;
                                const myVillagers: Villager[] = villagersJson.filter((item: Villager) => {
                                    return storage[selectedGroup].includes(item.filename);
                                });
                                this.setState({
                                    myVillagers,
                                    selectedGroup,
                                    storage,
                                    pageStatus: PageStatus.LOADED
                                });
                            } catch {
                                this.setState({
                                    myVillagers: [],
                                    selectedGroup: 'Default',
                                    pageStatus: PageStatus.LOADED,
                                    storage: {'Default': []}
                                });
                            }
                        }
                    })
            })
            .catch(() => {
                this.setState({pageStatus: PageStatus.ERROR})
            })
    }

    createGroup = (groupName: string): void => {
        this.setState(prevState => ({
            storage: {
                ...prevState.storage,
                [groupName]: []
            }
        }));
    }

    setMyVillagers = (arr: Villager[]): void => {
        this.setState({myVillagers: arr});
    }

    addToMyVillagers = (villagerCode: string): Promise<string> => {
        const v = this.state.allVillagers.find(sv => sv.filename === villagerCode);
        if (v == null) return Promise.resolve('Internal Server Error.');
        const { myVillagers, selectedGroup } = this.state;
        if (this.state.loginStatus) {
            const data = encrypt(JSON.stringify({code: villagerCode})).toString();
            return new Promise(resolve => {
                axios.post('/villagers/react/my/set', {data}).then(res => {
                    const response = res.data as { code: string; comment: string };
                    if (response.code === 'villagers00') {
                        void this.addToMyVillagersState(v);
                    }
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
                const code = v.filename;
                const storageJson = localStorage.getItem('myVillagers');
                if (storageJson == null) {
                    const storage: VillagerStorage = {};
                    storage[selectedGroup] = [code];
                    localStorage.setItem('myVillagers', JSON.stringify(storage));
                } else {
                    const storage = JSON.parse(storageJson) as VillagerStorage;
                    storage[selectedGroup].push(code);
                    localStorage.setItem('myVillagers', JSON.stringify(storage));
                }
                void this.addToMyVillagersState(v);
                return Promise.resolve(l('villagers.my.added'));
            } catch {
                return Promise.resolve('Internal Server Error.');
            }
        }
    }

    private addToMyVillagersState = (villager: Villager): void | Promise<void> => {
        this.addToStorageState(villager.filename);
        this.setState(prevState => ({
            myVillagers: [...prevState.myVillagers, villager],
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
            this.removeFromStorageState(prevMyVillagers);
            return {myVillagers: prevMyVillagers}
        })
    }

    addToStorageState = (code: string): void => {
        const { storage, selectedGroup } = this.state;
        const groupInStorage = storage[selectedGroup];
        this.setState(prevState => ({
            storage: {
                ...prevState.storage,
                [selectedGroup]: [...groupInStorage, code]
            }
        }));
    }

    removeFromStorageState = (arr: Villager[]): void => {
        const { selectedGroup } = this.state;
        const newArr: string[] = [];
        arr.map(v => {
            newArr.push(v.filename);
        });
        this.setState(p => ({
            storage: {
                ...p.storage,
                [selectedGroup]: newArr
            }
        }));
    }

    removeVillager = (v: Villager): Promise<string> => {
        if (this.state.loginStatus) {
            const encrypted = encrypt(JSON.stringify({code: v.filename}));
            return new Promise(resolve => {
                axios.post('/villagers/react/my/delete', {data: encrypted})
                    .then((res: AxiosResponse<CodeCommentData>) => {
                        if (res.data.code === 'villagers00') {
                            this.removeVillagerFromState(v.filename);
                        }
                        return resolve(res.data.comment);
                    })
                    .catch(() => {
                        return resolve('Internal Server Error.');
                    })
            })
        } else {
            const storageJson = localStorage.getItem('myVillagers');
            if (storageJson == null) {
                return Promise.resolve(l('villagers.my.targetnotexists'));
            } else {
                const storage = JSON.parse(storageJson) as VillagerStorage;
                const myVillagersCode: string[] = storage[this.state.selectedGroup];
                if (myVillagersCode.includes(v.filename)) {
                    const index = myVillagersCode.indexOf(v.filename, 0);
                    if (index > -1) {
                        myVillagersCode.splice(index, 1);
                    }
                    this.removeVillagerFromState(v.filename);
                    localStorage.setItem('myVillagers', JSON.stringify(storage));
                    return Promise.resolve(l('villagers.my.deletesuccess'));
                } else {
                    return Promise.resolve(l('villagers.my.targetnotexists'));
                }
            }
        }
    }

    changeVillagerGroup = (groupName: string): Promise<string> => {
        return new Promise<string>(resolve => {
            if (this.state.loginStatus) {
                Axios.put('/villagers/group', {data: encrypt(groupName)})
                    .then((r: AxiosResponse<CodeCommentData>) => {
                        // group01 = Group not exists.
                        if (r.data.code === 'group00') {
                            const villagerCodes = JSON.parse(decrypt(r.data.data)) as string[];
                            const myVillagers = this.codeArrayToVillagerArray(villagerCodes)
                            this.setState({selectedGroup: groupName, myVillagers})
                            return resolve('');
                        } else {
                            return resolve(r.data.comment);
                        }
                    })
                    .catch(() => {
                        return resolve('Internal Server Error.');
                    });
            } else {
                const { storage } = this.state;
                if (storage == null) {
                    return resolve(l('villagers.group.notfound'));
                } else {
                    if (groupName in storage) {
                        localStorage.setItem('group', groupName);
                        this.setState({selectedGroup: groupName, myVillagers: this.codeArrayToVillagerArray(storage[groupName])})
                        return resolve('')
                    } else {
                        return resolve(l('villagers.group.notfound'));
                    }
                }
            }
        })
    }

    codeArrayToVillagerArray = (codes: string[]): Villager[] => {
        return this.state.allVillagers.filter((item: Villager) => {
            return codes.includes(item.filename);
        });
    }

    deleteGroup = (groupName: string): Promise<boolean> => {
        const objectIsEmpty = (obj: VillagerStorage): boolean => {
            return Object.keys(obj).length === 0 && obj.constructor === Object
        }
        const setToDefault = (): void => {
            localStorage.setItem('myVillagers', JSON.stringify({'Default': []}));
            localStorage.setItem('group', 'Default');
            this.setState({storage: {'Default': []}})
        }
        const removeFromState = (): void => {
            this.setState(p => {
                const prevStorage = p.storage;
                delete prevStorage[groupName];
                return {storage: prevStorage};
            });
        }
        const resetPreventError = (): void => {
            this.setState({storage: {'Default': [], [groupName]: []}});
        }
        return new Promise<boolean>(resolve => {
            if (this.state.loginStatus) {
                void Axios.post('/villagers/deletegroup', {data: encrypt(groupName)})
                    .then((r: AxiosResponse<CodeCommentData>) => {
                        if (r.data.code === 'group00') {
                            void this.changeVillagerGroup(r.data.data).then(() => {
                                removeFromState();
                                return resolve(false);
                            });
                        } else if (r.data.code === 'group02') {
                            resetPreventError();
                            void this.changeVillagerGroup('Default').then(() => {
                                this.setState({storage: {'Default': []}});
                                return resolve(true);
                            });
                        }
                    })
            } else {
                const storageJson = localStorage.getItem('myVillagers');
                if (storageJson == null) {
                    resolve(false);
                } else {
                    const storage = JSON.parse(storageJson) as VillagerStorage;
                    if (groupName in storage) {
                        const groups = Object.keys(storage)
                        const index = groups.indexOf(groupName)
                        if (index === -1) {
                            resetPreventError();
                            this.setState({selectedGroup: 'Default', myVillagers: []}, () => {
                                setToDefault();
                                return resolve(true);
                            });
                        } else {
                            delete storage[groupName];
                            if (objectIsEmpty(storage)) {
                                resetPreventError();
                                this.setState({selectedGroup: 'Default', myVillagers: []}, () => {
                                    setToDefault();
                                    return resolve(true);
                                });
                            } else {
                                let lastGroup = index - 1
                                if (lastGroup < 0) lastGroup = 1;
                                localStorage.setItem('myVillagers', JSON.stringify(storage));
                                localStorage.setItem('group', groups[lastGroup]);
                                void this.changeVillagerGroup(groups[lastGroup]).then(() => {
                                    removeFromState();
                                    return resolve(false);
                                })
                            }
                        }
                    } else {
                        resolve(false);
                    }
                }
            }
        })
    }

    setStorage = (storage: VillagerStorage): void => {
        this.setState({storage});
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <>
                        <BrowserRouter>
                            <Route path={'/villagers'} render={({ location }): JSX.Element => (
                                    <>
                                        <Tabs value={location.pathname} style={{backgroundColor: '#4caf50', color: 'white'}} scrollButtons={'auto'} variant={'scrollable'}>
                                            <Tab label={l('villagers.nav.myvillagers')} value={'/villagers'} component={Link} to={'/villagers'} />
                                            <Tab label={l('villagers.nav.allvillagers')} value={'/villagers/list'} component={Link} to={'/villagers/list'} />
                                            <Tab label={l('villagers.nav.giftforvillagers')} value={'/villagers/gift'} component={Link} to={'/villagers/gift'} />
                                            <Tab label={l('villagers.nav.villagerstogift')} value={'/villagers/prefer'} component={Link} to={'/villagers/prefer'} />
                                            <Tab label={l('villagers.nav.group')} value={'/villagers/group'} component={Link} to={'/villagers/group'} />
                                        </Tabs>
                                        <Switch>
                                            <Route exact path={'/villagers'}>
                                                <MyVillagers locale={getLanguage()} my={this.state.myVillagers} refresh={this.setMyVillagers} renderComplete={this.state.pageStatus === PageStatus.LOADED} removeVillager={this.removeVillager} addVillager={this.addToMyVillagers} data={this.state.allVillagers} groups={Object.keys(this.state.storage)} selectedGroup={this.state.selectedGroup} changeGroup={this.changeVillagerGroup}/>
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
                                            <Route exact path={'/villagers/group'}>
                                                <VillagersGroupManagement loginStatus={this.state.loginStatus} selectedGroup={this.state.selectedGroup} changeGroup={this.changeVillagerGroup} codeToVillagerArray={this.codeArrayToVillagerArray} createGroup={this.createGroup} deleteGroup={this.deleteGroup} storage={this.state.storage}/>
                                            </Route>
                                            {/* <Route path={'/villagers/:code'}  component={(props: { code: string }): React.ReactElement => <VillagerDetail fromParam={true} data={this.state.allVillagers} addVillager={this.addToMyVillagers} code={window.location.search.substring(1)} removeVillager={this.removeVillager}/>} /> */}
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
