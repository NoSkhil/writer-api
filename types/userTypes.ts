import type { Prisma } from "@prisma/client";
import type { users as IUserType } from "@prisma/client";

type IUser = Omit<IUserType, 'password'>;

type IUserLoginRequest = {
    email:string,
    password:string
}

type ICreateUser = Prisma.usersCreateInput;

enum USER_OPTIONS {
    INSTANT_AUDIO_GENERATION = "instantAudioGeneration"
}

export {
    IUser,
    IUserLoginRequest,
    ICreateUser,
    USER_OPTIONS
};