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
            res.status(200).send(thread);
        }

        else if (req.session.tempUserId) {
            const thread = await tempChatService.initialiseTempChat(req.session.tempUserId);
            res.status(200).send(thread);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const createMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { threadId, content }: { threadId: string; content: string; } = req.body;

        if (req.user) {
            const messages = await chatService.createMessage({ threadId, content, user: req.user });
            if ("err" in messages) res.status(400).send(messages.err);

            else res.status(200).send(messages);
        }

        else if (req.session.tempUserId) {
            const messages = await tempChatService.createTempMessage({ threadId, content, userId: req.session.tempUserId });
            if ("err" in messages) res.status(400).send(messages.err);

            else res.status(200).send(messages);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
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

        // Stream the file to the client
        const fileStream = fs.createReadStream(audioPath);
        fileStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

export default {
    initialiseChat,
    createMessage,
    sendAudioFile
};