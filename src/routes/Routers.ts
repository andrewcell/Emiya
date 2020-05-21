import { Router } from 'express';
import emiboRouter from './index';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';
import VillagerRouter from './villager';
import UserRouter from './admin';
import {existsSync, readFileSync} from 'fs';
import moment from 'moment';
import axios from 'axios';
import path from "path";
// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
});

router.get('/favicon.ico', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/images/favicon.ico'));
});

router.get('/info', (req, res) => {
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
        return res.render('info', {lastBuildTime, lastCommitTime: github.format('LLLL')});
    }).catch(err => {
        return res.render('info', {lastBuildTime});
    })

});

// Add sub-routes
router.use('/emibo', emiboRouter);
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
router.use('/villagers', VillagerRouter);
router.use('/admin', UserRouter);
// Export the base-router
export default router;
