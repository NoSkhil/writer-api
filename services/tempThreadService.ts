import db from '../prisma/client';
import {type temp_threads as ITempThread, Prisma} from '@prisma/client';

type ICreateTempThread = Prisma.temp_threadsCreateInput;

const getThread = async(id:string) : Promise<ITempThread | null> => {
    try {
        const thread = await db.temp_threads.findFirst(id);
        if (!thread) return null;

        else return thread;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

const createThread = async(threadData:ICreateTempThread) : Promise<ITempThread | null> => {
    try {
        const createThread = await db.temp_threads.create({data:threadData});
        if (!createThread) return null;

        else return createThread;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

export default {
    getThread,
    createThread
};