import styles from './Table.module.css';

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className={styles.empty}>{message}</div>;
}

export function Loading() {
  return <div className={styles.empty}>Loading...</div>;
}
