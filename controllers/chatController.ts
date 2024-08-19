import { Request, Response } from "express";
import { CustomRequest } from '../types/requestTypes';
import chatService from "../services/chatService";

const initialiseChat = async (req: CustomRequest, res: Response) => {
    try {
        if (req.user) {

        }
        else if (req.session.tempUserId) {
            const thread = await chatService.initialiseTempChat(req.session.tempUserId);
            if ("err" in thread) res.status(400).send(thread.err);

            else res.status(200).send(thread.data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
};

const createMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { threadId, content } = req.body;

        if (req.user) {

        }
        else if (req.session.tempUserId) {
            const messages = await chatService.createTempMessage({ threadId, content, userId: req.session.tempUserId });
            if ("err" in messages) res.status(400).send(messages.err);

            else res.status(200).send(messages.data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
};

export default {
    initialiseChat,
    createMessage
};