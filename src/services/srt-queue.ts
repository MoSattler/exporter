// Very questionable mock of a queue-like system
// Skipped over most queue features, since that's not the focus of the exercise

import { addConversionJobGroup } from "../data/srt-conversion-job-storage";
import { createSRTConversion } from "./srt-conversion-service";

const log = (message: string) =>
  console.log(
    "\x1b[35m",
    `[SRT Queue] ${message}`,
    "\x1b[0m",
  );

export const addToSRTQueue = (exportId: string, transcriptionIds: Array<string>) => {
    log(`Queue received jobs for ${transcriptionIds}`)
    addConversionJobGroup(exportId, transcriptionIds);
    // For the exercise, we are really just scale the conversion to infinite.
    // In the real world, we should limit the number of parallel jobs
    transcriptionIds.forEach(transId => createSRTConversion(exportId, transId))
}

// NOTE: some things that would have been interesting to implement is when a job repeatedly fails, or times out. In this case we would update the 
// respective value in the export-state-storage to failed!