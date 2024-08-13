import db from '../prisma/client';
import type {user as IUser} from '@prisma/client';

const getUser = async(id:string) : Promise<IUser|null> => {
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