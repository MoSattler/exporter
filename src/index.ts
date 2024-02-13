// This file simulates a user requesting the endpoints. View examples that can be used by calling them in `main()`

import { createExport } from "./create-export";
import { getExportState } from "./get-export-state";
import { delay } from "./utils/delay";

const log = (message: string) =>
  console.log("\x1b[32m", "[User] " + message, "\x1b[0m");

const simpleCase = async () => {
  log("POST create-export");
  const { exportId } = await createExport("SRT", ["1", "2", "3", "4"]);

  log("GET export-state");
  let state = await getExportState(exportId);
  while (state.state === "pending") {
    log("export not ready yet. Will try again in 10s");
    await delay(10000);
    state = await getExportState(exportId);
  }
  log(`export ready to downloaded at ${state.link}`);
}

const hittingConversionCache = async () => {
  const { exportId } = await createExport("SRT", ["5"]);

  let state = await getExportState(exportId);
  while (state.state === 'pending') {
    await delay(2000);
    state = await getExportState(exportId);
  }
  await createExport("SRT", ["5"]);
}

const failure = async () => {
  const { exportId } = await createExport("SRT", ["FAIL"]);

  let state = await getExportState(exportId);
  while (state.state === 'pending') {
    await delay(2000);
    state = await getExportState(exportId);
  }
  log(`export failed.`);
}

const main = async () => {
  console.log("=====================SIMPLE CASE=====================")
  await simpleCase()
  console.log("=====================HITTING CACHE=====================")
  await hittingConversionCache()
  console.log("=====================FAILURE=====================")
  await failure()
};

main();
