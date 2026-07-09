import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.brandSide}>
        <div className={styles.aurora} aria-hidden="true">
          <span className={styles.blob1} />
          <span className={styles.blob2} />
          <span className={styles.blob3} />
        </div>
        <div className={styles.gridOverlay} aria-hidden="true" />

        <div className={styles.brandTop}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>RF</span> RentFlow
          </div>
        </div>

        <div className={styles.showcase} aria-hidden="true">
          <div className={styles.glassCard}>
            <div className={styles.glassCardHeader}>
              <span className={styles.glassDot} />
              Portfolio overview
            </div>
            <div className={styles.glassStats}>
              <div className={styles.glassStat}>
                <div className={styles.glassStatValue}>94%</div>
                <div className={styles.glassStatLabel}>Occupancy</div>
              </div>
              <div className={styles.glassStat}>
                <div className={styles.glassStatValue}>₹8.2L</div>
                <div className={styles.glassStatLabel}>Collected</div>
              </div>
              <div className={styles.glassStat}>
                <div className={styles.glassStatValue}>212</div>
                <div className={styles.glassStatLabel}>Units</div>
              </div>
            </div>
            <div className={styles.glassBars}>
              <span style={{ height: '38%' }} />
              <span style={{ height: '55%' }} />
              <span style={{ height: '46%' }} />
              <span style={{ height: '72%' }} />
              <span style={{ height: '60%' }} />
              <span style={{ height: '88%' }} />
              <span style={{ height: '76%' }} />
            </div>
          </div>
          <div className={styles.glassChip}>
            <span className={styles.chipCheck}>✓</span> Rent received — Unit 4B
          </div>
          <div className={styles.glassChipAlt}>
            <span className={styles.chipSpark}>⚡</span> Maintenance resolved in 2 days
          </div>
        </div>

        <div className={styles.brandBottom}>
          <div className={styles.stars} aria-hidden="true">★★★★★</div>
          <div className={styles.quote}>
            &ldquo;RentFlow brought everything together. We finally have a single source of truth for our entire
            portfolio.&rdquo;
          </div>
          <div className={styles.author}>
            <span className={styles.authorAvatar}>PM</span>
            <span>
              <span className={styles.authorName}>Portfolio manager</span>
              <span className={styles.authorRole}>200+ units under management</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formWrap}>{children}</div>
      </div>
    </div>
  );
}
