import db from '../prisma/client';
import { type temp_threads as ITempThread, Prisma } from '@prisma/client';

type ICreateTempThread = Prisma.temp_threadsCreateInput;

const getThread = async (id: string): Promise<Record<"data", ITempThread> | Record<"err", string>> => {
    try {
        const thread = await db.temp_threads.findFirst(id);
        if (!thread) return { err: "Invalid Temp Thread ID." };

        else return { data: thread };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createThread = async (threadData: ICreateTempThread): Promise<Record<"data", ITempThread>> => {
    try {
        const createThread = await db.temp_threads.create({ data: threadData });
        return { data: createThread };
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