import db from '../prisma/client';
import { IMessage, ICreateMessage } from '../types/messageTypes';

const getMessage = async (id: string): Promise<IMessage> => {
    try {
        const message = await db.messages.findUnique({ where: { id } });
        if (!message) throw new Error("Invalid Message ID.");

        else return message;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createMessage = async (messageData: ICreateMessage): Promise<IMessage> => {
    try {
        const thread = await db.threads.findUnique({ where: { id: messageData.thread_id } });
        if (!thread) throw new Error("Invalid Thread ID.");

        return await db.messages.create({ data: messageData });;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

export default {
    getMessage,
    createMessage
};