import db from '../prisma/client';
import { ITempMessage, ICreateTempMessage } from '../types/messageTypes';


const getTempMessage = async (id: string): Promise<Record<"data", ITempMessage> | Record<"err", string>> => {
    try {
        const message = await db.temp_messages.findUnique({ where: { id } });
        if (!message) return { err: "Invalid Temp Message ID." };

        else return { data: message };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createTempMessage = async (messageData: ICreateTempMessage): Promise<Record<"data", ITempMessage> | Record<"err", string>> => {
    try {
        const thread = await db.temp_threads.findUnique({ where: { id: messageData.temp_thread_id } });
        if (!thread) return { err: "Invalid Temp Thread ID." };

        const createdMessage = await db.temp_messages.create({ data: messageData });
        return { data: createdMessage };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

export default {
    getTempMessage,
    createTempMessage
};