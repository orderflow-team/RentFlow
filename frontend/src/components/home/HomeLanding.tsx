'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import styles from './HomeLanding.module.css';

/* ================================================================== */
/* Data                                                                */
/* ================================================================== */

const ACTIVITY = [
  { text: 'Rent received — Flat 4B', meta: '₹22,000 · just now' },
  { text: 'Maintenance resolved', meta: 'Leaking tap · 2 days' },
  { text: 'Lease signed — Flat 301', meta: 'Tower A · 11 months' },
  { text: 'Move-in photos uploaded', meta: '8 photos · deposit-safe' },
  { text: 'New family moved in', meta: 'Garden View · 2BHK' },
  { text: 'Deposit recorded', meta: '₹85,000 · Flat 1201' },
] as const;

const FEATURES = [
  {
    n: '01',
    title: 'Buildings & flats',
    text: 'Model real portfolios — properties, towers, floors and flats with photo galleries, pricing and live availability.',
    icon: '🏡',
  },
  {
    n: '02',
    title: 'Tenants & leases',
    text: 'Digital lease lifecycle with checklists — agreement, KYC, deposit, key handover and exit inspection.',
    icon: '🤝',
  },
  {
    n: '03',
    title: 'Rent & finance',
    text: 'Receipts, partial payments, utility bills and expenses — billed, collected and outstanding at a glance.',
    icon: '₹',
  },
  {
    n: '04',
    title: 'Maintenance & vendors',
    text: 'Tenant requests flow straight to your vendor directory — assigned, tracked, resolved.',
    icon: '🛠️',
  },
  {
    n: '05',
    title: 'Move-in photo vault',
    text: 'Tenants snap flat condition in a time-boxed window — the fair way to settle deposit disputes.',
    icon: '📸',
  },
  {
    n: '06',
    title: 'Explore & discovery',
    text: 'Every vacant flat becomes a listing — photos, amenities, suited-for tags and price.',
    icon: '🔍',
  },
] as const;

const STORY_STEPS = [
  {
    title: 'Plant the address',
    text: 'Create the property, add the tower — floors, photos, amenities. Your portfolio takes root in minutes.',
  },
  {
    title: 'Open the floors',
    text: 'Add flats with beds, baths, rent and sale price. Every vacant flat auto-lists to Explore for seekers.',
  },
  {
    title: 'Welcome tenants home',
    text: 'Assign leases by phone number. Checklists track agreement, KYC, deposit, keys and move-in photos.',
  },
  {
    title: 'Let the rent flow',
    text: 'Receipts go out, payments come in — even partial ones. The dashboard stays green, owners stay in the loop.',
  },
] as const;

const ROLES = {
  MANAGER: {
    label: 'Property manager',
    headline: 'Run the whole portfolio from one sunlit dashboard',
    points: [
      'Portfolio dashboard — occupancy, collections and vacants in real time',
      'Add towers and flats with photos; they list to Explore instantly',
      'Record rent with partial payments, receipts and dues',
      'Route maintenance to approved vendors and track turnaround',
    ],
    stat: { big: '94%', label: 'portfolio occupancy' },
  },
  TENANT: {
    label: 'Tenant',
    headline: 'A rental portal that feels like home',
    points: [
      'See your lease, rent and dues — nothing buried in chat threads',
      'Time-boxed move-in photo vault protects your deposit',
      'Raise maintenance requests and watch live status',
      'Keep documents like KYC safely attached to your tenancy',
    ],
    stat: { big: '53h', label: 'move-in photo window' },
  },
  OWNER: {
    label: 'Owner',
    headline: 'Your homes, transparent at last',
    points: [
      'See every property a manager runs on your behalf',
      'Tenant roster with documents on file across the portfolio',
      'Financial statements — collected vs outstanding per property',
      'Occupancy reports without asking anyone for a spreadsheet',
    ],
    stat: { big: '₹8.2L', label: 'collected this month' },
  },
} as const;

type RoleKey = keyof typeof ROLES;

