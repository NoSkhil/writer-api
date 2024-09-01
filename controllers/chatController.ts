import { Response } from "express";
import { CustomRequest } from '../types/requestTypes';
import tempChatService from "../services/tempChatService";
import chatService from "../services/chatService";
import path from "path";
import fs from "fs";

const initialiseChat = async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.userId) {
            const thread = await chatService.initialiseChat(req.session.userId);
            if ("err" in thread) res.status(400).send(thread.err);

            else res.status(200).send(thread.data);
        }
        
        else if (req.session.tempUserId) {
            const thread = await tempChatService.initialiseTempChat(req.session.tempUserId);
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
        const { threadId, content } : {threadId:string;content:string;} = req.body;

        if (req.user) {
            const messages = await chatService.createMessage({ threadId, content, user: req.user });
            if ("err" in messages) res.status(400).send(messages.err);

            else res.status(200).send(messages.data);
        }

        else if (req.session.tempUserId) {
            const messages = await tempChatService.createTempMessage({ threadId, content, userId: req.session.tempUserId });
            if ("err" in messages) res.status(400).send(messages.err);

            else res.status(200).send(messages.data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
};

const sendAudioFile = async (req: CustomRequest, res: Response) => {
    try {
        const { filename } = req.params;
        const audioPath = path.join(__dirname, '..', 'audio', filename);

        // Check if the file exists
        if (!fs.existsSync(audioPath)) {
            return res.status(404).send({ error: "Audio file not found" });
        }

        // Set the appropriate headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(audioPath);
        fileStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: "Internal server error!" });
    }
};

export default {
    initialiseChat,
    createMessage,
    sendAudioFile
};