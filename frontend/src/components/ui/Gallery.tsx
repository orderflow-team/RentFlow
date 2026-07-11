'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fileUrl } from '@/lib/api-client';
import type { PropertyImage } from '@/types/api';
import styles from './Gallery.module.css';

/**
 * Full-screen photo viewer with arrow-key navigation and Escape to close.
 * Rendered via a portal to <body> — position:fixed only escapes to the
 * viewport if it isn't nested inside an ancestor with a `transform`
 * (e.g. a hover-lift card), which would otherwise trap it.
 */
export function Lightbox({
  images,
  alt,
  initialIndex = 0,
  onClose,
}: {
  images: PropertyImage[];
  alt: string;
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(Math.min(initialIndex, images.length - 1));
  const count = images.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  if (!count) return null;
  const current = images[index];

  return createPortal(
    <div className={styles.lightbox} onClick={onClose}>
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
        ✕
      </button>
      {count > 1 && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous photo"
        >
          ←
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fileUrl(current.url) || ''}
        alt={`${alt} — photo ${index + 1}`}
        className={styles.lightboxImg}
        onClick={(e) => e.stopPropagation()}
      />
      {count > 1 && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.next}`}
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next photo"
        >
          →
        </button>
      )}
      <div className={styles.lightboxCaption}>{current.caption || `${alt} · ${index + 1} of ${count}`}</div>
    </div>,
    document.body,
  );
}

/**
 * Photo album with a hero image, thumbnail strip, and a full-screen lightbox.
 */
export function Gallery({ images, alt }: { images: PropertyImage[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const count = images.length;
  if (!count) return null;

  const safeActive = Math.min(active, count - 1);
  const current = images[safeActive];

  return (
    <div className={styles.wrap}>
      <div className={styles.hero} onClick={() => setOpen(true)} role="button" aria-label="Open photo album">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fileUrl(current.url) || ''} alt={`${alt} — photo ${safeActive + 1}`} className={styles.heroImg} />
        <span className={styles.count}>
          {safeActive + 1} / {count} photos
        </span>
      </div>

      {count > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              className={`${styles.thumb} ${i === safeActive ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(img.url) || ''} alt={`${alt} thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {open && <Lightbox images={images} alt={alt} initialIndex={safeActive} onClose={() => setOpen(false)} />}
    </div>
  );
}
