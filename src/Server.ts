import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';
import * as url from 'url';
import * as i18n from 'i18n';

import {getRandomInt} from '@shared/functions';
import BaseRouter from './routes/Routers';
import logger from '@shared/Logger';
import {existsSync, readFileSync, writeFileSync} from 'fs';

// Init express
const app = express();

i18n.configure({
    locales: ['en_US', 'ko_KR'],
    defaultLocale: 'en_US',
    cookie: 'locale',
    directory: 'locales',
    updateFiles: true,
    autoReload: true
});

/************************************************************************************
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
    app.use(helmet());
}
app.use(session({
    secret: getRandomInt().toString(),
    name: getRandomInt().toString(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        maxAge: 3600 * 1000
    }
}))

// Add APIs
app.use('/', BaseRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.referer != null || req.headers.referer === '') {
        const realUrl: string = url.parse(req.headers.referer!).hostname!;
        if (!existsSync('Referer.json')) {
            writeFileSync('Referer.json', '{}');
        }
        const referer = JSON.parse(readFileSync('Referer.json').toString())
        let count = 1;
        if (referer[req.headers.referer!] != null) {
            count = count + referer[req.headers.referer!]
        }
        referer[req.headers.referer!] = count
        writeFileSync('Referer.json', JSON.stringify(referer, null, 4));
        next();
    } else {
        next();
    }
});

app.use((req, res, next) => {
    i18n.init(req, res);
    res.locals.__ = res.__;
    const currentLocale = i18n.getLocale();
    return next();
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.use(function (req, res, next) {  // 404 Not Found handler
    var err = new Error("Not Found");
    res.status(404);
    next(err);
});
// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    res.render('error');
    next(err);
    /*return res.status(BAD_REQUEST).json({
        error: err.message,
    });*/
});

// Export express instance
export default app;