const TESTIMONIALS = [
  { q: 'RentFlow brought everything together — a single source of truth for our entire portfolio.', a: 'Portfolio manager · 200+ units' },
  { q: 'The move-in photo vault ended our deposit arguments overnight.', a: 'Building owner · Powai' },
  { q: 'Raised a leaking-tap request at 9 am, resolved in two days. No phone calls.', a: 'Tenant · Riverside Apartments' },
  { q: 'Partial payments used to be a spreadsheet nightmare. Now it is one click.', a: 'Manager · Vadodara' },
  { q: 'My owner finally stopped calling me for occupancy numbers. He just looks.', a: 'Manager · Mumbai' },
  { q: 'Listed a vacant 2BHK at noon, three enquiries by evening via Explore.', a: 'Owner · Bengaluru' },
] as const;

const FAQS = [
  {
    q: 'What can I manage with RentFlow?',
    a: 'Everything a rental portfolio needs: properties, buildings and individual flats, tenants and leases, rent receipts and expenses, maintenance requests, vendors, and an Explore catalogue of vacant flats.',
  },
  {
    q: 'Does it work for both renting and selling?',
    a: 'Yes. Each flat carries a listing type — rent only, sale only, or both — with monthly rent and sale price shown wherever the flat appears.',
  },
  {
    q: 'How do tenants use it?',
    a: 'Tenants get their own portal: lease details and checklists, receipts and bills, maintenance requests with live status, document storage, and the time-boxed move-in photo vault.',
  },
  {
    q: 'What is the move-in photo vault?',
    a: 'After key handover a countdown window opens during which tenants photograph the flat’s condition. The photos are locked to the lease — impartial evidence if a deposit dispute ever comes up.',
  },
  {
    q: 'Can I try it right now?',
    a: 'Yes — the sign-in page has one-click demo roles for Manager, Tenant and Owner so you can explore every side of the product without creating an account.',
  },
] as const;

/* Towers: x/z ground position, w/d footprint, h height, balconies rows */
const TOWERS = [
  { x: -6, z: -10, w: 104, d: 96, h: 264, hue: 'a', balconies: 4 },
  { x: 128, z: 48, w: 78, d: 72, h: 176, hue: 'b', balconies: 3 },
  { x: -132, z: 62, w: 74, d: 70, h: 138, hue: 'c', balconies: 2 },
  { x: 118, z: -102, w: 66, d: 62, h: 108, hue: 'b', balconies: 2 },
] as const;

const TREES = [
  { x: -196, z: -20, s: 1.15 },
  { x: -70, z: 118, s: 0.95 },
  { x: 66, z: 128, s: 1.2 },
  { x: 196, z: -36, s: 0.9 },
  { x: 10, z: -158, s: 1.05 },
  { x: -160, z: -128, s: 0.85 },
] as const;

/* ================================================================== */
/* Utilities                                                           */
/* ================================================================== */

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  return (
    <motion.div
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.34);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const glare = useTransform(
    [gx, gy],
    ([px, py]: number[]) =>
      `radial-gradient(360px circle at ${px}% ${py}%, rgba(255,255,255,0.55), transparent 60%)`,
  );

  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 14);
        rx.set((0.5 - py) * 12);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.span className={styles.tiltGlare} style={{ background: glare }} aria-hidden />
      {children}
    </motion.div>
  );
}

