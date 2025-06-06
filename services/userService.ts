import db from '../prisma/client';
import * as argon2 from "argon2";
import { ICreateUser, IUser } from '../types/userTypes';

const getUserById = async (id: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findUnique({where:{id},omit:{password:true}});
        if (!user) return { err: "Invalid User ID" };

        else return { data: user };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const getUserByEmail = async (email: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findUnique({where:{email}});
        if (!user) return { err: "Invalid User ID" };

        else return { data: user };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const login = async ({email, password}:{
    email:string; 
    password:string;
}): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findUnique({where:{email}});
        if (!user) return { err: "Invalid Credentials" };

        const verify = await argon2.verify(user.password, password);
        if (!verify) return { err: "Invalid credentials" };

        const {password:removePassword, ...safeUserObject}:{password:string;} = user;
        
        return { data: safeUserObject as IUser };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const register = async (user: ICreateUser): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const existingEmail = await db.users.findUnique({where:{email: user.email}});
        const existingPhoneNumber = user.phone_number && await db.users.findUnique({where:{phone_number: user.phone_number}});
        if (existingEmail || existingPhoneNumber) return { err: "User already exists" };

        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
        const savedUser = await db.users.create({ data: user });

        return { data: savedUser };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

export default {
    getUserById,
    getUserByEmail,
    login,
    register
};