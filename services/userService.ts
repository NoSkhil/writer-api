import db from '../prisma/client';
import type {users as IUser} from '@prisma/client';

const getUser = async(id:string) : Promise<IUser|null> => {
    try {
        const user = await db.users.findFirst(id);
        if (!user) return null;

        else return user;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};



export default {
    getUser
};