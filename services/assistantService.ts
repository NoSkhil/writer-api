import OpenAI from "openai";
import tempMessageService from "./tempMessageService";
import messageService from "./messageService";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string
});
import { IAssistantMessage, IAssistantThread, ICreateAssistantMessage, IAssistantRun } from "../types/openaiTypes";
import { ICreateMessage, ICreateTempMessage, ITempMessage, IMessage } from "../types/messageTypes";


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
        let run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });

        const fetchCompletedRun = await pollAssistantRunStatus({threadId,runId:run.id});
        if ("err" in fetchCompletedRun) return {err:fetchCompletedRun.err};

        run = fetchCompletedRun.data;

        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if ("err" in assistantResponse) return { err: "Failed to fetch assistant response" };

        if (assistantResponse.data.content[0].type !== "text") return { err: "Invalid Assistant response!" };

        const responseContent : { script: string; voice: string } = JSON.parse(assistantResponse.data.content[0].text.value);
        const messageData: ICreateMessage = {
            user_id: userId,
            id: assistantResponse.data.id,
            role: assistantResponse.data.role,
            content: responseContent,
            thread_id: run.thread_id
        }
        const savedResponse = await messageService.createMessage(messageData);
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
        let run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.OPENAI_ASSISTANT_ID as string });

        const fetchCompletedRun = await pollAssistantRunStatus({threadId,runId:run.id});
        if ("err" in fetchCompletedRun) return {err:fetchCompletedRun.err};

        run = fetchCompletedRun.data;

        const assistantResponse = await fetchLatestMessage(run.thread_id);
        if ("err" in assistantResponse) return { err: "Failed to fetch assistant response" };

        if (assistantResponse.data.content[0].type !== "text") return { err: "Invalid Assistant response!" };

        const responseContent : { script: string; voice: string } = JSON.parse(assistantResponse.data.content[0].text.value);
        const messageData: ICreateTempMessage = {
            temp_user: tempUserId,
            id: assistantResponse.data.id,
            role: assistantResponse.data.role,
            content: responseContent,
            temp_thread_id: run.thread_id
        }
        const savedResponse = await tempMessageService.createTempMessage(messageData);
        if ("err" in savedResponse) return { err: "Failed to save assistant response!" };

        return { data: savedResponse.data };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const pollAssistantRunStatus = async ({threadId, runId}:{threadId:string; runId:string;}) : Promise<Record<"data",IAssistantRun> | Record<"err",string>> => {
    try {
        // Add the maximum number of retries here, make it an enum.
        let maxRetries = 5;
        let retryCount = 0;

        while (true) {
            // Using a manual delay for now because it costs more to stream the data from openai or ping the API repeatedly.
            await delay(5000); // Wait for 5 seconds

            // Re-fetch the run status
            const run = await openai.beta.threads.runs.retrieve(threadId, runId);
            console.log(`Polling status: ${run.status}`);

            if (run.status === "completed") {
                return {data:run};
            }

            // Increment the retry count and check if we've exceeded the maximum
            retryCount++;
            if (retryCount > maxRetries) {
                return {err:"Failed to fetch Assistant response! - Maximum number of retries exceeded."};
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