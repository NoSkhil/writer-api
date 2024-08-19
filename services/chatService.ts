import { Prisma } from "@prisma/client"
import OpenAI from "openai";
import type { temp_threads as ITempThread, temp_messages as ITempMessage } from "@prisma/client"
import tempThreadService from "./tempThreadService";
import tempMessageService from "./tempMessageService";
import assistantService from "./assistantService";
import ttsService from "./ttsService";

type ITempThreadsCreateInput = Prisma.temp_threadsCreateInput;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type ICreateTempMessage = Prisma.temp_messagesUncheckedCreateInput;

const initialiseTempChat = async (userId: string): Promise<Record<"data", ITempThread> | Record<"err", string>> => {
    try {
        const initialiseAssistantThread = await assistantService.createAssistantThread();
        const openaiThreadData = initialiseAssistantThread.data;

        const tempThreadData: ITempThreadsCreateInput = {
            id: openaiThreadData.id,
            temp_user: userId
        }
        const initialiseTempThread = await tempThreadService.createThread(tempThreadData);

        return { data: initialiseTempThread.data };
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
        let messageData: ICreateAssistantMessage = {
            content,
            role: "user"
        }
        const assistantMessage = await assistantService.createAssistantMessage({ threadId, messageData });

        let tempMessageData: ICreateTempMessage = {
            id: assistantMessage.data.id,
            role: "user",
            content: { text: content },
            temp_thread_id: threadId,
            temp_user: userId
        }

        const tempMessage = await tempMessageService.createTempMessage(tempMessageData);
        if ("err" in tempMessage) return { err: tempMessage.err };

        const runAssistant = await assistantService.runTempAssistant({ threadId, tempUserId: userId });
        if ("err" in runAssistant) return { err: runAssistant.err };

        if (runAssistant.data.content && typeof runAssistant.data.content === "object" && "script" in runAssistant.data.content && typeof runAssistant.data.content.script === "string" && typeof runAssistant.data.content.voice === "string") {
            const script = runAssistant.data.content.script;
            const voice = runAssistant.data.content.voice;
            const tts = await ttsService.synthesizeSpeech({text:script,voice});
            if ("err" in tts) console.log(tts.err);
            if ("data" in tts) console.log(tts.data);
        }

        return {
            data: {
                message: tempMessage.data,
                assistantResponse: runAssistant.data
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