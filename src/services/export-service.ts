import { updateExportStateById } from "../data/export-state-storage";
import { startArchiveService } from "./archive-service";
import { addToSRTQueue } from "./srt-queue";


const log = (message: string) =>
  console.log("\x1b[33m", "[Export Service] " + message, "\x1b[0m");

export type ConversionType = "SRT";

export const createExport = async (
  exportId: string,
  transcriptionIds: Array<string>,
  fileFormat: ConversionType,
) => {
  log("Start Conversion...")
  await updateExportStateById(exportId, { state: 'pending', link: null });

  if (fileFormat === "SRT") {
    log("Sending job to queue...")
    addToSRTQueue(exportId, transcriptionIds);
    startArchiveService(exportId, fileFormat);
  } else {
    // else statements should handle different file formats

    // Note: this should never happen, as fileFormat parameter should be validated in API layer, and currently only allows SRT
    throw new Error("File format not supported");
  }
};
