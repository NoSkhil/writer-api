import OpenAI from "openai";

const openai = new OpenAI();

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantThread = OpenAI.Beta.Threads.ThreadCreateParams;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type IAssistantMessage = OpenAI.Beta.Threads.Message;

const getAssistantThread = async(id: string): Promise<Record<"data",IAssistantThread> | Record<"err",string>> => {
    try {
        const thread = await openai.beta.threads.retrieve(id);        
        if (!thread) return {err:"Invalid Assistant Thread ID."};
        
        return {data:thread};
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

const createAssistantThread = async(messageData: ICreateAssistantThread): Promise<Record<"data",IAssistantThread>> => {
    try {
        const createdThread = await openai.beta.threads.create(messageData);
        return {data:createdThread};
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

const getAssistantMessage = async(threadId: string, messageId: string): Promise<Record<"data",IAssistantMessage> | Record<"err",string>> => {
    try {
        const thread = await openai.beta.threads.messages.retrieve(threadId,messageId);        
        if (!thread) return {err:"Invalid Assistant Thread ID."};
        
        return {data:thread};
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

const createAssistantMessage = async(threadId:string, messageData: ICreateAssistantMessage): Promise<Record<"data",IAssistantMessage> | Record<"err",string>> => {
    try {
        const thread = await getAssistantThread(threadId);
        if ("err" in thread) return {err:"Invalid Assistant Thread ID."};  

        const createMessage = await openai.beta.threads.messages.create(thread.data.id,messageData);
        return {data:createMessage};
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

export default {
    getAssistantThread,
    createAssistantThread,
    createAssistantMessage
};