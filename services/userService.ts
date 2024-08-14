import db from '../prisma/client';
import type {users as IUser} from '@prisma/client';

const getUser = async(id:string) : Promise<IUser|null> => {
    try {
        const user = await db.users.findFirst(id);
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