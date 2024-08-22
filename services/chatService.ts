import threadService from "./threadService";
import messageService from "./messageService";
import assistantService from "./assistantService";
import ttsService from "./ttsService";
import { ICreateAssistantMessage } from "../types/openaiTypes";
import { ICreateThread, IThread } from "../types/threadTypes";
import { ICreateMessage, IMessage } from "../types/messageTypes";
import { IUser, USER_OPTIONS } from "../types/userTypes";
import { CHAT_ROLE } from "../types/chatRoleTypes";


const initialiseChat = async (userId: string): Promise<Record<"data", IThread> | Record<"err", string>> => {
    try {
        const initialiseAssistantThread = await assistantService.createAssistantThread();
        const openaiThreadData = initialiseAssistantThread.data;

        const threadData: ICreateThread = {
            id: openaiThreadData.id,
            user_id: userId
        }
        const initialiseThread = await threadService.createThread(threadData);

        return { data: initialiseThread.data };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const createMessage = async ({ threadId, user, content }: {
    threadId: string;
    content: string;
    user: IUser;
}): Promise<Record<"data", { message: IMessage; assistantResponse: IMessage, audioAdFile: string | null }> | Record<"err", string>> => {
    try {
        let assistantMessageData: ICreateAssistantMessage = {
            content,
            role: CHAT_ROLE.USER
        }
        const assistantMessage = await assistantService.createAssistantMessage({ threadId, messageData: assistantMessageData });

        let messageData: ICreateMessage = {
            id: assistantMessage.data.id,
            role: CHAT_ROLE.USER,
            content: { text: content },
            thread_id: threadId,
            user_id: user.id
        }

        const message = await messageService.createMessage(messageData);
        if ("err" in message) return { err: message.err };

        const runAssistant = await assistantService.runAssistant({ threadId, userId: user.id });
        if ("err" in runAssistant) return { err: runAssistant.err };

        let audioAdFile: string | null = null;
        const audioGeneration = await generateInstantAudioAd(user, runAssistant.data);
        if ("data" in audioGeneration) audioAdFile = audioGeneration.data;

        return {
            data: {
                message: message.data,
                assistantResponse: runAssistant.data,
                audioAdFile
            }
        };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const generateInstantAudioAd = async (user: IUser, assistantResponse: IMessage): Promise<{ data: string } | { err: string }> => {
    try {
        //Find a cleaner way to access these params safely
        const instantAudioGeneration = USER_OPTIONS.INSTANT_AUDIO_GENERATION ;
        //Check if User has the "Instant Audio Generation" option enabled
        if (user.user_options &&
            typeof user.user_options === "object" &&
            instantAudioGeneration in user.user_options &&
            user.user_options.instantAudioGeneration === true &&

            //Check if the message contains a valid script and voice selection.
            assistantResponse.content &&
            typeof assistantResponse.content === "object" &&
            "script" in assistantResponse.content &&
            "voice" in assistantResponse.content &&

            typeof assistantResponse.content.script === "string" &&
            typeof assistantResponse.content.voice === "string"
        ) {
            const script = assistantResponse.content.script;
            const voice = assistantResponse.content.voice;
            const tts = await ttsService.synthesizeSpeech({ text: script, voice });
            if ("err" in tts) return { err: "Failed to synthesize speech!" };
            if ("data" in tts) {

                //store mp3 in s3 and return signed s3 link.
                return { data: tts.data };
            }
        }
        return { err: "Instant Audio generation not applicable" };
    } catch (err) {
        console.log(err);
        //Don't throw err here, this service is not critical to returning the chat response.
        return { err: "Internal server error - Instant Audio generation failed!" };
    }
}

export default {
    initialiseChat,
    createMessage
}