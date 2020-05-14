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
import aes, {utils} from 'aes-js';
import toBytes = utils.hex.toBytes;
import fromBytes = utils.utf8.fromBytes;

class Villagers extends React.Component<any, VillagersData> {
    constructor(prop: any) {
        if (Cookies.get('locale') == null) Cookies.set('locale', 'en_US')
        setLanguage(Cookies.get('locale') as string);
        super(prop);
        this.state = {data: []}
        const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        axios.get('/villagers/react/villagers').then(response => {
            const villagersJson = JSON.parse(fromBytes(new aes.ModeOfOperation.ctr(key, new aes.Counter(3)).decrypt(toBytes(atob(response.data.data)))))
            const array: Villager[] = [];
            villagersJson.forEach((v: any, k: number) => {
                const data: Villager = {
                    id: v.id,
                    personality: v.personality,
                    hobby: v.hobby,
                    type: (v.type == 0) ? 'A' : 'B',
                    birthday: v.birthday,
                    style1: Style[v.style1 as keyof typeof Style],
                    style2: Style[v.style2 as keyof typeof Style],
                    color1: Color[v.color1 as keyof typeof Color],
                    color2: Color[v.color2 as keyof typeof Color],
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
                        <Route path={'/villagers/list'}>
                            <VillagersList locale={Cookies.get('locale')} data={this.state.data}/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Villagers;

ReactDOM.render(<Villagers />, document.getElementById('reactApp'));