/* ================================================================== */
/* Navbar                                                              */
/* ================================================================== */

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <motion.span className={styles.scrollProgress} style={{ scaleX: bar }} aria-hidden />
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>RF</span>
          RentFlow
        </Link>
        <nav className={styles.navLinks}>
          <a href="#story">The journey</a>
          <a href="#features">Features</a>
          <a href="#roles">Who it’s for</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className={styles.navCtas}>
          {isAuthenticated ? (
            <Link href="/dashboard" className={styles.btnPrimary}>
              Open dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnGhost}>
                Sign in
              </Link>
              <Link href="/signup" className={styles.btnPrimary}>
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/* Hero — sunlit residential 3D neighbourhood                          */
/* ================================================================== */

function IsoTree({ x, z, s }: { x: number; z: number; s: number }) {
  return (
    <div className={styles.towerPos} style={{ transform: `translate3d(${x}px, 0px, ${z}px)` }}>
      <div className={styles.tree} style={{ transform: `scale(${s})` }}>
        <span className={styles.treePlane}>
          <i className={styles.foliage} />
          <i className={styles.trunk} />
        </span>
        <span className={`${styles.treePlane} ${styles.treePlaneCross}`}>
          <i className={styles.foliage} />
          <i className={styles.trunk} />
        </span>
      </div>
    </div>
  );
}

function IsoTower({ t, index }: { t: (typeof TOWERS)[number]; index: number }) {
  return (
    <div
      className={styles.towerPos}
      style={{ transform: `translate3d(${t.x - t.w / 2}px, 0px, ${t.z}px)` }}
    >
      <motion.div
        className={`${styles.tower} ${styles[`hue_${t.hue}`]}`}
        style={{ width: t.w, height: t.h }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.35 + index * 0.16, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.faceFront} style={{ transform: `translateZ(${t.d / 2}px)` }}>
          <span className={styles.faceGlass} />
          {Array.from({ length: t.balconies }).map((_, i) => (
            <span
              key={i}
              className={styles.balcony}
              style={{ top: `${16 + i * (68 / t.balconies)}%` }}
            >
              <i className={styles.balconyPlant} />
              <i className={styles.balconyPlant2} />
            </span>
          ))}
          <span className={styles.doorway} />
        </div>
        <div
          className={styles.faceBack}
          style={{ transform: `translateZ(${-t.d / 2}px) rotateY(180deg)` }}
        />
        <div
          className={styles.faceSide}
          style={{
            width: t.d,
            left: '50%',
            marginLeft: -t.d / 2,
            transform: `rotateY(-90deg) translateZ(${t.w / 2}px)`,
          }}
        >
          <span className={styles.faceGlass} />
        </div>
        <div
          className={styles.faceSide}
          style={{
            width: t.d,
            left: '50%',
            marginLeft: -t.d / 2,
            transform: `rotateY(90deg) translateZ(${t.w / 2}px)`,
          }}
        />
        <div
          className={styles.faceTop}
          style={{
            height: t.d,
            top: '50%',
            marginTop: -t.d / 2,
            transform: `rotateX(90deg) translateZ(${t.h / 2}px)`,
          }}
        >
          <span className={styles.roofGarden} />
          <span className={styles.roofBush} style={{ left: '16%', top: '22%' }} />
          <span className={styles.roofBush} style={{ right: '20%', top: '55%' }} />
          <span className={styles.roofBush} style={{ left: '42%', bottom: '14%' }} />
        </div>
      </motion.div>
    </div>
  );
}

function IsoCity() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-18, -34]), { stiffness: 90, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-30, -50]), { stiffness: 90, damping: 20 });

  return (
    <div
      className={styles.isoScene}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className={styles.isoShadow} aria-hidden />
      <motion.div className={styles.isoWorld} style={{ rotateX: rotX, rotateY: rotY }}>
        <div className={styles.ground}>
          <div className={styles.groundPark} />
          <div className={styles.groundPath} />
          <div className={styles.groundPond} />
        </div>
        {TOWERS.map((t, i) => (
          <IsoTower key={i} t={t} index={i} />
        ))}
        {TREES.map((t, i) => (
          <IsoTree key={i} {...t} />
        ))}
      </motion.div>

      <motion.div
        className={`${styles.floatChip} ${styles.chipA}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
      >
        <span className={styles.chipCheck}>✓</span> Rent received — Flat 4B
      </motion.div>
      <motion.div
        className={`${styles.floatChip} ${styles.chipB}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        🌿 Rooftop garden — Tower A
      </motion.div>
      <motion.div
        className={`${styles.floatChip} ${styles.chipC}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.7 }}
      >
        📸 Move-in photos locked
      </motion.div>
    </div>
  );
}

function ActivityTicker() {
  const [head, setHead] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHead((h) => (h + 1) % ACTIVITY.length), 2800);
    return () => clearInterval(id);
  }, []);
  const item = ACTIVITY[head];

  return (
    <div className={styles.ticker}>
      <span className={styles.liveDot} />
      <motion.span
        key={head}
        className={styles.tickerText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <b>{item.text}</b> · {item.meta}
      </motion.span>
    </div>
  );
}

function Hero() {
  const { isAuthenticated } = useAuth();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const cityY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cloudX1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const cloudX2 = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const headline = 'Space to live.';

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.sun} />
      <motion.div className={`${styles.cloud} ${styles.cloud1}`} style={{ x: cloudX1 }} />
      <motion.div className={`${styles.cloud} ${styles.cloud2}`} style={{ x: cloudX2 }} />
      <motion.div className={`${styles.cloud} ${styles.cloud3}`} style={{ x: cloudX1 }} />
      <div className={styles.heroHaze} />

      <div className={styles.heroInner}>
        <motion.div className={styles.heroCopy} style={{ y: copyY, opacity: fade }}>
          <motion.div
            className={styles.pill}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.pillDot} />
            Homes, not just houses
          </motion.div>

          <h1 className={styles.h1} aria-label={`${headline} Rent, in flow.`}>
            {headline.split('').map((ch, i) => (
              <motion.span
                key={i}
                className={ch === ' ' ? styles.h1Space : styles.h1Char}
                initial={{ opacity: 0, y: 46, rotateX: -70 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.15 + i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
            <br />
            <motion.span
              className={styles.h1Green}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Rent, in flow.
            </motion.span>
          </h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
          >
            One green, calm workspace for buildings, flats, tenants, leases and every rupee of rent
            — so managing homes feels as good as living in them.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <MagneticLink
              href={isAuthenticated ? '/dashboard' : '/signup'}
              className={styles.btnHero}
            >
              {isAuthenticated ? 'Open your dashboard' : 'Start managing free'}
            </MagneticLink>
            <MagneticLink href="/login" className={styles.btnHeroGhost}>
              Explore the live demo
            </MagneticLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.8 }}
          >
            <ActivityTicker />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: cityY }}>
          <IsoCity />
        </motion.div>
      </div>

      <motion.div className={styles.scrollHint} style={{ opacity: fade }}>
        <span className={styles.mouse}>
          <span className={styles.mouseWheel} />
        </span>
        Scroll — watch the neighbourhood grow
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* Scrollytelling — a home comes to life                               */
/* ================================================================== */

const FLOOR_COUNT = 8;

function StoryFloor({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const t0 = 0.06 + index * 0.06;
  const opacity = useTransform(progress, [t0, t0 + 0.05], [0, 1]);
  const y = useTransform(progress, [t0, t0 + 0.05], [-46, 0]);
  const isPent = index === FLOOR_COUNT - 1;

  return (
    <motion.div
      className={`${styles.floor} ${isPent ? styles.floorPent : ''}`}
      style={{ opacity, y }}
    >
      <span className={styles.floorTop} />
      <span className={styles.floorSide} />
      <span className={styles.floorWindows}>
        {Array.from({ length: 5 }).map((_, i) => (
          <i key={i} style={{ animationDelay: `${(index * 5 + i) * 0.6}s` }} />
        ))}
      </span>
      <span className={styles.floorRail}>
        <i /><i /><i />
      </span>
    </motion.div>
  );
}

function RentParticles({ active }: { active: boolean }) {
  return (
    <div className={`${styles.rentRain} ${active ? styles.rentRainOn : ''}`} aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 0.5}s` }}>
          ₹
        </span>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <b key={i} style={{ left: `${18 + i * 20}%`, animationDelay: `${0.8 + i * 0.9}s` }}>
          🍃
        </b>
      ))}
    </div>
  );
}

