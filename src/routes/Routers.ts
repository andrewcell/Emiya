import { Router } from 'express';
import emiboRouter from './index';
import LanguageRouter from './language';
import ControlPanelRouter from './controlpanel';

// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
});

// Add sub-routes
router.use('/emibo', emiboRouter);
router.use('/lang', LanguageRouter);
router.use('/cp', ControlPanelRouter);
// Export the base-router
export default router;