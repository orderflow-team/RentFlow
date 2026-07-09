'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, id, className, children, ...rest }, ref) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <select ref={ref} id={id} className={`${styles.input} ${className || ''}`} {...rest}>
        {children}
      </select>
    </div>
  );
});
