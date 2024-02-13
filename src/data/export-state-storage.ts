// This storage is used to track the state (pending/done/error) of export processing. 
// This is the data returned to the user when using the get-export-state endpoint.


type ExportState = {
  state: "pending" | "done" | "failed";
  link: string | null
};

const DB: Record<string, ExportState> = {};

export const getExportStateById = async (exportId: string) => DB[exportId];

export const updateExportStateById = async (
  exportId: string,
  state: ExportState,
) => {
  DB[exportId] = state;
};
