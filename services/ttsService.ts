import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY as string,
    process.env.SPEECH_REGION as string
  );

  const synthesizeSpeech = async ({text,voice}:{text:string;voice:string;}): Promise<Record<"data", string> | Record<"err", string>> => {
    try {
      speechConfig.speechSynthesisVoiceName = voice;
      const fileName = `${uuidv4()}.mp3`;
      const filePath = path.join(__dirname, '../audio', fileName);
      
      const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filePath);
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
      

      return new Promise((resolve) => {
        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              synthesizer.close();
              resolve({ data: filePath });
            } else {
              synthesizer.close();
              resolve({ err: 'Speech synthesis failed' });
            }
          },
          (error) => {
            synthesizer.close();
            resolve({ err: `Error: ${error}` });
          }
        );
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

export default {
    synthesizeSpeech
};