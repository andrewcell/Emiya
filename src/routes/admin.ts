import { Request, Response, Router} from 'express';
import User from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
import {internalError} from '@shared/constants';
const router = Router();


router.post('/login', (req: Request, res: Response) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return res.json({code: 500, comment: internalError}) }
        if (!user) { return res.json({code: 'login01', comment: res.__('ts.admin.login.invalidlogin')}) }
        req.logIn(user, (err)=> {
            if (err) {
                logger.error(err.message, err);
            }
            return res.json({code: 'login00', comment: 'success'})
        })
        return user
    })(req, res);
});

router.post('/register', (req: Request, res: Response) => {
    User.register(new User({email: '***REMOVED***', username: '***REMOVED***'}), '***REMOVED***', (err, user) => {
        if (err) {
            logger.error(err.message, err)
        } else {
            logger.info(user)
        }
    });
});

router.get('/logout', (req: Request, res: Response) => {
    req.logout();
    return res.redirect('/')
});

export default router;
