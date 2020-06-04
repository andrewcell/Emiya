import {NextFunction, Request, Response} from 'express';
import {UserDocument} from '@shared/User';

export const validateAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user == null) {
        res.redirect('/')
    } else {
        const user = req.user as UserDocument
        if (!user.admin) {
            res.redirect('/')
        } else {
            next()
        }
    }
}

export const validateNotLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        res.redirect('/');
    } else {
        next();
    }
}

export const validateLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        next();
    } else {
        res.status(401).json('{error: 1}');
    }
}

export const validateReact = (req: Request, res: Response, next: NextFunction): void => {
    // if (req.xhr || req!.headers!.accept!.indexOf('json') > -1) {
        next();
   // } else {
    //    res.status(400).json('{error: 1}');
    // }
}
