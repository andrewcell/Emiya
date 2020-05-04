import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import {getRandomInt} from '@shared/functions';
import indexRouter from './routes/index';
// import BaseRouter from './routes/Routers';
import logger from '@shared/Logger';

// Init express
const app = express();



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'pug');
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
app.use('/', indexRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));


// Export express instance
export default app;
