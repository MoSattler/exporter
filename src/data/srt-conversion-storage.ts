// This is the storage where we store successfully processed conversions

export class SrtConversion {}

const DB: Record<string, SrtConversion> = {};

export const getSRTConverisonByTranscriptionId = async (
  transcriptionId: string,
): Promise<SrtConversion | null> => DB[transcriptionId];

export const updateConversionByTranscriptionId = async (
  transcriptionId: string,
  conversion: SrtConversion,
) => {
  DB[transcriptionId] = conversion;
};
