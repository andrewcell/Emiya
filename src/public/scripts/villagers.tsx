import {$} from './layout'
import * as React from 'react';
import ReactDOM from 'react-dom';
import M from "materialize-css";
import axios from 'axios';
import {Button, Card, Col, Collection, CollectionItem, Icon, Modal, Row} from 'react-materialize';
import {RegisterCode} from './register';
import {element} from 'prop-types';
import {l, Locale} from './locales/locale';

interface testProps {
    value: number
}

interface villagerState {
    code: Map<number, string>
}

enum Style {
    CUTE = 'cute',
    SIMPLE = 'simple',
    COOL = 'cool',
    ELEGANT = 'elegant',
    ACTIVE = 'active',
    GORGEOUS = 'gorgeous'
}

enum Color {
    BROWN = 'brown',
    LIGHTBLUE = 'lightblue',
    BLUE = 'blue',
    BLACK = 'black',
    PURPLE = 'purple',
    RED = 'red',
    WHITE = 'white',
    GREEN = 'green',
    PINK = 'pink',
    COLORFUL = 'colorful',
    BEIGE = 'beige',
    ORANGE = 'orange',
    GRAY = 'gray',
    YELLOW = 'yellow'
}

interface Villager {
    id: number,
    personality: string,
    hobby: string,
    type: number,
    birthday: string,
    style1: Style,
    style2: Style,
    color1: Color,
    color2: Color,
    voicetone: number,
    species: string,
    code: string,
    nameKor: string,
    nameEng: string,
    mottoKor: string,
    mottoEng: string,
    phraseKor: string,
    phraseEng: string
}

interface modalState {
    locale: string,
    data: Array<Villager>
}

class VillagersModal extends React.Component<any, modalState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            locale: 'en_US',
            data: []
        }
        Locale.select(this.state.locale);
    }
    async componentDidMount() {
        const response = await axios.get('/villagers/villagers');
        const villagersJson = response.data;
        const array: Villager[] = [];
        villagersJson.data.forEach((v: any, k: number) => {
            const data: Villager = {
                id: v.id,
                personality: v.personality,
                hobby: v.hobby,
                type: v.type,
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
        this.setState({locale: villagersJson.locale, data: array})
    }

    render() {
        const arr: any[] = [];
        this.state.data.forEach((v, k) => {
            let type = (v.type === 0) ? 'A' : 'B';
            let name = (this.state.locale === 'ko_KR') ? v.nameKor + ' - ' + v.nameEng  : v.nameEng

            arr.push(
                <CollectionItem href={'#'}>
                    <img src={'/images/villagers/' + v.code + '.png'} style={{width: '10%'}} />
                    <span style={{verticalAlign: 'top'}}>{name} ({type})</span>
                    <p>{l('villagers.personalities.'+v.personality)}</p>
                </CollectionItem>
            )
        });
        return (
            <Modal actions={[
                <Button flat modal="close" node="button" waves="green">Close</Button>
            ]} fixedFooter={true} header="Add Villager" id='villagersModal' open={false} >
                <Collection>

                </Collection>
            </Modal>
        );
    }
}

class MyVillagers extends React.Component<any, villagerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            code: new Map([
                [1,'flg18'],
                [2,'flg18'],
                [3,'flg18'],
                [4,'flg18'],
                [5,'flg18'],
                [6,'flg18'],
                [7,'flg18'],
                [8,'flg18'],
                [9,'flg18'],
                [10,'cat23'],
            ])
        }
    }

    componentDidMount() {
        M.Modal.init(document.querySelector('#villagersModal')!)
        fetch('/villagers/my')
            .then(res => res.json())
    }

    addButton = <a href={'#'} data-target={'villagersModal'} className={'modal-trigger'}><Button floating icon={<Icon>add</Icon>} large waves={'light'}  /></a>

    render() {
        const villagers: any[] = []

        this.state.code.forEach((value: string, key: number) => {
            villagers.push(
                <Col l={1}>
                    <img src={'/images/villagers/' + value + '.png'} />
                </Col>
            )
        })
        return (
            <div className={'my'}>
                <VillagersModal />
                <Card title={'My Villagers'}>
                    <Row>
                        {villagers}
                        <div className={'right-align'}>
                            {this.addButton}
                        </div>
                    </Row>
                </Card>

            </div>
        )
    }
}


const Villagers = () => {
    return (
        <MyVillagers />
    )
}






export default Villagers;

ReactDOM.render(<Villagers />, document.getElementById("reactApp"));
