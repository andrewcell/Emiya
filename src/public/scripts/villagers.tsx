import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import './locale';
import MyVillagers from './villagers/MyVillagers';
import Cookies from 'js-cookie';
import {setLanguage} from './locale';

if (Cookies.get('locale') == null) Cookies.set('locale', 'en_US')
setLanguage(Cookies.get('locale') as string);

const Villagers = () => {
    return (
        <MyVillagers locale={Cookies.get('locale')}/>
    )
}

export default Villagers;

ReactDOM.render(<Villagers />, document.getElementById('reactApp'));
