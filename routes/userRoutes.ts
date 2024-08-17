import {Router} from 'express';
import userController from '../controllers/userController';

const userRoutes = Router();

userRoutes.post("/data",userController.getUserByEmail);
userRoutes.post("/login",userController.login);
userRoutes.post("/register",userController.register);

export default userRoutes;