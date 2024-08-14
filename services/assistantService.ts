import db from '../prisma/client';
import { Prisma } from '@prisma/client';
import { type threads as IThread } from '@prisma/client';
import OpenAI from "openai";

const openai = new OpenAI();

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantThread = OpenAI.Beta.Threads.ThreadCreateParams;

const getAssistantThread = async(id: string): Promise<IAssistantThread | null> => {
    try {
        const thread = await openai.beta.threads.retrieve(id);        
        if (!thread) return null;
        
        return thread;
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