import db from '../prisma/client';
import { IMessage, ICreateMessage } from '../types/messageTypes';

const getMessage = async (id: string): Promise<Record<"data", IMessage> | Record<"err", string>> => {
    try {
        const message = await db.messages.findUnique({ where: { id } });
        if (!message) return { err: "Invalid Message ID." };

        else return { data: message };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createMessage = async (messageData: ICreateMessage): Promise<Record<"data", IMessage> | Record<"err", string>> => {
    try {
        const thread = await db.threads.findUnique({ where: { id: messageData.thread_id } });
        if (!thread) return { err: "Invalid Thread ID." };

        const createdMessage = await db.messages.create({ data: messageData });
        return { data: createdMessage };
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