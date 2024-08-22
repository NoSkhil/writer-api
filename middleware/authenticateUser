import { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { CustomRequest } from '../types/requestTypes';

const authenticateUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.session.userId) {
            const user = await userService.getUserById(req.session.userId);
            if ('data' in user) {
                req.user = user.data;
                req.session.userId = user.data.id;
                next();
            } else {
                req.session.userId = undefined;
                res.status(401).send({ err: "Unauthorized request!" })
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export default authenticateUser;
