import {Router} from 'express';
import userController from '../controllers/userController';
import sessionManagement from '../middleware/sessionManagement';

const userRoutes = Router();

userRoutes.post("/login",[sessionManagement],userController.login);
userRoutes.post("/register",[sessionManagement],userController.register);
userRoutes.post("/auth/validate",[sessionManagement],userController.validateAuth);

export default userRoutes;