import {NextFunction, Request, Response, Router} from 'express';
import User, {UserDocument} from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
import emailValidator from 'email-validator';
import {internalError} from '@shared/constants';
import {SendGrid} from '@shared/SendGrid';
import {Mail} from '@shared/Mail';
import {getRandomString} from '@shared/functions';
import {decrypt} from "@shared/Encryption";
const router = Router();

const validatePassword = (password: string): boolean => {
    const regex = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    if (password.length < 6) {
        return false;
    }

    if (regex.exec(password)) {
        return true;
    } else {
        return false;
    }
}

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
        try {
            const request = JSON.parse(decrypt(req.body.data));
            const hash = getRandomString(32);
            if (request.password !== request.password2) {
                return res.json({code: 'register03', comment: res.__('ts.register.passwordnotmatch')})
            }
            if (!emailValidator.validate(request.email)) {
                return res.json({code: 'register03', comment: res.__('ts.register.invalidemail')})
            }
            if (!validatePassword(request.password)) {
                return res.json({code: 'register03', comment: res.__('ts.register.invalidpassword')})
            }
            User.register(new User({
                email: request.email,
                username: request.username,
                verified: false,
                verifyHash: hash
            }), request.password, (err, user) => {
                if (err) {
                    switch (err.name) {
                        case 'UserExistsError':
                            return res.json({code: 'register03', comment: res.__('ts.register.usernameoccupied')})
                        case 'MongoError':
                            return res.json({
                                code: 'register03',
                                comment: res.__('ts.register.usernameoremailoccupied')
                            })
                        default:
                            return res.json({code: '500', comment: internalError})
                    }
                } else {
                    const html = Mail.generateVerifyEmail(request.email, hash, res.__('ts.register.clickheretoverifyemail'))
                    SendGrid.send(request.email, res.__('ts.register.clickheretoverifyemailtitle'), html).then(() => {
                        return res.json({code: 'register07', comment: res.__('ts.register.emailverificationrequired')});
                    });
                }
            });
        } catch (e) {
            return res.json({code: 500, comment: 'Internal Server Error.'});
        }
    } else {
        res.json({code: 'register06', comment: res.__('ts.register.notallowed')})
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.session!.destroy(()=>{
        res.redirect('/')
    })
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
