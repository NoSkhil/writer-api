import tempThreadService from "./tempThreadService";
import tempMessageService from "./tempMessageService";
import assistantService from "./assistantService";
import { ITempThread, ICreateTempThread } from "../types/threadTypes";
import { ICreateTempMessage, ITempMessage } from "../types/messageTypes";
import { ICreateAssistantMessage } from "../types/openaiTypes";
import { CHAT_ROLE } from "../types/chatRoleTypes";

const initialiseTempChat = async (userId: string): Promise<ITempThread> => {
    try {
        const openaiThreadData = await assistantService.createAssistantThread();

        const tempThreadData: ICreateTempThread = {
            id: openaiThreadData.id,
            temp_user: userId
        }
        const initialiseTempThread = await tempThreadService.createThread(tempThreadData);

        return initialiseTempThread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const createTempMessage = async ({ threadId, userId, content }: {
    threadId: string;
    content: string;
    userId: string;
}): Promise<Record<"data", { message: ITempMessage; assistantResponse: ITempMessage }> | Record<"err", string>> => {
    try {
        let assistantMessageData: ICreateAssistantMessage = {
            content,
            role: CHAT_ROLE.USER
        }
        const assistantMessage = await assistantService.createAssistantMessage({ threadId, messageData: assistantMessageData });

        let tempMessageData: ICreateTempMessage = {
            id: assistantMessage.id,
            role: CHAT_ROLE.USER,
            content: { text: content },
            temp_thread_id: threadId,
            temp_user: userId
        }

        const message = await tempMessageService.createTempMessage(tempMessageData);

        const assistantResponse = await assistantService.runTempAssistant({ threadId, tempUserId: userId });

        return {
            data: {
                message,
                assistantResponse
            }
        };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export default {
    initialiseTempChat,
    createTempMessage
}