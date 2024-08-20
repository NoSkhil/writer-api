import OpenAI from "openai";

type IAssistantThread = OpenAI.Beta.Threads.Thread;
type ICreateAssistantMessage = OpenAI.Beta.Threads.MessageCreateParams;
type IAssistantMessage = OpenAI.Beta.Threads.Message;

export {
    IAssistantMessage,
    IAssistantThread,
    ICreateAssistantMessage
}