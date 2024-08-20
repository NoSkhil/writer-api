import type { Prisma } from "@prisma/client";
import type { threads as IThread, temp_threads as ITempThread } from '@prisma/client';

type ICreateThread = Prisma.threadsUncheckedCreateInput;
type ICreateTempThread = Prisma.temp_threadsCreateInput;


export {
    IThread,
    ICreateThread,
    ITempThread,
    ICreateTempThread
}
