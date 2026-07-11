'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiUpload, fileUrl } from '@/lib/api-client';
import { Card } from '@/components/ui/Card';
import { PhotoPicker } from '@/components/ui/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { Lightbox } from '@/components/ui/Gallery';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import type { MoveInPhoto } from '@/types/api';
import styles from './MoveInPhotosSection.module.css';

const WINDOW_HOURS = 72;

interface MoveInPhotosResponse {
  photos: MoveInPhoto[];
  keyHandover: boolean;
  keyHandoverAt: string | null;
}

function formatTimeLeft(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function MoveInPhotosSection() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const { data } = useQuery({
    queryKey: ['tenant-me-move-in-photos'],
    queryFn: () => apiGet<MoveInPhotosResponse>('/tenants/me/lease/move-in-photos'),
    retry: false,
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const keyHandoverAt = data?.keyHandoverAt;
  const deadline = useMemo(() => {
    if (!keyHandoverAt) return null;
    return new Date(keyHandoverAt).getTime() + WINDOW_HOURS * 60 * 60 * 1000;
  }, [keyHandoverAt]);

  const withinWindow = deadline !== null && now < deadline;
  const uploadedPhotos = data?.photos || [];

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      photos.forEach((p) => fd.append('files', p));
      return apiUpload<MoveInPhotosResponse>('/tenants/me/lease/move-in-photos', fd);
    },
    onSuccess: () => {
      toast('Move-in photos uploaded', 'success');
      queryClient.invalidateQueries({ queryKey: ['tenant-me-move-in-photos'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-me-lease'] });
      setPhotos([]);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to upload photos'),
  });

  // Nothing to do until the key has actually been handed over.
  if (!data?.keyHandover) return null;
  // Window closed and nothing was ever uploaded — no nagging, just stay quiet.
  if (!withinWindow && uploadedPhotos.length === 0) return null;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Move-in photos</div>
          <div className={styles.subtitle}>
            {withinWindow
              ? 'Snap the condition of your flat at move-in — useful if there is ever a deposit dispute.'
              : 'Photos recorded at move-in.'}
          </div>
        </div>
        {withinWindow && deadline && (
          <span className={styles.countdown}>
            <span className={styles.countdownDot} /> {formatTimeLeft(deadline - now)}
          </span>
        )}
      </div>

      {uploadedPhotos.length > 0 && (
        <div className={styles.gallery}>
          {uploadedPhotos.map((p, i) => (
            <button key={p.url + i} type="button" className={styles.thumb} onClick={() => setLightboxIndex(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(p.url) || ''} alt={`Move-in photo ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {withinWindow && (
        <>
          {error && <p style={{ color: 'var(--tag-red-text)', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>}
          <div style={{ marginTop: '0.9rem' }}>
            <PhotoPicker
              label="Add photos"
              hint="Rooms, fittings, any existing damage — up to 12 photos"
              photos={photos}
              onChange={setPhotos}
              onError={setError}
            />
          </div>
          {photos.length > 0 && (
            <Button size="sm" loading={mutation.isPending} onClick={() => mutation.mutate()}>
              Upload {photos.length} photo{photos.length === 1 ? '' : 's'}
            </Button>
          )}
        </>
      )}

      {lightboxIndex !== null && (
        <Lightbox images={uploadedPhotos} alt="Move-in photo" initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </Card>
  );
}
