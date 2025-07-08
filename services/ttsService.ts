import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY as string,
  process.env.SPEECH_REGION as string
);

const synthesizeSpeech = async ({
  text,
  voice,
}: {
  text: string;
  voice: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      speechConfig.speechSynthesisVoiceName = voice;
      const fileName = `${uuidv4()}.mp3`;
      const audioDir = path.join(__dirname, '../audio');
      const filePath = path.join(audioDir, fileName);

      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }

      const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filePath);
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          synthesizer.close();
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(filePath);
          } else {
            reject(new Error('Speech synthesis failed'));
          }
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  synthesizeSpeech,
};
