import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {setLanguage} from './locale';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import VillagersList from './villagers/VillagersList';
import LinkButtons from './villagers/LinkButtons';
import axios from "axios";
import { VillagersData, Villager } from './villagers/interfaces';
import { Style, Color } from './villagers/enums';
import {AES, enc} from 'crypto-js';
import {decrypt} from './encryption/AES';
import VillagerDetail from './villagers/VillagerDetail';
import VillagersGift from './villagers/VillagersGift';
import VillagersPreferGift from './villagers/VillagersPreferGift';

class Villagers extends React.Component<any, VillagersData> {
    constructor(prop: any) {
        if (Cookies.get('locale') == null) Cookies.set('locale', 'ko_KR')
        setLanguage(Cookies.get('locale') as string);
        super(prop);
        this.state = {data: []}

        axios.get('/villagers/react/villagers').then(response => {
            const villagersJson = JSON.parse(decrypt(response.data.data))
            const array: Villager[] = [];
            villagersJson.forEach((v: any, k: number) => {
                const data: Villager = {
                    id: v.id,
                    personality: v.personality,
                    hobby: v.hobby,
                    type: (v.type == 0) ? 'A' : 'B',
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
        });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <LinkButtons />
                    <Switch>
                        <Route exact path={'/villagers'}>
                            <MyVillagers locale={Cookies.get('locale')} data={this.state.data}/>
                        </Route>
                        <Route exact path={'/villagers/list'}>
                            <VillagersList locale={Cookies.get('locale')} data={this.state.data}/>
                        </Route>
                        <Route exact path={'/villagers/gift'}>
                            <VillagersGift data={this.state.data} />
                        </Route>
                        <Route exact path={'/villagers/prefer'}>
                            <VillagersPreferGift data={this.state.data} />
                        </Route>
                        <Route path={'/villagers/:code'}  component={(props: any) => <VillagerDetail {...props} data={this.state.data} />}  />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Villagers;

ReactDOM.render(<Villagers />, document.getElementById('reactApp'));
