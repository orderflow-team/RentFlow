import { apiUpload } from './api-client';
import type { PropertyImage } from '@/types/api';

/** Upload image files to the shared property-images store; returns image refs for create/update payloads. */
export async function uploadImages(photos: File[]): Promise<PropertyImage[] | undefined> {
  if (!photos.length) return undefined;
  const fd = new FormData();
  photos.forEach((p) => fd.append('files', p));
  const res = await apiUpload<{ urls: string[] }>('/properties/upload-images', fd);
  return res.urls.map((url) => ({ url }));
}
