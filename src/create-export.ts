import { ConversionType, createExport as createExportService } from "./services/export-service";
import { v4 as createUuid } from 'uuid';

export const createExport = async (
  fileFormat: ConversionType,
  fileIds: Array<string>,
) => {
  const exportId = createUuid();
  createExportService(exportId, fileIds, fileFormat);
  return { exportId: exportId };
};
