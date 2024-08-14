import OpenAI from "openai";

const openai = new OpenAI();

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantThread = OpenAI.Beta.Threads.ThreadCreateParams;

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

const createAssistantThread = async(messageData: ICreateAssistantThread): Promise<IAssistantThread> => {
    try {
        const createdMessage = await openai.beta.threads.create(messageData);
        return createdMessage;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
};

export default {
    getAssistantThread,
    createAssistantThread
};