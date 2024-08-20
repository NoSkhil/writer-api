import db from '../prisma/client';

import { Prisma, type threads as IThread } from '@prisma/client';

type ICreateThread = Prisma.threadsCreateInput;

const getThread = async (id: string): Promise<Record<"data", IThread> | Record<"err", string>> => {
    try {
        const thread = await db.threads.findUnique({where:{id}});
        if (!thread) return { err: "Invalid Thread ID." };

        else return { data: thread };
    }
    catch (err) {
        console.log(err);
        return err;
    }
};

const createThread = async (threadData: ICreateThread): Promise<Record<"data", IThread>> => {
    try {
        const createThread = await db.threads.create({ data: threadData });
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