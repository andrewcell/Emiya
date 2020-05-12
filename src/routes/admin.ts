import {NextFunction, Request, Response, Router} from 'express';
import User, {UserDocument} from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
import {internalError} from '@shared/constants';
import {SendGrid} from '@shared/SendGrid';
import {Mail} from '@shared/Mail';
import {getRandomString} from '@shared/functions';
const router = Router();


router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) { return res.json({code: 500, comment: internalError}) }
        if (!user) { return res.json({code: 'login01', comment: res.__('ts.admin.login.invalidlogin')}) }
        if (!(user as UserDocument).verified) {
            return res.json({code: 'login01', comment: res.__('ts.admin.login.invalidlogin')});
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.error(err.message, err);
            }
            res.json({code: 'login00', comment: 'success'});
            return user
        });
    })(req, res, next);
});

router.post('/register', (req: Request, res: Response) => {
    if (process.env.ALLOWREGISTER === '1') {
        const hash = getRandomString(32);
        User.register(new User({email: req.body.email, username: req.body.username, verified: false, verifyHash: hash}), req.body.password, (err, user) => {
            if (err) {
                switch (err.name) {
                    case 'UserExistsError':
                        return res.json({code: 'register03', comment: res.__('ts.register.usernameoccupied')})
                    case 'MongoError':
                        return res.json({code: 'register03', comment: res.__('ts.register.usernameoremailoccupied')})
                    default:
                        return res.json({code: '500', comment: internalError})
                }
            } else {
                const html = Mail.generateVerifyEmail(req.body.email, hash, res.__('ts.register.clickheretoverifyemail'))
                SendGrid.send(req.body.email, res.__('ts.register.clickheretoverifyemailtitle'), html).then(() => {
                    return res.json({code: 'register07', comment: res.__('ts.register.emailverificationrequired')});
                });
            }
        });
    } else {
        res.json({code: 'register06', comment: res.__('ts.register.notallowed')})
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.logout();
    return res.redirect('/')
});

router.get('/verify/:hash', (req: Request, res: Response) => {
    if (req.params.hash == null) {
        return res.render('verified')
    }
    const hash = req.params.hash.replace(/[^a-z0-9+]+/gi, '');
    User.findOne({verifyHash: hash}, (err: any, user: UserDocument) => {
        if (!user) return res.render('verified')
        if (user.verified || user.verifyHash === '') return res.render('verified');
        User.updateOne({email: user.email, username: user.username, verifyHash: user.verifyHash}, {verified: true, verifyHash: ''}, (error) => {
            if (error) return res.render('verified')
            return res.render('verified', { verified: true });
        })
    });
});

export default router;