function BuildStory() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(STORY_STEPS.length - 1, Math.floor(v * 1.28 * STORY_STEPS.length)));
  });

  const treeScale = useTransform(progress, [0.04, 0.62], [0.25, 1]);
  const treeScaleR = useTransform(progress, [0.12, 0.7], [0.2, 0.82]);
  const sunX = useTransform(progress, [0, 0.8], [-60, 60]);
  const sunY = useTransform(progress, [0, 0.4, 0.8], [40, -14, 6]);

  return (
    <section className={styles.story} id="story" ref={ref}>
      <div className={styles.storySticky}>
        <div className={styles.storyInner}>
          <div className={styles.storyCopy}>
            <p className={styles.kicker}>The journey</p>
            <h2 className={styles.h2}>
              Watch a home
              <br />
              come to life
            </h2>
            <div className={styles.storySteps}>
              {STORY_STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className={`${styles.storyStep} ${i === step ? styles.storyStepActive : ''} ${i < step ? styles.storyStepDone : ''}`}
                >
                  <span className={styles.storyStepDot}>{i < step ? '✓' : i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.storyVisual}>
            <motion.div className={styles.storySun} style={{ x: sunX, y: sunY }} />
            <RentParticles active={step >= 3} />

            <motion.div
              className={`${styles.storyTree} ${styles.storyTreeL}`}
              style={{ scale: treeScale }}
            >
              <i className={styles.foliageBig} />
              <i className={styles.trunkBig} />
            </motion.div>
            <motion.div
              className={`${styles.storyTree} ${styles.storyTreeR}`}
              style={{ scale: treeScaleR }}
            >
              <i className={styles.foliageBig} />
              <i className={styles.trunkBig} />
            </motion.div>

            <div className={styles.storyTower}>
              {Array.from({ length: FLOOR_COUNT }).map((_, i) => (
                <StoryFloor key={i} progress={progress} index={FLOOR_COUNT - 1 - i} />
              ))}
              <div className={styles.storyBase}>
                <i /><i /><i />
              </div>
            </div>

            <div className={styles.storyHill} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Horizontal feature street                                           */
/* ================================================================== */

function FeatureStreet() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], ['4%', '-64%']);

  return (
    <section className={styles.street} id="features" ref={ref}>
      <div className={styles.streetSticky}>
        <div className={styles.streetHead}>
          <p className={styles.kicker}>Everything under one roof</p>
          <h2 className={styles.h2}>Take a walk down the garden street</h2>
        </div>
        <motion.div className={styles.streetTrack} style={{ x }}>
          {FEATURES.map((f) => (
            <TiltCard key={f.n} className={styles.streetCard}>
              <span className={styles.streetNum}>{f.n}</span>
              <span className={styles.streetIcon}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </TiltCard>
          ))}
          <div className={styles.streetEnd}>
            <h3>…and it’s all live in the demo</h3>
            <MagneticLink href="/login" className={styles.btnHero}>
              Try it now →
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Stats band                                                          */
/* ================================================================== */

function Stat({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const n = useCountUp(value, start);
  return (
    <div className={styles.bandStat}>
      <strong>
        {n.toLocaleString('en-IN')}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function StatsBand() {
  const [seen, setSeen] = useState(false);
  return (
    <motion.section
      className={styles.band}
      onViewportEnter={() => setSeen(true)}
      viewport={{ amount: 0.4 }}
    >
      <div className={styles.bandInner}>
        <Stat value={1200} suffix="+" label="Flats under management" start={seen} />
        <Stat value={98} suffix="%" label="On-time rent collection" start={seen} />
        <Stat value={2} suffix=" days" label="Avg. maintenance turnaround" start={seen} />
        <Stat value={12000} suffix="+" label="Move-in photos secured" start={seen} />
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/* Roles                                                               */
/* ================================================================== */

function RolesSection() {
  const [role, setRole] = useState<RoleKey>('MANAGER');
  const active = ROLES[role];

  return (
    <section className={styles.section} id="roles">
      <FadeUp>
        <p className={styles.kicker}>Who it’s for</p>
        <h2 className={styles.h2}>One roof. Three very different views.</h2>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className={styles.roleTabs} role="tablist" aria-label="Choose a role">
          {(Object.keys(ROLES) as RoleKey[]).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={role === key}
              className={`${styles.roleTab} ${role === key ? styles.roleTabActive : ''}`}
              onClick={() => setRole(key)}
            >
              {ROLES[key].label}
            </button>
          ))}
        </div>

        <motion.div
          className={styles.rolePanel}
          key={role}
          initial={{ opacity: 0, scale: 0.97, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.roleCopy}>
            <h3>{active.headline}</h3>
            <ul>
              {active.points.map((p) => (
                <li key={p}>
                  <span className={styles.tick}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/login" className={styles.roleCta}>
              Try the {active.label.toLowerCase()} demo →
            </Link>
          </div>
          <div className={styles.roleVisual}>
            <TiltCard className={styles.roleStatCard}>
              <strong>{active.stat.big}</strong>
              <span>{active.stat.label}</span>
              <div className={styles.roleSpark}>
                {[38, 52, 44, 66, 58, 84, 72, 90].map((h, i) => (
                  <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }} />
                ))}
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </FadeUp>
    </section>
  );
}

/* ================================================================== */
/* Quotes marquee                                                      */
/* ================================================================== */

function QuoteMarquee() {
  const rows = [TESTIMONIALS.slice(0, 3), TESTIMONIALS.slice(3)];
  return (
    <section className={styles.quotes}>
      <FadeUp>
        <p className={styles.kicker}>Loved on every side of the lease</p>
        <h2 className={styles.h2}>Word travels between floors</h2>
      </FadeUp>
      <div className={styles.quoteRows}>
        {rows.map((row, r) => (
          <div key={r} className={`${styles.quoteRow} ${r === 1 ? styles.quoteRowRev : ''}`}>
            <div className={styles.quoteTrack}>
              {[...row, ...row, ...row].map((t, i) => (
                <figure key={i} className={styles.quoteCard}>
                  <blockquote>“{t.q}”</blockquote>
                  <figcaption>{t.a}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/* FAQ / CTA / Footer                                                  */
/* ================================================================== */

function Faq() {
  return (
    <section className={`${styles.section} ${styles.sectionNarrow}`} id="faq">
      <FadeUp>
        <p className={styles.kicker}>FAQ</p>
        <h2 className={styles.h2}>Questions, answered</h2>
      </FadeUp>
      <div className={styles.faqList}>
        {FAQS.map((f, i) => (
          <FadeUp key={f.q} delay={i * 0.06}>
            <details className={styles.faqItem}>
              <summary>
                {f.q}
                <span className={styles.faqChevron}>▾</span>
              </summary>
              <p>{f.a}</p>
            </details>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className={styles.ctaBand}>
      <div className={styles.ctaSun} />
      <div className={styles.ctaLeaves} aria-hidden>
        <span>🌿</span><span>🍃</span><span>🌿</span>
      </div>
      <FadeUp>
        <h2>Ready to give your portfolio room to breathe?</h2>
        <p>Free to start. One-click demo roles if you just want to look around first.</p>
        <div className={styles.ctaBtns}>
          <MagneticLink href="/signup" className={styles.btnHeroInverse}>
            Create your workspace
          </MagneticLink>
          <MagneticLink href="/login" className={styles.btnHeroOutline}>
            Sign in
          </MagneticLink>
        </div>
      </FadeUp>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.logoFooter}>
            <span className={styles.logoMark}>RF</span>
            RentFlow
          </span>
          <p>The calm, green operating system for rental portfolios.</p>
        </div>
        <div className={styles.footerCols}>
          <div>
            <h4>Product</h4>
            <a href="#story">The journey</a>
            <a href="#features">Features</a>
            <a href="#roles">Who it’s for</a>
          </div>
          <div>
            <h4>Get started</h4>
            <Link href="/signup">Create account</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/login">Demo roles</Link>
          </div>
          <div>
            <h4>Workspace</h4>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/dashboard/explore">Explore flats</Link>
            <Link href="/admin/login">Admin access</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBar}>
        <span>© {year} RentFlow. Built for landlords, loved by tenants.</span>
        <span className={styles.footerMade}>Made with ♥ in India</span>
      </div>
    </footer>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export function HomeLanding() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Hero />
      <BuildStory />
      <FeatureStreet />
      <StatsBand />
      <RolesSection />
      <QuoteMarquee />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}
