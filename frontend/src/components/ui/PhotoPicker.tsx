'use client';

import { useEffect, useMemo, useRef } from 'react';
import styles from './PhotoPicker.module.css';

const MAX_PHOTOS = 12;

interface PhotoPickerProps {
  label: string;
  hint: string;
  photos: File[];
  onChange: (photos: File[]) => void;
  onError?: (message: string) => void;
}

/** Multi-image picker with thumbnail previews, per-photo remove, and an add-more tile. */
export function PhotoPicker({ label, hint, photos, onChange, onError }: PhotoPickerProps) {
  const previews = useMemo(() => photos.map((p) => URL.createObjectURL(p)), [photos]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith('image/'));
    if (valid.length !== files.length) {
      onError?.('Some files were skipped — only images are allowed (JPG, PNG, WebP...)');
    }
    if (valid.length) {
      onChange([...photos, ...valid].slice(0, MAX_PHOTOS));
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  const input = (
    <input ref={inputRef} type="file" accept="image/*" multiple className={styles.input} onChange={handleChange} />
  );

  return (
    <div className={styles.field}>
      <span className={styles.label}>
        {label} {photos.length > 0 && `(${photos.length}/${MAX_PHOTOS})`}
      </span>
      {photos.length ? (
        <div className={styles.grid}>
          {previews.map((src, i) => (
            <div key={src} className={styles.previewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className={styles.previewImg} />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
                aria-label={`Remove photo ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className={styles.addMore}>
              <span className={styles.plus}>+</span>
              Add more
              {input}
            </label>
          )}
        </div>
      ) : (
        <label className={styles.drop}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.5-3.5a1.5 1.5 0 0 0-2.1 0L7 20" />
          </svg>
          <span className={styles.dropText}>Click to upload photos</span>
          <span className={styles.dropHint}>{hint}</span>
          {input}
        </label>
      )}
    </div>
  );
}
