import db from '../prisma/client';

import {Prisma, type threads as IThread} from '@prisma/client';

type ICreateThread = Prisma.threadsCreateInput;

const getThread = async(id:string) : Promise<IThread | null> => {
    try {
        const thread = await db.threads.findFirst(id);
        if (!thread) return null;

        else return thread;
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

const createThread = async(threadData:ICreateThread) : Promise<IThread | null> => {
    try {
        const createThread = await db.threads.create({data:threadData});
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