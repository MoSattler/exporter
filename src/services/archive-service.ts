import { saveArchive } from "../data/archive-storage";
import { updateExportStateById } from "../data/export-state-storage";
import {
  getConversionJobGroupByExportId,
  isConversionJobGroupFailed,
  isConversionJobGroupPending,
  removeConversionJobGroup,
} from "../data/srt-conversion-job-storage";
import { getSRTConverisonByTranscriptionId } from "../data/srt-conversion-storage";
import { delay, randomDelay } from "../utils/delay";
import { ConversionType } from "./export-service";

class Archive {}

const log = (message: string) =>
  console.log("\x1b[36m", "[Archive Service] " + message, "\x1b[0m");

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const createConversionArchive = async (conversions: Array<any>) => {
  // Fake work of creating an archive
  await randomDelay(3000, 10000);
  return new Archive();
};

export const createArchive = async (
  exportId: string,
  transcriptionIds: Array<string>,
  fileFormat: ConversionType,
) => {
  log("Start Creating Archive...");

  let archive: Archive;
  if (fileFormat === "SRT") {
    // Accessing the conversion store to get the files
    const conversions = await Promise.all(
      transcriptionIds.map(getSRTConverisonByTranscriptionId),
    );
    archive = await createConversionArchive(conversions);
  } else {
    // else statements should handle different file formats

    // Note: this should never happen, as fileFormat parameter should be validated in API layer, and currently only allows SRT
    throw new Error("File format not supported");
  }

  // Saving to BLOB storage
  await saveArchive(exportId, archive);
  log("Successfully created archive!");
};

export const startArchiveService = async (
  exportId: string,
  fileFormat: ConversionType,
) => {
  // Right now an archive service is listening only for a specifc job. An optimization could be to have archive services listen or
  // periodically checking for any kind of jobs that need archiving.

  log("Starting...");

  let archivingDone = false;
  while (!archivingDone) {
    const conversionFailed = isConversionJobGroupFailed(exportId);
    if (conversionFailed) {
      log("Conversion failed. Aborting archiving");
      removeConversionJobGroup(exportId);
      await updateExportStateById(exportId, {
        state: "failed",
        link: null,
      });
      break;
    }

    const conversionsPending = isConversionJobGroupPending(exportId);
    if (!conversionsPending) {
      log("All conversions are done!");
      const jobGroup = await getConversionJobGroupByExportId(exportId);
      const transcriptionIds = Object.keys(jobGroup.conversionsStatus)
      await createArchive(
        exportId,
        transcriptionIds,
        fileFormat,
      );
      removeConversionJobGroup(exportId); // marking the job as done, removing it from the queue
      log("Marking export as ready");
      await updateExportStateById(exportId, {
        state: "done",
        link: `https://www.my-export-service.com/download/${exportId}`,
      });
      archivingDone = true;
    }

    await delay(500);
  }
  log("Archiving done!");
};
