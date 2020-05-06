import { Router } from 'express';
import EmiboRouter from './index';

// Init router and path
const router = Router();

router.get('/', (req, res) => {
    return res.redirect('/emibo');
});

// Add sub-routes
router.use('/emibo', EmiboRouter);

// Export the base-router
export default router;