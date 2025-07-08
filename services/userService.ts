import db from '../prisma/client';
import * as argon2 from "argon2";
import { ICreateUser, IUser } from '../types/userTypes';

const getUserById = async (id: string): Promise<IUser> => {
    try {
        const user = await db.users.findUnique({ where: { id }, omit: { password: true } });
        if (!user) throw new Error("Invalid User ID");

        else return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const getUserByEmail = async (email: string): Promise<IUser> => {
    try {
        const user = await db.users.findUnique({ where: { email } });
        if (!user) throw new Error("Invalid User Email");

        else return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const login = async ({ email, password }: {
    email: string;
    password: string;
}): Promise<IUser> => {
    try {
        const user = await db.users.findUnique({ where: { email } });
        if (!user) throw new Error("Invalid Credentials");

        const verify = await argon2.verify(user.password, password);
        if (!verify) throw new Error("Invalid credentials");

        const { password: removePassword, ...safeUserObject }: { password: string; } = user;

        return safeUserObject as IUser;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const register = async (user: ICreateUser): Promise<IUser> => {
    try {
        const existingEmail = await db.users.findUnique({ where: { email: user.email } });
        const existingPhoneNumber = user.phone_number && await db.users.findUnique({ where: { phone_number: user.phone_number } });
        if (existingEmail || existingPhoneNumber) throw new Error("User already exists");

        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
        const savedUser = await db.users.create({ data: user });

        return savedUser;
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