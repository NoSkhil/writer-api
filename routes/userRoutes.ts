import {Router} from 'express';
import userController from '../controllers/userController';
import sessionManagement from '../middleware/sessionManagement';
import authenticateUser from '../middleware/authenticateUser';

const userRoutes = Router();

userRoutes.post("/login",[sessionManagement],userController.login);
userRoutes.post("/register",[sessionManagement],userController.register);
userRoutes.get("/auth/validate",[sessionManagement],userController.validateAuth);

export default userRoutes;