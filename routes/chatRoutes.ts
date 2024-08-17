import { Router } from "express";
import chatController from "../controllers/chatController";

const router = Router();

router.get("/initialise", chatController.initialiseChat);