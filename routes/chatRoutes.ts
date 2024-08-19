import { Router } from "express";
import chatController from "../controllers/chatController";
import sessionManagement from "../middleware/sessionManagement";

const router = Router();

router.get("/initialise",[sessionManagement], chatController.initialiseChat);
router.post("/message",[sessionManagement], chatController.createMessage);

export const chatRoutes = router;