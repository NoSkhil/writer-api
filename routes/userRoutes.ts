import {Router} from 'express';
import userController from '../controllers/userController';

const userRoutes = Router();

userRoutes.post('/data', userController.getUser );

export default userRoutes;