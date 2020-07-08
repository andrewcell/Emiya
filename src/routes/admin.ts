import {NextFunction, Request, Response, Router} from 'express';
import User, {UserDocument, userSchema} from '@shared/User';
import passport from 'passport';
import logger from '@shared/Logger';
import emailValidator from 'email-validator';
import {internalError} from '@shared/constants';
import {SendGrid} from '@shared/SendGrid';
import {Mail} from '@shared/Mail';
import {getRandomString} from '@shared/functions';
import {decrypt, encrypt, encryptJava} from '@shared/Encryption';
import crypto from 'crypto';
import { validateLoggedIn } from '@shared/validation';
import Axios from 'axios';
import { emiyaJ } from '@shared/ApiUrl';

const router = Router();

const validatePassword = (password: string): boolean => {
    const regex = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    if (password.length < 6) {
        return false;
    }

    return !!regex.exec(password);
}

const validateUsername = (username: string): boolean => {
    const regex = /[^a-z\d]/i;
    if (username.length < 4 || username.length > 24) {
        return false;
    }
    return !regex.exec(username);
}

const generateSalt = (len = 32): string => {
    if (len == null) {
        len = 32;
    }
    return crypto.randomBytes(len).toString('hex');
}

const generateHash = (password: string, salt: string): string => {
    return crypto.pbkdf2Sync(password, salt, 25000, 512, 'sha256').toString('hex');
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
            const userAsDocument = user as UserDocument;
            Axios.post(emiyaJ + '/admin/login', {data: encryptJava(JSON.stringify({username: userAsDocument.username, password: userAsDocument.hash, ipAddress: req.headers['x-forwarded-for']}))})
                .then(tokenRes => {
                    const token = JSON.parse(tokenRes.data.data).token
                    res.cookie('locale', userAsDocument.language);
                    res.cookie('token', token);
                    res.json({code: 'login00', comment: token});
                    return user
                })
                .catch(() => {
                    res.cookie('locale', userAsDocument.language);
                    res.json({code: 'login00', comment: 'success'});
                    return user
                })
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
        res.clearCookie('token');
        res.redirect('/');
    })
});

router.get('/verify/:hash', (req: Request, res: Response) => {
    const title = res.__('global.title.subtitle', res.__('verifyemail.title'))
    if (req.params.hash == null) {
        return res.render('verified')
    }
    const hash = req.params.hash.replace(/[^a-z0-9+]+/gi, '');
    User.findOne({verifyHash: hash}, (err: any, user: UserDocument) => {
        if (!user) return res.render('verified', {title})
        if (user.verified || user.verifyHash === '') return res.render('verified', {title});
        User.updateOne({email: user.email, username: user.username, verifyHash: user.verifyHash}, {verified: true, verifyHash: ''}, (error) => {
            if (error) return res.render('verified', {title})
            return res.render('verified', { verified: true, title});
        })
    });
});

router.get('/help', (req, res) => {
    const title = res.__('global.title.subtitle', res.__('accounthelp.htmltitle'))
    res.render('help', {title});
});

router.post('/help/resetpassword', (req, res) => {
    const decrypted = decrypt(req.body.data);
    const email: string = JSON.parse(decrypted).email;
    User.findOne({email})
        .then(async (user: UserDocument | null) => {
            if (!user) {
                return res.json({code: 'help00', comment: res.__('ts.accounthelp.help.sentemail')})
            } else {
                if (user.resetPasswordHash != null && user.resetPasswordHash !== '') {
                    return res.json({code: 'help01', comment: res.__('ts.accounthelp.help.alreadysent')})
                }
                const hash = getRandomString(24);
                await User.findOneAndUpdate({email}, {resetPasswordHash: hash, resetPasswordTime: Date.now()});
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
    const title = res.__('global.title.subtitle', res.__('accounthelp.resetpassword.title'))
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
                return res.render('resetpassword', {hash: req.params.hash, title});
            }
        })
        .catch(() => {
           return res.status(500).render('error');
        });
});

router.post('/help/resetpassword/:hash', (req, res) => {
    if (req.params.hash == null) {
        return res.json({code: 500, comment: internalError});
    }
    const decrypted = decrypt(req.body.data);
    const data = JSON.parse(decrypted);
    const pw1 = data.password1;
    const pw2 = data.password2;
    if (pw1 !== pw2) return res.json({code: 'help02', comment: res.__('modal.register.passwordnotmatched')});
    if (!validatePassword(pw1)) return res.json({code: 'help03', comment: res.__('modal.register.passworderror')});
    User.findOne({resetPasswordHash: req.params.hash})
        .then(async user => {
            if (!user/* || (req.session!.hash !== req.params.hash) */) {
                return res.json({code: 500, comment: internalError});
            } else {
                const salt = generateSalt();
                const hash = generateHash(pw1, salt);
                const updateResult = await user.update({
                    resetPasswordHash: '',
                    resetPasswordTime: 0,
                    hash,
                    salt
                });
                if (updateResult.ok != null && updateResult.ok === 1) {
                    return res.json({code: 'help00', comment: res.__('ts.accounthelp.passwordchanged')})
                } else {
                    return res.json({code: 500, comment: internalError});
                }
            }
        })
        .catch(() => {
            return res.json({code: 500, comment: internalError});
        });
});

router.post('/config', validateLoggedIn, (req, res) => {
    try {
        const decrypted = JSON.parse(decrypt(req.body.data));
        const language = decrypted.language;
        User.findByIdAndUpdate({_id: (req.user as UserDocument)._id}, {language}).then(() => {
            return res.json({code: 'user00', comment: res.__('ts.user.saved')})
        });
    } catch (e) {
        return res.status(500).json({'code': 500, comment: internalError});
    }
});

router.get('/loginstatus', validateLoggedIn, (req, res) => {
    const user = req.user as UserDocument;
    const encrypted = encrypt(JSON.stringify({username: user.username, email: user.email}));
    return res.json({data: encrypted});
});

export default router;
