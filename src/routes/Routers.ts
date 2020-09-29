import { Router } from 'express';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';
import VillagerRouter from './villager';
import UserRouter from './admin';
import TranslationRouter from './translations';
import {existsSync, readFileSync} from 'fs';
import moment from 'moment';
import axios from 'axios';
import path from 'path';
import {encrypt} from '@shared/Encryption';
import Github from '@shared/Github';
import {villagers} from 'animal-crossing';
import ical, {EventData} from 'ical-generator';

// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
});

router.get('/favicon.ico', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/images/favicon.ico'));
});

router.get('/status', (req, res) => {
    const title = res.__('global.title.subtitle', res.__('info.title'))
    let lastBuildTime: string;
    if (existsSync('buildtime.txt')) {
        lastBuildTime = moment(+readFileSync('buildtime.txt').toString()).format('LLLL');
    } else {
        lastBuildTime = moment(0).format('LLLL');
    }
    axios.get('https://api.github.com/repos/***REMOVED***cell/Emiya/commits', {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB}`
        }
    }).then(response => {
        const github = moment(response.data[0].commit.author.date);
        const emiya = 1;
        const emiyaj = 1;
        const emiyap = 3;
        return res.json({data: encrypt(JSON.stringify({
                lastBuildTime,
                lastCommitTime: github.format('LLLL'),
                title,
                emiya,
                emiyaj,
                emiyap,
                languages: Github.data
        }))});
    }).catch(() => {
        return res.render('info', {lastBuildTime, title});
    })
});

router.get(['/info', '/info/:param'], (req, res) => {
    return res.render('vue', {script: 'about'});
});

router.get(['/translate', '/translate/:param'], (q, s) => {
    return s.render('vue', {script: 'translation'});
});

router.get(['/points', '/points/:param'], (req, res) => {
    return res.render('points', {title: res.__('global.title.subtitle', res.__('points.title'))})
});

router.get(['/campsite', '/campsite/:param'], (req, res) => {
    return res.render('campsite', {title: res.__('global.title.subtitle', res.__('campsite.title'))})
})

router.get('/cal/:code', (req, res) => {
    const v = villagers.find(vi => vi.filename === req.params.code)
    if (v != null) {
        const splited = v.birthday.split('/')
        const birthdayMonth = +splited[0];
        const birthdayDay = +splited[1];
        let title = ''
        switch (req.cookies.locale) {
            case 'ko_KR':
                title = v.translations.korean +'의 생일';
                break;
            case 'ja_JP':
                title = v.translations.japanese +'の誕生日';
                break;
            case 'en_US':
            default:
                title = v.translations.english +'\'s birthday';

        }
        const cal = ical({domain: 'dodo.ij.rs'})
        const event = cal.createEvent({
            start: v.birthday,
            allDay: true,
            summary: title,
            repeating: {
                freq: 'YEARLY'
            },
            x: []
        });
        return res.header({'Content-Type': 'text/calendar'}).send(cal.toString())
        /* createEvent({
            start: [2020, birthdayMonth, birthdayDay, 5, 0],
            duration: { days: 1 },
            title
        }, (err, value) => {

        })*/
    } else {
        return res.status(404).render('error');
    }

});

// Add sub-routes
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
router.use('/villagers', VillagerRouter);
router.use('/admin', UserRouter);
router.use('/translation', TranslationRouter)
// Export the base-router
export default router;
