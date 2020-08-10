import { Router } from 'express';
import emiboRouter from './index';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';
import VillagerRouter from './villager';
import UserRouter from './admin';
import {existsSync, readFileSync} from 'fs';
import moment from 'moment';
import axios from 'axios';
import path from 'path';
import {encrypt} from '@shared/Encryption';
import Github from '@shared/Github';

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
    return res.render('info');
});

router.get(['/points', '/points/:param'], (req, res) => {
    return res.render('points', {title: res.__('global.title.subtitle', res.__('points.title'))})
});

router.get(['/campsite', '/campsite/:param'], (req, res) => {
    return res.render('campsite', {title: res.__('global.title.subtitle', res.__('campsite.title'))})
})


// Add sub-routes
router.use('/emibo', emiboRouter);
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
router.use('/villagers', VillagerRouter);
router.use('/admin', UserRouter);
// Export the base-router
export default router;
