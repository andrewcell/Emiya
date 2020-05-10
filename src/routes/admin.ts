import { Request, Response, Router} from 'express';
import User from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
const router = Router();


router.post('/login', (req: Request, res: Response) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { res.json({code: 500, err}) }
        if (!user) { res.json({code: 'login01', comment: 'not found'}) }
        if (user) {
            res.json({code: 'login00', comment: user})
        }
        return user
    })(req, res);
});

router.post('/register', (req: Request, res: Response) => {
    User.register(new User({email: '***REMOVED***'}), 'test', (err, user) => {
        if (err) {
            logger.error(err.message, err)
        } else {
            logger.info(user)
        }
    });
});
export default router;
