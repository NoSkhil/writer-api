import db from '../prisma/client';
import type {thread as IThread} from '@prisma/client';

const getThread = async(id:string) : Promise<IThread|null> => {
    try {
        const thread = await db.thread.findFirst(id);
        if (thread) return thread;
        else return null;
    }
    catch(err) {
        console.log(err);
        return null;
    }
};

export default {
    getThread
};