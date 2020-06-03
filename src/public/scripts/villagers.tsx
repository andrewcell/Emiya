import React from 'react';
import ReactDOM from 'react-dom';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {setLanguage} from './locale';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import LinkButtons from './villagers/LinkButtons';
import axios from 'axios';
import { VillagersData, Villager } from './villagers/interfaces';
import { Style, Color } from './villagers/enums';
import {decrypt} from './encryption/AES';
import VillagerDetail from './villagers/VillagerDetail';
import VillagerSearchByClothes from './villagers/VillagerSearchByClothes';
import VillagersPreferGift from './villagers/VillagersPreferGift';

class Villagers extends React.Component<any, VillagersData> {
    constructor(prop: any) {
        super(prop);
        if (Cookies.get('locale') == null) Cookies.set('locale', 'en_US')
        setLanguage(Cookies.get('locale') as string);

        this.state = {data: [], my: [], renderComplete: false, addVillager: (): void => {return}}

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
            this.setState({data: array});
            axios.get('/villagers/react/my/get').then(res => {
                const arr: string[] = [];
                const list = JSON.parse(decrypt(res.data.data));
                list.forEach((value: string) => {
                    arr.push(value);
                });
                const filtered: Villager[] = this.state.data.filter((item: Villager) => {
                    return arr.includes(item.code);
                });
                this.setState({my: filtered, renderComplete: true});
            });
        });
        this.setMyVillagers = this.setMyVillagers.bind(this);
        this.addToMyVillagers = this.addToMyVillagers.bind(this);

    }

    setMyVillagers = (arr: Villager[]): void => {
        this.setState({my: arr});
    }

    addToMyVillagers = (villager: string): void => {
        const vill = this.state.data.filter((item: Villager) => {
            return villager === item.code;
        })
        this.setState((prevState) => {
            {my: prevState.my?.push(vill[0])}
        })
    }

    removeVillager = (code: string): void => {
        this.setState((prevState) => {
            const index = prevState.my?.findIndex(i => {
                return i.code === code;
            });
            if (index !== -1 && index != null) {
                my: prevState.my?.splice(index, 1)
            }
            return {my: prevState.my}
        })
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <LinkButtons />
                    <Switch>
                        <Route exact path={'/villagers'}>
                            <MyVillagers locale={Cookies.get('locale')} data={this.state.data} my={this.state.my} refresh={this.setMyVillagers} renderComplete={this.state.renderComplete} />
                        </Route>
                        <Route exact path={'/villagers/list'}>
                            <VillagersList locale={Cookies.get('locale')} data={this.state.data} addVillager={this.addToMyVillagers} />
                        </Route>
                        <Route exact path={'/villagers/gift'}>
                            <VillagerSearchByClothes my={this.state.my} />
                        </Route>
                        <Route exact path={'/villagers/prefer'}>
                            <VillagersPreferGift data={this.state.data} />
                        </Route>
                        <Route path={'/villagers/:code'}  component={(props: any) => <VillagerDetail {...props} data={this.state.data} removeVillager={this.removeVillager}/>}  />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Villagers;

ReactDOM.render(<Villagers />, document.getElementById('reactApp'));
