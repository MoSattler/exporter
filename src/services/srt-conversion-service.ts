import { randomDelay } from "../utils/delay";
import {
  SrtConversion,
  getSRTConverisonByTranscriptionId,
  updateConversionByTranscriptionId,
} from "../data/srt-conversion-storage";
import {
  Transcription,
  getByTranscriptionId,
} from "../data/transcription-storage";
import { markConversionAsDone, markConversionAsFailed } from "../data/srt-conversion-job-storage";

const log = (transcriptionId: string, message: string) =>
  console.log(
    "\x1b[34m",
    `[SRT Conversion Service ${transcriptionId}] ${message}`,
    "\x1b[0m",
  );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transcriptionToConversion = async (transcriptionId: string, transcription: Transcription) => {
  await randomDelay();
  if (transcriptionId === "FAIL") {
    // Some hardcoded failure case
    throw new Error("Conversion failed");
  }
  return new SrtConversion();
};

export const createSRTConversion = async (
  exportId: string,
  transcriptionId: string,
) => {
  log(transcriptionId, `Spawned`);
  log(transcriptionId, `Check DB for existing conversion...`);
  
  const existingConversion =
    await getSRTConverisonByTranscriptionId(transcriptionId);

  if (!existingConversion) {
    log(transcriptionId, `Start conversion...`);
    const transcription = await getByTranscriptionId(transcriptionId);

    let srtConversion: SrtConversion;
    try {
      srtConversion = await transcriptionToConversion(
        transcriptionId,
        transcription as Transcription,
      );
      await updateConversionByTranscriptionId(transcriptionId, srtConversion);
    } catch {
      markConversionAsFailed(exportId, transcriptionId);
      log(transcriptionId, `Conversion failed!`);
      return
    }

  } else {
    log(transcriptionId, `Conversion already exist. Skipping...`);
  }

  markConversionAsDone(exportId, transcriptionId);
  log(transcriptionId, `Conversion done`);
};
