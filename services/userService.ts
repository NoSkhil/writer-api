import type { user } from '@prisma/client';
import db from '../prisma/client';

const getUser = async(id:string) : Promise<user|null> => {
    try {
        const user = await db.user.findFirst(id);
        if (user) return user;
        else return null;
    }
    catch(err) {
        console.log(err);
        return null;
    }
};

export default {
    getUser
};