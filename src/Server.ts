import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import 'express-async-errors';
import * as url from 'url';
import i18n from 'i18n';
import passport from 'passport';
import BaseRouter from './routes/Routers';
import logger from '@shared/Logger';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import User from '@shared/User';
import mongoose from 'mongoose';
import MyVillagersDatabase from '@interfaces/MyVillagersDatabase';
import cron from 'node-cron';
import Github from '@shared/Github';

// Init express
const app = express();
Github.refresh();

i18n.configure({
    locales: ['en_US', 'ko_KR', 'ja_JP'],
    // defaultLocale: 'en_US',
    fallbacks: {
        'en': 'en_US',
        'ko': 'ko_KR',
        'ja': 'ja_JP'
    },
    cookie: 'locale',
    directory: 'locales',
    updateFiles: true,
    autoReload: true
});

/* ***********************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'pug');
app.disable('x-powered-by');
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    const self = '\'self\'';
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [self, 'emiyaj.vxz.me'],
                scriptSrc: [self, 'data:', 'code.jquery.com', 'stackpath.bootstrapcdn.com'],
                styleSrc: [self, 'fonts.googleapis.com', '*.fontawesome.com', 'data:', '\'unsafe-inline\'', 'cdn.jsdelivr.net', 'stackpath.bootstrapcdn.com', ],
                fontSrc: [self, 'fonts.gstatic.com', 'data:', 'cdn.jsdelivr.net', 'stackpath.bootstrapcdn.com'],
                imgSrc: [self, 'acnhcdn.com', '\'unsafe-inline\'',  'www.googletagmanager.com']
            }
        }
    }));
}
app.use(session({
    secret: '***REMOVED***',
    name: '***REMOVED***',
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        maxAge: 3600 * 1000
    }

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// @ts-ignore
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});
app.use(i18n.init);
mongoose.connect(process.env.MONGODB as string, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        logger.info('MongoDB Success. Version: ' + mongoose.version);
    })
    .catch(err => {
        logger.error(err.message, err);
        process.exit(1);
    });

interface reportBody {
    ip: string;
    useragent: string;
    path: string;
    method: string;
    datetime: number;
    body: any;
}

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.url !== '/admin/login') {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const filename = 'post.json';
        const ac: reportBody = {
            ip: ip!.toString(),
            useragent: req.headers['user-agent']!,
            path: req.url,
            method: req.method,
            datetime: Date.now(),
            body: req.body
        }
        if (!existsSync(filename)) {
            writeFileSync(filename, '{"data": []}');
        }
        const postBody: reportBody[] = JSON.parse(readFileSync(filename, 'utf8')).data
        postBody.push(ac)
        writeFileSync(filename, JSON.stringify({data: postBody}, null, 4))
        next();
    } else {
        next();
    }
});

// Add APIs
app.use('/', BaseRouter);

/* Logging visistor's referer. Make disabled for privacy-friendly.
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.referer != null || req.headers.referer === '') {
        const realUrl: string = url.parse(req.headers.referer).hostname!;
        if (!existsSync('Referer.json')) {
            writeFileSync('Referer.json', '{}');
        }
        type refererFile = {
            [url: string]: number
        }
        const referer: unknown = JSON.parse(readFileSync('Referer.json').toString())
        let count = 1;
        if (referer[req.headers.referer] != null) {
            count = count + referer[req.headers.referer]
        }
        referer[req.headers.referer] = count
        writeFileSync('Referer.json', JSON.stringify(referer, null, 4));
        next();
    } else {
        next();
    }
});*/

/*
app.use((req, res, next) => {
    i18n.init(req, res);
   // res.locals.__ = res.__;
    const currentLocale = i18n.getLocale();
    return next();
});*/

/** **********************************************************************************.
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.use((req, res, next) => {  // 404 Not Found handler
    const err = new Error('Not Found');
    res.status(404);
    next(err);
});
// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    res.render('error');
    next(err);
    /* return res.status(BAD_REQUEST).json({
        error: err.message,
    }); */
});
cron.schedule('0 0 * * *', () => {
    Github.refresh();
});
process.on('exit', () => {
    MyVillagersDatabase.getInstance().close();
    void mongoose.disconnect().then();// r => logger.info('Mongoose disconnected. ' + r));
});
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
// Export express instance
export default app;
