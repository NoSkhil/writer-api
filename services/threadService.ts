import db from '../prisma/client';

import {Prisma, type threads as IThread} from '@prisma/client';

type ICreateThread = Prisma.threadsCreateInput;

const getThread = async(id:string) : Promise<IThread|Error> => {
    try {
        const thread = await db.threads.findFirst(id);
        if (thread) return thread;
        else throw new Error(`Failed to fetch thread id - ${id}`);
    }
    catch(err) {
        console.log(err);
        return err;
    }
};

const createThread = async(threadData:ICreateThread) : Promise<IThread|Error> => {
    try {
        const createThread = await db.threads.create({data:threadData});
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