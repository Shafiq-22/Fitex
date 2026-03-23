import { getAllProfileData } from './storage';
import { getPhotos } from './db';

export async function exportProfileData(profileId: string): Promise<string> {
  const storageData = getAllProfileData(profileId);
  const photos = await getPhotos(profileId);

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profileId,
    storage: storageData,
    photoCount: photos.length,
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
