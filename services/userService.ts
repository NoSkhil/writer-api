import db from '../prisma/client';
import * as argon2 from "argon2";
import { type users as IUser, Prisma } from '@prisma/client';
import { hash } from 'crypto';

type ICreateUser = Prisma.usersCreateInput;

const getUserByEmail = async (email: string): Promise<Record<"data", IUser> | Record<"err", string>> => {
    try {
        const user = await db.users.findFirst(email);
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
        const user = await db.users.findFirst(email);
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
        const existingUser = await db.users.findFirst(user.email);
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
    getUserByEmail,
    login,
    register
};