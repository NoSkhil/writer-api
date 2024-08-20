import type { Prisma } from "@prisma/client";
import type { users as IUser } from "@prisma/client";

type IUserLoginRequest = {
    email:string,
    password:string
}

type ICreateUser = Prisma.usersCreateInput;

export {
    IUser,
    IUserLoginRequest,
    ICreateUser
};