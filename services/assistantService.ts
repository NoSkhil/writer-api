import OpenAI from "openai";
import tempMessageService from "./tempMessageService";
import messageService from "./messageService";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string
});
import { IAssistantMessage, IAssistantThread, ICreateAssistantMessage, IAssistantRun } from "../types/openaiTypes";
import { ICreateMessage, ICreateTempMessage, ITempMessage, IMessage } from "../types/messageTypes";


const getAssistantThread = async (id: string): Promise<IAssistantThread> => {
    try {
        const thread = await openai.beta.threads.retrieve(id);
        if (!thread) throw new Error("Invalid OpenAI Thread ID");

        return thread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createAssistantThread = async (): Promise<IAssistantThread> => {
    try {
        const createdThread = await openai.beta.threads.create();
        return createdThread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const getAssistantMessage = async (threadId: string, messageId: string): Promise<IAssistantMessage> => {
    try {
        const thread = await openai.beta.threads.messages.retrieve(threadId, messageId);
        return thread;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};

const createAssistantMessage = async ({ threadId, messageData }: {
    threadId: string;
    messageData: ICreateAssistantMessage
}): Promise<IAssistantMessage> => {
    try {
        const createMessage = await openai.beta.threads.messages.create(threadId, messageData);
        return createMessage;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const fetchLatestMessage = async (threadId: string): Promise<IAssistantMessage> => {
    try {
        const response = await openai.beta.threads.messages.list(threadId, { limit: 1 });
        return response.data[0];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const runAssistant = async ({ threadId, userId }: {
    threadId: string;
    userId: string;
}): Promise<IMessage> => {
    try {
        let run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });

        const fetchCompletedRun = await pollAssistantRunStatus({ threadId, runId: run.id });
        run = fetchCompletedRun;

        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if (assistantResponse.content[0].type !== "text") throw new Error("Invalid Assistant response!");

        const responseContent: { script: string; voice: string } = JSON.parse(assistantResponse.content[0].text.value);
        const messageData: ICreateMessage = {
            user_id: userId,
            id: assistantResponse.id,
            role: assistantResponse.role,
            content: responseContent,
            thread_id: run.thread_id
        }

        const savedResponse = await messageService.createMessage(messageData);
        return savedResponse;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

// RUN A CHEAPER MODEL FOR NON_LOGGED_IN USERS
const runTempAssistant = async ({ threadId, tempUserId }: {
    threadId: string;
    tempUserId: string;
}): Promise<ITempMessage> => {
    try {
        let run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });

        const fetchCompletedRun = await pollAssistantRunStatus({ threadId, runId: run.id });
        run = fetchCompletedRun;

        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if (assistantResponse.content[0].type !== "text") throw new Error("Invalid Assistant response!");

        const responseContent: { script: string; voice: string } = JSON.parse(assistantResponse.content[0].text.value);
        const messageData: ICreateTempMessage = {
            temp_user: tempUserId,
            id: assistantResponse.id,
            role: assistantResponse.role,
            content: responseContent,
            temp_thread_id: run.thread_id
        }
        const savedResponse = await tempMessageService.createTempMessage(messageData);
        return savedResponse;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const pollAssistantRunStatus = async ({ threadId, runId }: {
    threadId: string;
    runId: string;
}): Promise<IAssistantRun> => {
    //CHECK OPENAI API DOCS THERE IS AN EVENT FLAG ON COMPLETION, REMOVE THIS SHIT ASAP
    try {
        // Max Retry Limit, make it an enum.
        let maxRetries = 15;
        let retryCount = 0;

        while (true) {
            // Using a manual delay for now because it costs more to stream the data from openai.
            await delay(2500); // Wait for 2.5 seconds

            // Re-fetch the run status
            const run = await openai.beta.threads.runs.retrieve(threadId, runId);
            console.log(`Polling status: ${run.status}`);

            if (run.status === "completed") {
                return run;
            }

            // Increment the retry count and check if we've exceeded the maximum
            retryCount++;
            if (retryCount > maxRetries) {
                throw new Error("Failed to fetch Assistant response! - Maximum number of retries exceeded.");
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default {
    getAssistantThread,
    createAssistantThread,
    createAssistantMessage,
    getAssistantMessage,
    fetchLatestMessage,
    runAssistant,
    runTempAssistant,
};