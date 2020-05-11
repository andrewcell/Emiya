import { Router } from 'express';
import emiboRouter from './index';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';
import VillagerRouter from './villager';
import UserRouter from './admin';
import {UserDocument} from '@shared/User'
// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
});

router.get('/favicon.ico', (req, res) => {
    return res.sendStatus(204);
});

// Add sub-routes
router.use('/emibo', emiboRouter);
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
router.use('/villagers', VillagerRouter);
router.use('/admin', UserRouter);
// Export the base-router
export default router;
