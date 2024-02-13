export class Transcription {}

const DB: Record<string, Transcription> = {
  "1": new Transcription(),
  "2": new Transcription(),
  "3": new Transcription(),
  "4": new Transcription(),
  "5": new Transcription(),
  "FAIL": new Transcription(),
}

export const getByTranscriptionId = async (transId: string) => {
  if (DB[transId]) {
    return DB[transId] as Transcription;
  } else {
    return null;
  }
};
