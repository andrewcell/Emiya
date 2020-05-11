import {NextFunction, Request, Response} from 'express';
import {UserDocument} from '@shared/User';

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
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
