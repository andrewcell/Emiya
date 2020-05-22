import {NextFunction, Request, Response, Router} from 'express';
import User, {UserDocument, userSchema} from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
import emailValidator from 'email-validator';
import {internalError} from '@shared/constants';
import {SendGrid} from '@shared/SendGrid';
import {Mail} from '@shared/Mail';
import {getRandomString} from '@shared/functions';
import {decrypt} from '@shared/Encryption';

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

const validateUsername = (username: string): boolean => {
    const regex = /[^a-z\d]/i;
    if (username.length < 4 || username.length > 24) {
        return false;
    }
    if (regex.exec(username)) {
        return false;
    } else {
        return true;
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
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const request = JSON.parse(decrypt(req.body.data));
            const hash = getRandomString(32);
            if (request.password !== request.password2) {
                return res.json({code: 'register03', comment: res.__('ts.register.passwordnotmatch')})
            }
            if (!emailValidator.validate(request.email)) {
                return res.json({code: 'register03', comment: res.__('ts.register.invalidemail')})
            }
            if (!validatePassword(request.password) || !validateUsername(request.username)) {
                return res.json({code: 'register03', comment: res.__('ts.register.invalidpasswordorusername')})
            }
            User.register(new User({
                email: request.email,
                username: request.username,
                verified: false,
                verifyHash: hash,
                myVillagers: [],
                registerIp: ip as string,
                registerUserAgent: req.headers['user-agent'],
                registerDatetime: Date.now()
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
                    const html = Mail.generateVerifyEmail(request.email, hash, res.__('ts.register.clickheretoverifyemail'), (user as UserDocument).username)
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

router.get('/help', (req, res) => {
    res.render('help');
});

router.post('/help/resetpassword', (req, res) => {
    const decrypted = decrypt(req.body.data);
    const email: string = JSON.parse(decrypted).email;
    User.findOne({email})
        .then(async user => {
            if (!user) {
                return res.json({code: 'help00', comment: res.__('ts.accounthelp.help.sentemail')})
            } else {
                if (user.resetPasswordHash !== '') {
                    return res.json({code: 'help01', comment: res.__('ts.accounthelp.help.alreadysent')})
                }
                const hash = getRandomString(24);
                const result = await User.findOneAndUpdate({email}, {resetPasswordHash: hash, resetPasswordTime: Date.now()});
                const html = Mail.generateResetPassword(email, hash, res.__('ts.accounthelp.clickheretoresetpassword'));
                SendGrid.send(email, res.__('ts.accounthelp.clickheretoresetpasswordtitle'), html).then(() => {
                    return res.json({code: 'help00', comment: res.__('ts.accounthelp.help.sentemail')})
                });
            }
        })
        .catch(err => {
            logger.error(err.message, err);
            return res.json({code: 500, comment: internalError})
        })
});

router.get('/help/resetpassword/:hash', (req, res) => {
    if (req.params.hash == null) {
        return res.redirect('/admin/help');
    }
    User.findOne({resetPasswordHash: req.params.hash})
        .then(user => {
            if (!user) {
                return res.status(404).render('error');
            } else {
                if (user.resetPasswordTime >= (user.resetPasswordTime + (10 * 60))) {
                    user.update({resetPasswordHash: ''}).then(() => {
                        return res.status(404).render('error');
                    });
                }
                req.session!.hash = req.params.hash;
                return res.render('resetpassword', {hash: req.params.hash});
            }
        })
        .catch(error => {
           return res.status(500).render('error');
        });
});

router.post('/help/resetpassword/:hash', (req, res) => {
    if (req.params.hash == null) {
        return res.json({code: 500, comment: internalError});
    }
    User.findOne({resetPasswordHash: req.params.hash})
        .then(user => {
            if (!user || (req.session!.hash !== req.params.hash)) {
                return res.json({code: 500, comment: internalError});
            } else {
                const decrypted = decrypt(req.body.data);
                const data = JSON.parse(decrypted);
                const pw1 = data.password1;
                const pw2 = data.password2;
                if (pw1 !== pw2) return res.json({code: 'help02', comment: res.__('modal.register.passwordnotmatched')});
                if (!validatePassword(pw1)) return res.json({code: 'help03', comment: res.__('modal.register.passworderror')});
            }
        })
        .catch(error => {
            return res.json({code: 500, comment: internalError});
        });
});

export default router;
