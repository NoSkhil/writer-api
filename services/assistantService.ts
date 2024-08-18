import { Prisma, type temp_messages as ITempMessage, type messages as IMessage } from "@prisma/client";
import OpenAI from "openai";
import tempMessageService from "./tempMessageService";
import messageService from "./messageService";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string
});

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type IAssistantMessage = OpenAI.Beta.Threads.Message;
type ICreateMessage = Prisma.messagesUncheckedCreateInput;
type ICreateTempMessage = Prisma.temp_messagesUncheckedCreateInput;

const getAssistantThread = async (id: string): Promise<Record<"data", IAssistantThread> | Record<"err", string>> => {
    try {
        const thread = await openai.beta.threads.retrieve(id);
        if (!thread) return { err: "Invalid Assistant Thread ID." };

        return { data: thread };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createAssistantThread = async (): Promise<Record<"data", IAssistantThread>> => {
    try {
        const createdThread = await openai.beta.threads.create();
        return { data: createdThread };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const getAssistantMessage = async (threadId: string, messageId: string): Promise<Record<"data", IAssistantMessage>> => {
    try {
        const thread = await openai.beta.threads.messages.retrieve(threadId, messageId);
        return { data: thread };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createAssistantMessage = async ({ threadId, messageData }: {
    threadId: string;
    messageData: ICreateAssistantMessage
}): Promise<Record<"data", IAssistantMessage>> => {
    try {
        const createMessage = await openai.beta.threads.messages.create(threadId, messageData);
        return { data: createMessage };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const fetchLatestMessage = async (threadId: string): Promise<Record<"data", IAssistantMessage>> => {
    try {
        const response = await openai.beta.threads.messages.list(threadId, { limit: 1 });
        return { data: response.data[0] };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const runAssistant = async ({ threadId, userId }: {
    threadId: string;
    userId: string;
}): Promise<Record<"data", IMessage> | Record<"err", string>> => {
    try {
        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });
        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if ("err" in assistantResponse) return { err: "Failed to fetch assistant response" };

        if (assistantResponse.data.content[0].type !== "text") return { err: "Invalid Assistant response!" };

        const responseContent = assistantResponse.data.content[0].text.value;
        const messageData: ICreateMessage = {
            user_id: userId,
            id: assistantResponse.data.id,
            role: assistantResponse.data.role,
            content: { responseContent },
            thread_id: run.thread_id
        }
        const savedResponse = await messageService.saveAssistantResponse(messageData);
        if ("err" in savedResponse) return { err: "Failed to save assistant response!" };

        return { data: savedResponse.data };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const runTempAssistant = async ({ threadId, tempUserId }: {
    threadId: string;
    tempUserId: string;
}): Promise<Record<"data", ITempMessage> | Record<"err", string>> => {
    try {
        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });
        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if ("err" in assistantResponse) return { err: "Failed to fetch assistant response" };

        if (assistantResponse.data.content[0].type !== "text") return { err: "Invalid Assistant response!" };

        const responseContent = assistantResponse.data.content[0].text.value;
        const messageData: ICreateTempMessage = {
            temp_user: tempUserId,
            id: assistantResponse.data.id,
            role: assistantResponse.data.role,
            content: { responseContent },
            temp_thread_id: run.thread_id
        }
        const savedResponse = await tempMessageService.saveTempAssistantResponse(messageData);
        if ("err" in savedResponse) return { err: "Failed to save assistant response!" };

        return { data: savedResponse.data };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export default {
    getAssistantThread,
    createAssistantThread,
    createAssistantMessage,
    getAssistantMessage,
    fetchLatestMessage,
    runAssistant,
    runTempAssistant,
};