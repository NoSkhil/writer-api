import db from '../prisma/client';
import { ITempMessage, ICreateTempMessage } from '../types/messageTypes';


const getTempMessage = async (id: string): Promise<ITempMessage> => {
    try {
        const message = await db.temp_messages.findUnique({ where: { id } });
        if (!message) throw new Error("Invalid Temp Message ID.");

        else return message;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createTempMessage = async (messageData: ICreateTempMessage): Promise<ITempMessage> => {
    try {
        const thread = await db.temp_threads.findUnique({ where: { id: messageData.temp_thread_id } });
        if (!thread) throw new Error("Invalid Temp Thread ID.");

        const createdMessage = await db.temp_messages.create({ data: messageData });
        return createdMessage;
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