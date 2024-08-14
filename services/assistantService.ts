import OpenAI from "openai";

const openai = new OpenAI();

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantThread = OpenAI.Beta.Threads.ThreadCreateParams;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type IAssistantMessage = OpenAI.Beta.Threads.Message;
type IAssistantRunData = OpenAI.Beta.Threads.Run;

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

const createAssistantThread = async (messageData: ICreateAssistantThread): Promise<Record<"data", IAssistantThread>> => {
    try {
        const createdThread = await openai.beta.threads.create(messageData);
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

const createAssistantMessage = async (threadId: string, messageData: ICreateAssistantMessage): Promise<Record<"data", IAssistantMessage>> => {
    try {
        const createMessage = await openai.beta.threads.messages.create(threadId, messageData);
        return { data: createMessage };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const fetchAssistantResponse = async (threadId: string): Promise<Record<"data", IAssistantMessage>> => {
    try {
        const response = await openai.beta.threads.messages.list(threadId, { limit: 1 });
        return { data: response.data[0] };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


const runAssistant = async (threadId: string): Promise<Record<"data", IAssistantRunData>> => {
    try {
        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });
        return { data: run };
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
    runAssistant,
    fetchAssistantResponse
};