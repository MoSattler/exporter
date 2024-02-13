// To keep track of conversion jobs in the queue. the archive-service is checking here if all conversions are done and then starts archiving.

type JobGroup = {
  conversionsStatus: Record<string, "pending" | "done" | "failed">;
};

const QUEUE_STORAGE: Record<string, JobGroup> = {};

export const getConversionJobGroupByExportId = async (exportId: string) =>
  QUEUE_STORAGE[exportId];

export const addConversionJobGroup = (
  exportId: string,
  transcriptionIds: Array<string>,
) => {
  QUEUE_STORAGE[exportId] = { conversionsStatus: {} };
  transcriptionIds.forEach((transId) => {
    QUEUE_STORAGE[exportId].conversionsStatus[transId] = "pending";
  });
};

export const markConversionAsDone = (exportId: string, transId: string) => {
  QUEUE_STORAGE[exportId].conversionsStatus[transId] = "done";
};

export const markConversionAsFailed = (exportId: string, transId: string) => {
  QUEUE_STORAGE[exportId].conversionsStatus[transId] = "failed";
};

export const isConversionJobGroupPending = (exportId: string) => {
  const jobGroup = QUEUE_STORAGE[exportId];
  const statusList = Object.values(jobGroup.conversionsStatus);
  return statusList.includes("pending")
};

export const isConversionJobGroupFailed = (exportId: string) => {
  const jobGroup = QUEUE_STORAGE[exportId];
  const statusList = Object.values(jobGroup.conversionsStatus);
  return statusList.includes("failed")
};

export const removeConversionJobGroup = (exportId: string) => {
  // We're removing job groups once they are done and archived. In reality, we would keep them around for record keeping and just mark them as done
  delete QUEUE_STORAGE[exportId];
};
