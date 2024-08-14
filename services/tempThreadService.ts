import db from '../prisma/client';
import {type temp_threads as ITempThread, Prisma} from '@prisma/client';

type ICreateTempThread = Prisma.temp_threadsCreateInput;

const getThread = async(id:string) : Promise<ITempThread|Error> => {
    try {
        const thread = await db.temp_threads.findFirst(id);
        if (thread) return thread;
        else throw new Error(`Failed to fetch thread id - ${id}`);
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

const createThread = async(threadData:ICreateTempThread) : Promise<ITempThread|Error> => {
    try {
        const createThread = await db.temp_threads.create({data:threadData});
        if (createThread) return createThread;

        else throw new Error(`Failed to create thread with data - ${threadData}`);
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

export default {
    getThread,
    createThread
};