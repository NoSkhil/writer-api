import db from '../prisma/client';
import type { users as IUser } from '@prisma/client';

const getUser = async (id: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findFirst(id);
        if (!user) return { err: "Invalid User ID" };

        else return { data: user };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};



export default {
    getUser
};