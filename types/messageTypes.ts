import type { Prisma } from "@prisma/client";
import type { messages as IMessage, temp_messages as ITempMessage } from "@prisma/client";

type ICreateTempMessage = Prisma.temp_messagesUncheckedCreateInput;
type ICreateMessage = Prisma.messagesUncheckedCreateInput;

export {
    IMessage,
    ITempMessage,
    ICreateMessage,
    ICreateTempMessage
}