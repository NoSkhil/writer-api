import db from '../prisma/client';
import {temp_threads as ITempThread} from '@prisma/client';

const getThread = async(id:string) : Promise<ITempThread|null> => {
    try {
        const thread = await db.temp_threads.findFirst(id);
        if (thread) return thread;
        else return null;
    }
    catch(err) {
        console.log(err);
        return null;
    }
};

const createThread = async(threadData:ITempThread) : Promise<ITempThread|null> => {
    try {
        const createThread = await db.temp_threads.create({data:threadData});
        if (createThread) return createThread;
        else return null;
    }
    catch(err) {
        console.log(err);
        return null;
    }
};

export default {
    getThread,
    createThread
};