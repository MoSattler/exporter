// This is the storage where archives ready for download are stored.

export class Archive {}

const objectStorage: Record<string, Archive> = {} as const;

export const getByArchiveId = async (exportId: string) =>
  objectStorage[exportId];

export const saveArchive = async (exportId: string, data: Archive) => {
  objectStorage[exportId] = data;
};
