import { CSSProperties } from 'react';
import styles from './Card.module.css';

export function Card({
  children,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`${styles.card} ${onClick ? styles.clickable : ''} ${className || ''}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}
