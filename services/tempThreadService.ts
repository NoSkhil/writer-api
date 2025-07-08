import db from '../prisma/client';
import { ICreateTempThread, ITempThread } from '../types/threadTypes';

const getThread = async (id: string): Promise<ITempThread> => {
    try {
        const thread = await db.temp_threads.findUnique({ where: { id } });
        if (!thread) throw new Error("Invalid Temp Thread ID.");

        else return thread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createThread = async (threadData: ICreateTempThread): Promise<ITempThread> => {
    try {
        const createdThread = await db.temp_threads.create({ data: threadData });
        return createdThread;
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