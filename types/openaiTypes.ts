import type OpenAI from "openai";

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type IAssistantMessage = OpenAI.Beta.Threads.Message;
type IAssistantRun = OpenAI.Beta.Threads.Run;

export {
    IAssistantMessage,
    IAssistantThread,
    ICreateAssistantMessage,
    IAssistantRun
}