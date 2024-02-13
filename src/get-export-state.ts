import { getExportStateById } from "./data/export-state-storage";

export const getExportState = async (
  exportId: string,
) => {
  const state = await getExportStateById(exportId)
  return state
};
