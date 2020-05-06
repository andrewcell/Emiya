import { Router } from 'express';
import emiboRouter from './index';

// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.render('home');
    //return res.redirect('/emibo');
});

// Add sub-routes
router.use('/emibo', emiboRouter);

// Export the base-router
export default router;