import {l} from './locale';

const villagerMenu = [
    {title: l('villagers.nav.myvillagers'), link: '/villagers/my'},
    {title: l('villagers.nav.allvillagers'), link: '/villagers/my'},
    {title: l('layout.villagers.gift'), link: '/villagers/gift'},
    {title: l('layout.villagers.prefer'), link: '/villagers/prefer'},
]

const emiboMenu = [
    {title: 'Emibo', link: '/emibo'}
]

const villagers = {
    title: l('layout.villagers.title'),
    menu: villagerMenu
}

const emibo = {
    title: l('layout.emibo.title'),
    menu: emiboMenu
}

export default [emibo, villagers]