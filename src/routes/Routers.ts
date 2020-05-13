import { Router } from 'express';
import emiboRouter from './index';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';
import VillagerRouter from './villager';
import UserRouter from './admin';
import {UserDocument} from '@shared/User'
import {readFileSync} from 'jsonfile';
// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
});

router.get('/favicon.ico', (req, res) => {
    return res.sendStatus(204);
});

router.get('/locale/:locale', (req, res) => {
    if (req.params.locale == null) return res.status(404).json('{error: 1}');
    switch (req.params.locale) {
        case 'ko_KR':
        case 'en_US':
            const file = readFileSync('public/locales/' + req.params.locale) as string;
            return res.json(file)
    }
})

// Add sub-routes
router.use('/emibo', emiboRouter);
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
router.use('/villagers', VillagerRouter);
router.use('/admin', UserRouter);
// Export the base-router
export default router;
