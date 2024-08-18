import db from '../prisma/client';
import * as argon2 from "argon2";
import { type users as IUser, Prisma } from '@prisma/client';
import { hash } from 'crypto';

type ICreateUser = Prisma.usersCreateInput;

const getUserById = async (id: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findFirst({where:{id}});
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
        const user = await db.users.findFirst({where:{email}});
        if (!user) return { err: "Invalid User ID" };

        else return { data: user };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const login = async (email: string, password: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findFirst({where:{email}});
        if (!user) return { err: "Invalid Credentials" };

        const verify = await argon2.verify(user.password, password);
        if (!verify) return { err: "Invalid credentials" };

        else return { data: user };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const register = async (user: ICreateUser): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const existingUser = await db.users.findFirst({where:{email: user.email}});
        if (existingUser) return { err: "User already exists" };

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