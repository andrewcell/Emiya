import {l} from './locale';

export interface MenuItem {
    title: string;
    link: string;
}

export interface MenuEntry {
    title: string;
    menu: MenuItem[];
}

const villagerMenu = [
    {title: l('villagers.nav.myvillagers'), link: '/villagers/'},
    {title: l('villagers.nav.allvillagers'), link: '/villagers/list'},
    {title: l('layout.villagers.gift'), link: '/villagers/gift'},
    {title: l('layout.villagers.prefer'), link: '/villagers/prefer'},
]

const villagers = {
    title: l('layout.villagers.title'),
    menu: villagerMenu
}

const emibo = {
    title: l('layout.emibo.title'),
    menu: [{title: 'Emibo', link: '/emibo'}]
}

const points = {
    title: l('layout.points.title'),
    menu: [{title: l('layout.points.title'), link: '/points'}]
}

const language = {
    title: 'Languages',
    menu: [
        {title: 'English (U.S.)', link: '/lang/en'},
        {title: '한국어 (대한민국)', link: '/lang/ko'},
        {title: '日本語 (日本)', link: '/lang/ja'}
    ]
}

const system = {
    title: l('layout.system.title'),
    menu: [
        {title: l('layout.system.about'), link: '/info'},
        {title: l('layout.system.logout'), link: '/admin/logout'}
    ]
}

const campsite = {
    title: l('layout.system.campsite'),
    menu: [
        {title: l('layout.system.campsite'), link: '/campsite'},
        {title: l('layout.campsite.history'), link: '/campsite/history'}
    ]
}

const translations = {
    title: l('home.translations.title'),
    menu: [
        {title: l('home.translations.title'), link: '/translate'},
    ]
}

export default [emibo, villagers, /* campsite, points, */ translations, system, language]