import React from 'react';
import ReactDOM from 'react-dom';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {detectLanguage, getLanguage, setLanguage} from './locale';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import LinkButtons from './villagers/LinkButtons';
import axios from 'axios';
import {Villager} from './villagers/interfaces';
import {Color, Style} from './villagers/enums';
import {decrypt} from './encryption/AES';
import VillagerDetail from './villagers/VillagerDetail';
import VillagerSearchByClothes from './villagers/VillagerSearchByClothes';
import VillagersPreferGift from './villagers/VillagersPreferGift';
import {PageStatus} from './points/enums';
import {Container, ProgressBar} from 'react-materialize';

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
                const data: Villager = {
                    id: v.id,
                    personality: v.personality,
                    hobby: v.hobby,
                    type: (v.type === 0) ? 'A' : 'B',
                    birthday: v.birthday,
                    style1: v.style1 as Style,
                    style2: v.style2 as Style,
                    color1: v.color1 as Color,
                    color2: v.color2 as Color,
                    voicetone: v.voicetone,
                    species: v.species,
                    code: v.code,
                    nameKor: v.name_kor,
                    nameEng: v.name_english,
                    mottoKor: v.motto_kor,
                    mottoEng: v.motto_english,
                    phraseKor: v.phrase_kor,
                    phraseEng: v.phrase_english
                }
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
        this.setState((prevState) => {
            {myVillagers: prevState.myVillagers?.push(vill[0])}
        })
    }

    removeVillager = (code: string): void => {
        this.setState((prevState) => {
            const index = prevState.myVillagers?.findIndex(i => {
                return i.code === code;
            });
            if (index !== -1 && index != null) {
                myVillagers: prevState.myVillagers?.splice(index, 1)
            }
            return {myVillagers: prevState.myVillagers}
        })
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        switch (this.state?.pageStatus) {
            case PageStatus.LOADED:
                return (
                    <div>
                        <BrowserRouter>
                            <LinkButtons />
                            <Switch>
                                <Route exact path={'/villagers'}>
                                    <MyVillagers locale={getLanguage()} data={this.state.allVillagers} my={this.state.myVillagers} refresh={this.setMyVillagers} renderComplete={this.state.pageStatus == PageStatus.LOADED} />
                                </Route>
                                <Route exact path={'/villagers/list'}>
                                    <VillagersList locale={getLanguage()} data={this.state.allVillagers} addVillager={this.addToMyVillagers} />
                                </Route>
                                <Route exact path={'/villagers/gift'}>
                                    <VillagerSearchByClothes my={this.state.myVillagers} />
                                </Route>
                                <Route exact path={'/villagers/prefer'}>
                                    <VillagersPreferGift data={this.state.allVillagers} />
                                </Route>
                                <Route path={'/villagers/:code'}  component={(props: any): React.ReactElement => <VillagerDetail {...props} data={this.state.allVillagers} removeVillager={this.removeVillager}/>}  />
                            </Switch>
                        </BrowserRouter>
                    </div>
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

ReactDOM.render(<Villagers />, document.getElementById('reactApp'));
