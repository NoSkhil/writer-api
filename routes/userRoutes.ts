import {Router} from 'express';
import userController from '../controllers/userController';

const userRoutes = Router();

export default userRoutes;

userRoutes.get('/read', userController.getAllUserData );