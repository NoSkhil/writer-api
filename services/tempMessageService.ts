import db from '../prisma/client';
import { Prisma } from '@prisma/client';
import { temp_messages as ITempMessage } from '@prisma/client';

type ICreateTempMessage = Prisma.temp_messagesUncheckedCreateInput;

const getMessage = async(id: string): Promise<ITempMessage | Error> => {
    try {
        const message = await db.temp_messages.findUnique({ where: { id } });
        if (!message) throw new Error(`Failed to get message!`);
        
        return message;
    }
    catch(err) {
        console.log(err);
        return err as Error;
    }
};

const createMessage = async(messageData: ICreateTempMessage): Promise<ITempMessage | Error> => {
    try {
        const thread = await db.temp_threads.findUnique({ where: { id: messageData.temp_thread_id } });
        if (!thread) throw new Error("Thread does not exist");
        
        const createdMessage = await db.temp_messages.create({ data: messageData });
        return createdMessage;
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

export default {
    getMessage,
    createMessage
};