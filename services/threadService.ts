import db from '../prisma/client';
import { IThread, ICreateThread } from '../types/threadTypes';


const getThread = async (id: string): Promise<IThread> => {
    try {
        const thread = await db.threads.findUnique({ where: { id } });
        if (!thread) throw new Error("Invalid Thread ID.");

        else return thread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createThread = async (threadData: ICreateThread): Promise<IThread> => {
    try {
        const createThread = await db.threads.create({ data: threadData });
        return createThread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

export default {
    getThread,
    createThread
};