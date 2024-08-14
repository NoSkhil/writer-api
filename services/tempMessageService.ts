import db from '../prisma/client';
import {temp_messages as ITempMessage} from '@prisma/client';

const getMessage = async(id:string) : Promise<ITempMessage|Error> => {
    try {
        const message = await db.temp_messages.findFirst(id);
        if (message) return message;
        
        else throw new Error(`Failed to get message for id - ${id}`);
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

const createMessage = async(messageData:ITempMessage) : Promise<Object|Error> => {
    try {
        const createMessage = await db.temp_threads.create({data:messageData});
        if (createMessage) return createMessage;

        else throw new Error("Failed to create message!");
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