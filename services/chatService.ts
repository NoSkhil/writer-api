import threadService from "./threadService";
import messageService from "./messageService";
import assistantService from "./assistantService";
import ttsService from "./ttsService";
import { ICreateAssistantMessage } from "../types/openaiTypes";
import { ICreateThread, IThread } from "../types/threadTypes";
import { ICreateMessage, IMessage } from "../types/messageTypes";
import { IUser, USER_OPTIONS } from "../types/userTypes";
import { CHAT_ROLE } from "../types/chatRoleTypes";


const initialiseChat = async (userId: string): Promise<IThread> => {
  try {
    const openAIThreadData = await assistantService.createAssistantThread();

    const threadData: ICreateThread = {
      id: openAIThreadData.id,
      user_id: userId
    }
    const initialiseThreadData = await threadService.createThread(threadData);

    return initialiseThreadData;
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
}): Promise<{ message: IMessage; assistantResponse: IMessage, audioAdFile: string | null }> => {
  try {
    let assistantMessageData: ICreateAssistantMessage = {
      content,
      role: CHAT_ROLE.USER
    }
    const assistantMessage = await assistantService.createAssistantMessage({ threadId, messageData: assistantMessageData });

    let messageData: ICreateMessage = {
      id: assistantMessage.id,
      role: CHAT_ROLE.USER,
      content: { text: content },
      thread_id: threadId,
      user_id: user.id
    }

    const message = await messageService.createMessage(messageData);

    const assistantResponse = await assistantService.runAssistant({ threadId, userId: user.id });

    const audioAdFile = await generateInstantAudioAd(user, assistantResponse);

    return {
      message,
      assistantResponse,
      audioAdFile
    };
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

const generateInstantAudioAd = async (user: IUser, assistantResponse: IMessage): Promise<string | null> => {
  try {
    //Find a cleaner way to access these params safely
    const instantAudioGeneration = USER_OPTIONS.INSTANT_AUDIO_GENERATION;

    //Check if User has the "INSTANT_AUDIO_GENERATION" option enabled
    if (
      user.user_options &&
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
      const ttsAudioFile = await ttsService.synthesizeSpeech({ text: script, voice });

      return ttsAudioFile;
    }
    else return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default {
  initialiseChat,
  createMessage
}