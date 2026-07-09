'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, id, className, ...rest }, ref) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input ref={ref} id={id} className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});
