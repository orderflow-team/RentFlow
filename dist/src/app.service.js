"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let AppService = AppService_1 = class AppService {
    prisma;
    logger = new common_1.Logger(AppService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const health = await this.getHealth();
        try {
            const [companyCount, userCount, propertyCount, buildingCount, unitCount, tenantCount, ownerCount,] = await Promise.all([
                this.prisma.company.count({ where: { deletedAt: null } }),
                this.prisma.user.count({ where: { deletedAt: null } }),
                this.prisma.property.count({ where: { deletedAt: null } }),
                this.prisma.building.count({ where: { deletedAt: null } }),
                this.prisma.unit.count({ where: { deletedAt: null } }),
                this.prisma.tenant.count({ where: { deletedAt: null } }),
                this.prisma.owner.count({ where: { deletedAt: null } }),
            ]);
            const activeUnits = await this.prisma.unit.count({
                where: { deletedAt: null, status: 'OCCUPIED' },
            });
            const vacantUnits = unitCount - activeUnits;
            const fmtUptime = (s) => { var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return d > 0 ? d + 'd ' + h + 'h' : h > 0 ? h + 'h ' + m + 'm' : m + 'm'; };
            return {
                status: 'running',
                name: 'RentFlow Platform',
                version: '0.1.0',
                environment: process.env.NODE_ENV || 'development',
                uptime: process.uptime(),
                uptimeStr: fmtUptime(process.uptime()),
                timestamp: new Date().toISOString(),
                now: new Date(),
                database: health.database,
                stats: {
                    companies: companyCount,
                    users: userCount,
                    properties: propertyCount,
                    buildings: buildingCount,
                    units: { total: unitCount, occupied: activeUnits, vacant: vacantUnits },
                    tenants: tenantCount,
                    owners: ownerCount,
                },
                modules: [
                    { name: 'Auth', version: '1.0', status: 'active', endpoints: 5 },
                    { name: 'Users', version: '1.0', status: 'active', endpoints: 5 },
                    { name: 'Companies', version: '1.0', status: 'active', endpoints: 2 },
                    { name: 'Properties', version: '1.0', status: 'active', endpoints: 14 },
                    { name: 'Tenants', version: '1.0', status: 'active', endpoints: 5 },
                    { name: 'Owners', version: '1.0', status: 'active', endpoints: 5 },
                    { name: 'Leases', version: '1.0', status: 'active', endpoints: 5 },
                    { name: 'Finance', version: '1.0', status: 'active', endpoints: 8 },
                    { name: 'Maintenance', version: '1.0', status: 'active', endpoints: 9 },
                    { name: 'Reports', version: '1.0', status: 'active', endpoints: 4 },
                ],
            };
        }
        catch (error) {
            this.logger.error('Dashboard data fetch failed', error);
            return {
                status: 'degraded',
                name: 'RentFlow Platform',
                version: '0.1.0',
                environment: process.env.NODE_ENV || 'development',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                now: new Date(),
                database: health.database,
                stats: null,
                modules: [],
            };
        }
    }
    async getHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime(),
            };
        }
        catch (error) {
            this.logger.error('Health check failed', error);
            return {
                status: 'degraded',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                uptime: process.uptime(),
            };
        }
    }
    esc(str) {
        return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
    }
    getLandingPage(dashboard) {
        const { status, environment: env, version: ver, database: db, uptimeStr, now, stats } = dashboard;
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RentFlow — Property Management Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;650;700;800&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      background:#faf6f1;color:#18181b;line-height:1.6;
      -webkit-font-smoothing:antialiased;
      scrollbar-width:thin;scrollbar-color:#e2d5c4 transparent
    }
    ::-webkit-scrollbar{width:10px;height:10px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#e2d5c4;border-radius:100px;border:2px solid #faf6f1}
    ::-webkit-scrollbar-thumb:hover{background:#cbb794}
    .warm-bg{background:#faf6f1!important}

    /* === Navigation === */
    nav{
      position:fixed;top:0;left:0;right:0;z-index:100;
      background:rgba(255,255,255,0.8);backdrop-filter:blur(20px);
      border-bottom:1px solid rgba(228,228,231,0.6)
    }
    nav .inner{
      max-width:1200px;margin:0 auto;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 2rem;height:64px
    }
    nav .brand{
      display:flex;align-items:center;gap:0.625rem;
      font-weight:650;font-size:1.05rem;color:#18181b;
      text-decoration:none;letter-spacing:-0.01em
    }
    nav .brand-icon{
      width:30px;height:30px;border-radius:7px;
      background:#18181b;
      display:flex;align-items:center;justify-content:center;
      font-size:0.75rem;font-weight:700;color:white
    }
    nav .links{display:flex;align-items:center;gap:2rem}
    nav .links a{
      text-decoration:none;color:#71717a;font-size:0.875rem;font-weight:500;
      transition:color .15s;position:relative
    }
    nav .links a::after{
      content:'';position:absolute;bottom:-4px;left:0;right:0;
      height:1.5px;background:#18181b;border-radius:1px;
      transform:scaleX(0);transition:transform .2s
    }
    nav .links a:hover{color:#18181b}
    nav .links a:hover::after{transform:scaleX(1)}
    .nav-btn{
      padding:.4rem .85rem;border-radius:6px;
      background:#b45309;color:white!important;font-weight:550!important;
      text-decoration:none;font-size:.82rem;transition:all .15s
    }
    .nav-btn:hover{background:#92400e!important;color:white!important}
    .nav-btn::after{display:none!important}
    .status-pill{
      display:inline-flex;align-items:center;gap:.35rem;
      padding:.3rem .7rem;border-radius:100px;
      font-size:.73rem;font-weight:500;
      background:#f4f4f5;color:#52525b;border:1px solid #e4e4e7
    }
    .status-dot{width:5px;height:5px;border-radius:50%;background:#22c55e}
    .status-pill.degraded .status-dot{background:#eab308}

    /* === Hero === */
    .hero{
      padding:9rem 2rem 6rem;text-align:center;
      position:relative;overflow:hidden;
      background:#ffffff
    }
    .hero-bg{
      position:absolute;inset:0;pointer-events:none;
      background-image:radial-gradient(circle,#e4e4e7 0.5px,transparent 0.5px);
      background-size:20px 20px;opacity:0.35
    }
    .hero-bg-glow{
      position:absolute;top:-30%;left:50%;transform:translateX(-50%);
      width:700px;height:700px;
      background:radial-gradient(circle,rgba(180,83,9,0.05) 0%,transparent 70%);
      pointer-events:none
    }
    .hero-building{
      position:absolute;bottom:0;left:50%;transform:translateX(-50%);
      width:600px;height:120px;pointer-events:none;opacity:.04;
      background:linear-gradient(180deg,transparent,rgba(180,83,9,.08));
      mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 200'%3E%3Cpath d='M0 200V80l40-30 40 30v120h80V50l60-40 60 40v150h80V30l60-20 60 20v170h80V60l50-35 50 35v140h80V90l40-25 40 25v110h80V120l30-15 30 15v80H0z' fill='%23b45309'/%3E%3C/svg%3E");
      mask-size:600px 120px;mask-repeat:no-repeat;
      -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 200'%3E%3Cpath d='M0 200V80l40-30 40 30v120h80V50l60-40 60 40v150h80V30l60-20 60 20v170h80V60l50-35 50 35v140h80V90l40-25 40 25v110h80V120l30-15 30 15v80H0z' fill='%23b45309'/%3E%3C/svg%3E");
      -webkit-mask-size:600px 120px;-webkit-mask-repeat:no-repeat
    }
    .hero h1{
      font-size:clamp(2.25rem,5vw,3.75rem);
      font-weight:700;line-height:1.12;
      letter-spacing:-0.035em;color:#18181b;
      max-width:780px;margin:0 auto 1.25rem;
      position:relative
    }
    .hero h1 .accent{
      color:#b45309
    }
    .hero p{
      font-size:1.125rem;color:#71717a;
      max-width:540px;margin:0 auto 2.5rem;
      line-height:1.7;position:relative
    }
    .hero-actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;position:relative}
    .btn{
      display:inline-flex;align-items:center;gap:.5rem;
      padding:.7rem 1.35rem;border-radius:8px;
      font-size:.875rem;font-weight:550;text-decoration:none;
      transition:all .15s;cursor:pointer
    }
    .btn-primary{
      background:#18181b;color:white;
      box-shadow:0 1px 3px rgba(0,0,0,.08)
    }
    .btn-primary:hover{
      background:#27272a;transform:translateY(-1px);
      box-shadow:0 4px 12px rgba(0,0,0,.1)
    }
    .btn-secondary{
      background:#ffffff;color:#18181b;
      border:1px solid #e4e4e7
    }
    .btn-secondary:hover{
      border-color:#d4d4d8;background:#fafafa
    }
    .btn-ghost{
      background:transparent;color:#71717a;border:none
    }
    .btn-ghost:hover{
      color:#18181b;background:#f4f4f5
    }
    .btn:active{transform:scale(.96)!important;transition-duration:.08s}
    .hero-tag{
      display:inline-flex;align-items:center;gap:.375rem;
      padding:.25rem .65rem;border-radius:100px;
      font-size:.75rem;font-weight:500;color:#52525b;
      background:#f4f4f5;border:1px solid #e4e4e7;
      margin-bottom:2rem;position:relative
    }
    .hero-tag span{color:#b45309}

    /* === Metrics Strip === */
    .metrics{
      max-width:1200px;margin:-1.75rem auto 0;padding:0 2rem;
      position:relative;z-index:10
    }
    .metrics-inner{
      background:#ffffff;border:1px solid #e4e4e7;
      border-radius:12px;padding:1.25rem 2rem;
      display:flex;gap:2.5rem;flex-wrap:wrap;align-items:center;
      box-shadow:0 1px 3px rgba(0,0,0,.04)
    }
    .metrics-inner .item{display:flex;align-items:center;gap:.5rem}
    .metrics-inner .label{font-size:.78rem;color:#a1a1aa;font-weight:450}
    .metrics-inner .value{font-size:.82rem;color:#18181b;font-weight:600}
    .metrics-inner .divider{width:1px;height:22px;background:#e4e4e7}

    /* === Sections === */
    .section{padding:5rem 2rem}
    .section-inner{max-width:1200px;margin:0 auto}
    .section-header{margin-bottom:3.5rem;max-width:640px}
    .section-header.center{text-align:center;margin-left:auto;margin-right:auto}
    .section-header .overline{
      font-size:.73rem;font-weight:600;text-transform:uppercase;
      letter-spacing:.06em;color:#b45309;margin-bottom:.75rem
    }
    .section-header h2{
      font-size:clamp(1.5rem,3vw,2.25rem);
      font-weight:650;line-height:1.2;
      letter-spacing:-0.025em;color:#18181b
    }
    .section-header p{
      font-size:1rem;color:#71717a;margin-top:.75rem;line-height:1.7
    }
    .section-alt{background:#ffffff}

    /* === Features Showcase === */
    .showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem 4rem}
    .showcase-item{
      display:flex;gap:1rem;padding:1.5rem;
      border-radius:10px;transition:all .2s;
      margin:-1.5rem;padding:1.5rem
    }
    .showcase-item:hover{background:#fafafa}
    .showcase-icon{
      width:46px;height:46px;border-radius:11px;
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;color:#b45309;
      background:linear-gradient(135deg,#fef3e8,#fde5c8);
      box-shadow:inset 0 0 0 1px rgba(180,83,9,.12)
    }
    .showcase-text h3{
      font-size:.95rem;font-weight:600;color:#18181b;
      margin-bottom:.25rem
    }
    .showcase-text p{
      font-size:.85rem;color:#71717a;line-height:1.6;
      max-width:400px
    }

    /* === Stats === */
    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
      gap:.75rem
    }
    .stat-card{
      background:#ffffff;border:1px solid #ececef;
      border-radius:12px;padding:1.5rem 1.25rem;
      text-align:center;transition:transform .18s,box-shadow .18s,border-color .18s;
      box-shadow:0 1px 2px rgba(24,24,27,.04)
    }
    .stat-card:hover{
      border-color:#d4d4d8;
      box-shadow:0 10px 24px rgba(24,24,27,.08);
      transform:translateY(-2px)
    }
    .stat-number{
      font-size:2rem;font-weight:700;color:#18181b;line-height:1;
      letter-spacing:-0.02em
    }
    .stat-label{font-size:.78rem;color:#71717a;margin-top:.4rem;font-weight:500}
    .stat-sub{font-size:.7rem;color:#a1a1aa;margin-top:.2rem}
    .stat-sub .occupied{color:#16a34a;font-weight:550}
    .stat-sub .vacant{color:#d97706;font-weight:550}

    /* === Card Grid === */
    .card-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
      gap:.75rem
    }
    .card{
      background:#ffffff;border:1px solid #e4e4e7;
      border-radius:10px;padding:1.5rem;
      transition:all .2s
    }
    .card:hover{
      border-color:#d4d4d8;
      box-shadow:0 2px 8px rgba(0,0,0,.04)
    }
    .card-icon{
      width:36px;height:36px;border-radius:8px;
      display:flex;align-items:center;justify-content:center;
      font-size:1rem;margin-bottom:.75rem;
      border:1px solid #e4e4e7;background:#ffffff
    }
    .card-name{font-weight:600;font-size:.9rem;color:#18181b;margin-bottom:.25rem}
    .card-desc{font-size:.8rem;color:#71717a;line-height:1.55}
    .card-meta{font-size:.7rem;color:#a1a1aa;margin-top:.5rem}

    /* === Process === */
    .process-grid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:3rem;position:relative
    }
    .process-grid::before{
      content:'';position:absolute;top:44px;left:calc(16.66% + 1.5rem);
      right:calc(16.66% + 1.5rem);height:1px;
      background:linear-gradient(90deg,#e4e4e7,transparent);
      z-index:0
    }
    .process-step{position:relative}
    .process-icon{
      width:48px;height:48px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:1.1rem;margin-bottom:1rem;
      background:#ffffff;border:1.5px solid #e4e4e7;
      position:relative;z-index:1
    }
    .process-step h3{
      font-size:.95rem;font-weight:600;color:#18181b;
      margin-bottom:.35rem
    }
    .process-step p{
      font-size:.85rem;color:#71717a;line-height:1.6
    }

    /* === Footer === */
    footer{
      text-align:center;padding:3rem 2rem;
      border-top:1px solid #e4e4e7;color:#a1a1aa;
      font-size:.82rem
    }
    footer .f-links{
      display:flex;justify-content:center;gap:2rem;
      margin-bottom:1rem
    }
    footer a{color:#71717a;text-decoration:none;transition:color .15s}
    footer a:hover{color:#18181b}

    /* === Animations === */
    .fade-in{
      opacity:0;transform:translateY(20px);
      transition:opacity .5s ease,transform .5s ease
    }
    .fade-in.visible{opacity:1;transform:translateY(0)}
    .no-js .fade-in{opacity:1!important;transform:none!important}

    /* === Responsive === */
    @media(max-width:900px){
      .showcase-grid{grid-template-columns:1fr;gap:1.5rem}
      .process-grid{grid-template-columns:1fr;gap:2rem}
      .process-grid::before{display:none}
    }
    @media(max-width:640px){
      .hero{padding:7rem 1.5rem 4rem}
      nav .inner{padding:0 1.25rem}
      nav .links{gap:.6rem}
      nav .links a[href="#features"],nav .links a[href="#stats"],nav .status-pill{display:none}
      .metrics-inner{gap:1rem;padding:1rem 1.25rem}
      .metrics-inner .divider:last-child{display:none}
    }
  </style>
</head>
<body>
  <nav>
    <div class="inner">
      <a href="/" class="brand">
        <span class="brand-icon">RF</span>
        RentFlow
      </a>
      <div class="links">
        <a href="#features">Features</a>
        <a href="#stats">Overview</a>
        <a href="/login">Sign in</a>
        <a href="/signup" class="nav-btn">Get started</a>
        <span class="status-pill${dashboard.status !== 'running' ? ' degraded' : ''}">
          <span class="status-dot"></span>
          ${status === 'running' ? 'Online' : 'Issues'}
        </span>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-bg-glow"></div>
    <div class="hero-tag">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>Live</span> &middot; Platform operational
    </div>
    <h1>
      Your properties deserve<br>
      <span class="accent">better management.</span>
    </h1>
    <p>
      RentFlow helps landlords and property managers automate leases, track
      maintenance, collect rent, and keep every unit occupied — all from
      one dashboard.
    </p>
    <div class="hero-actions">
      <a href="/signup" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        Create free account
      </a>
      <a href="/login" class="btn btn-secondary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
        Sign in
      </a>
      <a href="#features" class="btn btn-ghost">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        Explore
      </a>
    </div>
    <div class="hero-building"></div>
  </section>

  <!-- Metrics -->
  <div class="metrics">
    <div class="metrics-inner">
      <div class="item">
        <span class="label">Environment</span>
        <span class="value">${env}</span>
      </div>
      <div class="divider"></div>
      <div class="item">
        <span class="label">Version</span>
        <span class="value">v${ver}</span>
      </div>
      <div class="divider"></div>
      <div class="item">
        <span class="label">Database</span>
        <span class="value">${db === 'connected' ? 'Connected' : 'Disconnected'}</span>
      </div>
      <div class="divider"></div>
      <div class="item">
        <span class="label">Uptime</span>
        <span class="value">${uptimeStr}</span>
      </div>
      <div class="divider"></div>
      <div class="item">
        <span class="label">Updated</span>
        <span class="value">${now.toLocaleTimeString()}</span>
      </div>
    </div>
  </div>

  <!-- Features Showcase -->
  <section class="section" id="features">
    <div class="section-inner">
      <div class="section-header">
        <div class="overline">Core platform</div>
        <h2>Built for landlords, not developers</h2>
        <p>RentFlow handles the day-to-day work of managing rental properties — leases, maintenance, rent collection, and reporting — so you can focus on growing your portfolio.</p>
      </div>
      <div class="showcase-grid">
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <div class="showcase-text">
            <h3>Properties &amp; Buildings</h3>
            <p>Organize your portfolio with a clear property-to-building-to-unit hierarchy. Each level has its own details, documents, and status tracking.</p>
          </div>
        </div>
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <div class="showcase-text">
            <h3>Tenants &amp; Leases</h3>
            <p>Digital lease contracts with automated rent schedules, renewal reminders, and late fee calculations. Every tenant has a complete profile.</p>
          </div>
        </div>
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9.5a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5h-1a2.5 2.5 0 0 1-2.5-2.5"/><line x1="12" y1="5" x2="12" y2="19"/></svg></div>
          <div class="showcase-text">
            <h3>Rent &amp; Finances</h3>
            <p>Generate invoices automatically, record payments, track expenses by property, and see your collection rates — all in real time.</p>
          </div>
        </div>
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
          <div class="showcase-text">
            <h3>Maintenance &amp; Vendors</h3>
            <p>Log maintenance requests with priority levels, assign work orders to vendors, and track the full lifecycle from report to completion.</p>
          </div>
        </div>
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
          <div class="showcase-text">
            <h3>Reports &amp; Analytics</h3>
            <p>Live dashboards for occupancy rates, revenue trends, expense breakdowns, and maintenance KPIs — so you always know where things stand.</p>
          </div>
        </div>
        <div class="showcase-item fade-in">
          <div class="showcase-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="showcase-text">
            <h3>Team Access &amp; Roles</h3>
            <p>Invite your team with role-based permissions. Property managers, accountants, and owners each see exactly what they need — nothing more.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Live Stats -->
  ${stats ? `
  <section class="section section-alt" id="stats">
    <div class="section-inner">
      <div class="section-header center">
        <div class="overline">Live data</div>
        <h2>Platform overview</h2>
        <p>Real-time metrics from across your portfolio.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-number">${stats.companies || 0}</div><div class="stat-label">Companies</div></div>
        <div class="stat-card"><div class="stat-number">${stats.users || 0}</div><div class="stat-label">Users</div></div>
        <div class="stat-card"><div class="stat-number">${stats.properties || 0}</div><div class="stat-label">Properties</div></div>
        <div class="stat-card"><div class="stat-number">${stats.buildings || 0}</div><div class="stat-label">Buildings</div></div>
        <div class="stat-card"><div class="stat-number">${stats.units ? stats.units.total : 0}</div><div class="stat-label">Units</div><div class="stat-sub"><span class="occupied">${stats.units ? stats.units.occupied : 0} occupied</span> &middot; <span class="vacant">${stats.units ? stats.units.vacant : 0} vacant</span></div></div>
        <div class="stat-card"><div class="stat-number">${stats.tenants || 0}</div><div class="stat-label">Tenants</div></div>
        <div class="stat-card"><div class="stat-number">${stats.owners || 0}</div><div class="stat-label">Owners</div></div>
      </div>
    </div>
  </section>` : ''}

  <footer>
    <div class="f-links">
      <a href="#features">Features</a>
      <a href="#stats">Overview</a>
      <a href="/login">Sign in</a>
      <a href="/signup">Get started</a>
    </div>
    <div>&copy; ${now.getFullYear()} RentFlow. All rights reserved.</div>
  </footer>
</body>
</html>`;
    }
    getAdminLoginPage() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — RentFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;650;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Inter',-apple-system,sans-serif;
      background:#0a0a0b;color:#fafafa;line-height:1.6;
      -webkit-font-smoothing:antialiased;
      min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;
      padding:2rem
    }
    .admin-bg{
      position:fixed;inset:0;pointer-events:none;
      background-image:radial-gradient(circle,rgba(255,255,255,.06) 0.5px,transparent 0.5px);
      background-size:24px 24px
    }
    .admin-wrap{position:relative;z-index:1;width:100%;max-width:400px}
    .admin-header{text-align:center;margin-bottom:2.5rem}
    .admin-header .shield{
      width:48px;height:48px;border-radius:12px;
      background:#27272a;border:1px solid #3f3f46;
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 1rem;color:#818cf8
    }
    .admin-header h1{font-size:1.35rem;font-weight:650;letter-spacing:-0.02em}
    .admin-header p{color:#a1a1aa;font-size:.85rem;margin-top:.25rem}
    .card{
      background:#18181b;border:1px solid #27272a;
      border-radius:12px;padding:2rem;
      box-shadow:0 20px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.03)
    }
    .field{margin-bottom:1.25rem}
    .field label{display:block;font-size:.82rem;font-weight:500;color:#a1a1aa;margin-bottom:.35rem}
    .field input{
      width:100%;padding:.65rem .75rem;border-radius:8px;
      border:1px solid #3f3f46;font-size:.9rem;font-family:inherit;
      background:#27272a;color:#fafafa;
      transition:border-color .15s;outline:none
    }
    .field input:focus{border-color:#6366f1}
    .field input::placeholder{color:#52525b}
    .error-msg{
      font-size:.78rem;color:#ef4444;display:none;
      background:rgba(239,68,68,.1);padding:.5rem .75rem;border-radius:6px;
      margin-bottom:1rem;border:1px solid rgba(239,68,68,.2)
    }
    .error-msg.show{display:block}
    .btn-submit{
      width:100%;padding:.7rem;border-radius:8px;
      background:#6366f1;color:white;font-size:.875rem;font-weight:550;
      border:none;cursor:pointer;transition:all .15s;
      font-family:inherit
    }
    .btn-submit:hover{background:#4f46e5}
    .btn-submit:disabled{opacity:.5;cursor:not-allowed}
    .footer-links{text-align:center;margin-top:1.5rem;font-size:.82rem}
    .footer-links a{color:#71717a;text-decoration:none;transition:color .15s}
    .footer-links a:hover{color:#a1a1aa}
    .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .6s linear;vertical-align:middle;margin-right:.35rem}
    @keyframes spin{to{transform:rotate(360deg)}}
    .demo-creds{
      margin-top:1.5rem;padding:.75rem;border-radius:8px;
      background:#27272a;border:1px solid #3f3f46;font-size:.78rem;color:#a1a1aa
    }
    .demo-creds strong{color:#fafafa}
    @media(min-width:768px){.brand-side{display:flex}}
  </style>
</head>
<body>
<div class="admin-bg"></div>
<div class="admin-wrap">
  <div class="admin-header">
    <div class="shield"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
    <h1>Admin access</h1>
    <p>Sign in with your admin credentials</p>
  </div>

  <div class="card">
    <div class="error-msg" id="adminError"></div>
    <form id="adminForm">
      <div class="field">
        <label for="adminEmail">Email address</label>
        <input type="email" id="adminEmail" placeholder="admin@company.com" required autocomplete="email">
      </div>
      <div class="field">
        <label for="adminPassword">Password</label>
        <input type="password" id="adminPassword" placeholder="Enter admin password" required autocomplete="current-password">
      </div>
      <button type="submit" class="btn-submit" id="adminBtn">Sign in as admin</button>
    </form>

    <div class="demo-creds" style="margin-top: 1.5rem; text-align: left; padding: 1rem; background: #27272a; border: 1px solid #3f3f46; border-radius: 8px;">
      <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.8rem; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Auto-fill Demo Credentials</strong>
      <div>
        <a href="#" onclick="fillCreds('admin@demo.local', 'Demo@1234'); return false;" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; background: #18181b; border: 1px solid #3f3f46; border-radius: 4px; color: #fafafa; text-decoration: none; font-weight: 500; transition: all 0.15s; display: inline-block;">Admin Role</a>
      </div>
    </div>
  </div>

  <div class="footer-links">
    <a href="/login">&larr; Back to user login</a>
  </div>
</div>

<script>
  (function() {
    var form = document.getElementById('adminForm');
    var email = document.getElementById('adminEmail');
    var password = document.getElementById('adminPassword');
    var btn = document.getElementById('adminBtn');
    var err = document.getElementById('adminError');

    window.fillCreds = function(e, p) {
      email.value = e;
      password.value = p;
    };

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Signing in...';

      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      })
      .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(res.data.message || 'Invalid credentials');
        }
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        window.location.href = '/dashboard';
      })
      .catch(function(error) {
        err.textContent = error.message;
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Sign in as admin';
      });
    });
  })();
</script>
</body>
</html>`;
    }
    getLoginPage() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in — RentFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;650;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Inter',-apple-system,sans-serif;
      background:#0a0a0b;color:#fafafa;line-height:1.6;
      -webkit-font-smoothing:antialiased;
      min-height:100vh;display:flex;flex-direction:column;
    }
    .check-grid-bg{
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
      background-size: 32px 32px;
      background-color: #0b0814;
    }
    .check-grid-glow{
      position:absolute;top:50%;left:20%;transform:translateY(-50%);
      width:800px;height:800px;
      background:radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 60%);
      pointer-events:none;z-index:0;
    }
    .page-wrap{display:flex;min-height:100vh;position:relative;z-index:1}
    .brand-side{
      display:none;flex:1;
      background:transparent;color:white;
      padding:4rem;flex-direction:column;justify-content:space-between
    }
    .brand-side .logo{font-weight:700;font-size:1.5rem;letter-spacing:-0.02em}
    .brand-side .quote{font-size:1.1rem;color:#d4d4d8;max-width:380px;line-height:1.7}
    .brand-side .author{font-size:.9rem;color:#a1a1aa;margin-top:.75rem}
    .form-side{
      flex:1;display:flex;align-items:center;justify-content:center;
      padding:2rem;background:transparent;
    }
    .form-wrap{
      width:100%;max-width:420px;
      background:#ffffff;color:#18181b;
      padding:2.5rem;border-radius:16px;
      box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .form-wrap .rf-logo{
      display:inline-flex;align-items:center;gap:.5rem;
      font-weight:700;font-size:1rem;color:#18181b;
      text-decoration:none;margin-bottom:1.5rem
    }
    .rf-logo .mark{
      width:28px;height:28px;border-radius:6px;
      background:#6366f1;color:white;
      display:flex;align-items:center;justify-content:center;
      font-size:.65rem;font-weight:700
    }
    h1{font-size:1.6rem;font-weight:650;letter-spacing:-0.02em;margin-bottom:.35rem;color:#18181b}
    .sub{color:#71717a;font-size:.875rem;margin-bottom:2rem}
    .sub a{color:#6366f1;font-weight:550;text-decoration:none}
    .sub a:hover{text-decoration:underline}
    .field{margin-bottom:1.25rem}
    .field label{display:block;font-size:.82rem;font-weight:500;color:#52525b;margin-bottom:.35rem}
    .field input{
      width:100%;padding:.7rem .85rem;border-radius:8px;
      border:1px solid #e4e4e7;font-size:.9rem;font-family:inherit;
      background:#fafafa;transition:border-color .15s,box-shadow .15s;
      outline:none;color:#18181b;
    }
    .field input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15);background:#ffffff}
    .field input.error{border-color:#ef4444}
    .error-msg{
      font-size:.8rem;color:#ef4444;display:none;
      background:#fef2f2;padding:.6rem .85rem;border-radius:8px;
      margin-bottom:1.25rem;border:1px solid #fecaca
    }
    .error-msg.show{display:block}
    .btn-submit{
      width:100%;padding:.75rem;border-radius:8px;
      background:#6366f1;color:white;font-size:.9rem;font-weight:550;
      border:none;cursor:pointer;transition:all .15s;
      font-family:inherit;margin-top:.5rem;
    }
    .btn-submit:hover{background:#4f46e5;transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.2)}
    .btn-submit:active{transform:translateY(0)}
    .btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
    .footer-text{text-align:center;margin-top:2rem;font-size:.82rem;color:#a1a1aa}
    .footer-text a{color:#71717a;text-decoration:none;transition:color .15s}
    .footer-text a:hover{color:#18181b}
    .success-msg{
      font-size:.82rem;color:#16a34a;display:none;
      background:#f0fdf4;padding:.6rem .85rem;border-radius:8px;
      margin-bottom:1.25rem;border:1px solid #bbf7d0
    }
    .success-msg.show{display:block}
    .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .6s linear;vertical-align:middle;margin-right:.4rem}
    @keyframes spin{to{transform:rotate(360deg)}}
    .demo-creds{
      margin-top:1.5rem;padding:1rem;border-radius:8px;
      background:#fafafa;border:1px solid #e4e4e7;font-size:.8rem;color:#52525b
    }
    .demo-creds strong{color:#18181b}
    @media(min-width:768px){.brand-side{display:flex}}
    .glass-card{
    .graphic-wrapper{position:relative;width:100%;max-width:440px;margin:0 auto}
    .glass-card-main{
      background:rgba(30,30,36,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      border:1px solid rgba(255,255,255,0.06);border-radius:20px;
      padding:1.75rem;box-shadow:0 30px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.1);
      position:relative;z-index:2
    }
    .gc-header{display:flex;align-items:center;gap:.5rem;font-size:.75rem;font-weight:700;letter-spacing:.05em;color:#a1a1aa;text-transform:uppercase;margin-bottom:1.5rem}
    .gc-dot{width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 10px #10b981}
    .gc-stats{display:flex;gap:2.5rem;margin-bottom:2rem}
    .gc-stat .val{font-size:1.6rem;font-weight:700;color:#ffffff;line-height:1.2}
    .gc-stat .lbl{font-size:.8rem;color:#a1a1aa;margin-top:.25rem}
    .gc-bars{display:flex;align-items:flex-end;gap:.5rem;height:60px;width:100%}
    .gc-bar{flex:1;background:linear-gradient(180deg,#6366f1 0%,rgba(99,102,241,0.2) 100%);border-radius:4px;opacity:0.7;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2)}
    .gc-bar:nth-child(1){height:30%}
    .gc-bar:nth-child(2){height:45%}
    .gc-bar:nth-child(3){height:35%}
    .gc-bar:nth-child(4){height:60%}
    .gc-bar:nth-child(5){height:50%}
    .gc-bar.active{height:90%;opacity:1;background:linear-gradient(180deg,#a855f7 0%,#6366f1 100%);box-shadow:0 0 20px rgba(168,85,247,0.4),inset 0 1px 0 rgba(255,255,255,0.4)}
    .gc-bar:nth-child(7){height:65%}
    .float-pill{
      position:absolute;background:rgba(30,30,36,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,0.08);border-radius:100px;
      padding:.6rem 1.2rem;display:flex;align-items:center;gap:.6rem;
      font-size:.85rem;font-weight:500;color:#e4e4e7;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:3
    }
    .float-pill.left{bottom:-20px;left:-20px}
    .float-pill.right{bottom:-80px;right:-20px}
  </style>
</head>
<body>
<div class="check-grid-bg"><div class="check-grid-glow"></div></div>
<div class="page-wrap">
  <div class="brand-side" style="justify-content:center">
    <div class="graphic-wrapper">
      <div class="glass-card-main">
        <div class="gc-header">
          <div class="gc-dot"></div>
          PORTFOLIO OVERVIEW
        </div>
        <div class="gc-stats">
          <div class="gc-stat"><div class="val">94%</div><div class="lbl">Occupancy</div></div>
          <div class="gc-stat"><div class="val">₹8.2L</div><div class="lbl">Collected</div></div>
          <div class="gc-stat"><div class="val">212</div><div class="lbl">Units</div></div>
        </div>
        <div class="gc-bars">
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar active"></div>
          <div class="gc-bar"></div>
        </div>
      </div>
      
      <div class="float-pill left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Rent received — Unit 4B
      </div>
      
      <div class="float-pill right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fb923c" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        Maintenance resolved in 2 days
      </div>
    </div>
  </div>
  <div class="form-side">
    <div class="form-wrap">
      <a href="/" class="rf-logo"><span class="mark">RF</span> RentFlow</a>
      <h1>Welcome back</h1>
      <p class="sub">Sign in to your account &middot; <a href="/signup">Create one</a></p>

      <div class="error-msg" id="loginError"></div>

      <div style="display:flex;gap:1.5rem;margin-bottom:1.25rem;border-bottom:1px solid #e4e4e7">
        <a href="#" id="tabPassword" onclick="switchLoginMethod('password'); return false;" style="padding-bottom:.6rem;font-size:.85rem;font-weight:600;color:#18181b;text-decoration:none;border-bottom:2px solid #18181b">Password</a>
        <a href="#" id="tabOtp" onclick="switchLoginMethod('otp'); return false;" style="padding-bottom:.6rem;font-size:.85rem;font-weight:600;color:#a1a1aa;text-decoration:none;border-bottom:2px solid transparent">Phone / OTP</a>
      </div>

      <form id="loginForm">
        <div class="field">
          <label for="email">Email address</label>
          <input type="email" id="email" placeholder="you@company.com" required autocomplete="email">
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn-submit" id="submitBtn">Sign in</button>
      </form>

      <div id="otpMethod" style="display:none">
        <form id="otpPhoneForm">
          <div class="field">
            <label for="otpPhone">Mobile number</label>
            <input type="tel" id="otpPhone" placeholder="+91 98765 43210" required autocomplete="tel">
          </div>
          <button type="submit" class="btn-submit" id="otpSendBtn">Send OTP</button>
        </form>

        <form id="otpCodeForm" style="display:none">
          <p style="font-size:.82rem;color:#71717a;margin-bottom:1rem" id="otpSentTo"></p>
          <div class="field">
            <label for="otpCode">6-digit code</label>
            <input type="text" id="otpCode" inputmode="numeric" maxlength="6" placeholder="123456" required autocomplete="one-time-code">
          </div>
          <button type="submit" class="btn-submit" id="otpVerifyBtn">Verify &amp; sign in</button>
          <div style="text-align:center;margin-top:1rem">
            <a href="#" onclick="resetOtpForm(); return false;" style="font-size:.8rem;color:#71717a;text-decoration:none">&larr; Use a different number</a>
          </div>
        </form>
      </div>

      ${process.env.NODE_ENV !== 'production' ? `
      <div class="demo-creds" style="margin-top: 1.5rem; text-align: left; padding: 1rem; background: #faf6f1; border: 1px solid #e4e4e7; border-radius: 8px;">
        <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em;">Auto-fill Demo Roles</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <a href="#" onclick="fillCreds('manager@demo.local', 'Demo@1234'); return false;" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; background: white; border: 1px solid #e4e4e7; border-radius: 4px; color: #18181b; text-decoration: none; font-weight: 500; transition: all 0.15s; display: inline-block;">Manager</a>
          <a href="#" onclick="fillCreds('accountant@demo.local', 'Demo@1234'); return false;" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; background: white; border: 1px solid #e4e4e7; border-radius: 4px; color: #18181b; text-decoration: none; font-weight: 500; transition: all 0.15s; display: inline-block;">Accountant</a>
          <a href="#" onclick="fillCreds('tenant@demo.local', 'Demo@1234'); return false;" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; background: white; border: 1px solid #e4e4e7; border-radius: 4px; color: #18181b; text-decoration: none; font-weight: 500; transition: all 0.15s; display: inline-block;">Tenant</a>
          <a href="#" onclick="fillCreds('owner@demo.local', 'Demo@1234'); return false;" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; background: white; border: 1px solid #e4e4e7; border-radius: 4px; color: #18181b; text-decoration: none; font-weight: 500; transition: all 0.15s; display: inline-block;">Owner</a>
        </div>
      </div>
      ` : ''}

      <div class="footer-text">
        <a href="/admin/login">Admin access</a>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    var form = document.getElementById('loginForm');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var btn = document.getElementById('submitBtn');
    var err = document.getElementById('loginError');

    window.fillCreds = function(e, p) {
      email.value = e;
      password.value = p;
    };

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Signing in...';

      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      })
      .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(res.data.message || 'Invalid email or password');
        }
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        window.location.href = '/dashboard';
      })
      .catch(function(error) {
        err.textContent = error.message;
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Sign in';
      });
    });

    /* ── OTP login ────────────────────────────────────────── */
    var tabPassword = document.getElementById('tabPassword');
    var tabOtp = document.getElementById('tabOtp');
    var otpMethodEl = document.getElementById('otpMethod');
    var otpPhoneForm = document.getElementById('otpPhoneForm');
    var otpCodeForm = document.getElementById('otpCodeForm');
    var otpPhoneInput = document.getElementById('otpPhone');
    var otpCodeInput = document.getElementById('otpCode');
    var otpSendBtn = document.getElementById('otpSendBtn');
    var otpVerifyBtn = document.getElementById('otpVerifyBtn');
    var otpSentTo = document.getElementById('otpSentTo');

    function errorText(data, fallback) {
      if (data && data.message) { return Array.isArray(data.message) ? data.message[0] : data.message; }
      return fallback;
    }

    window.switchLoginMethod = function(method) {
      err.classList.remove('show');
      var isOtp = method === 'otp';
      form.style.display = isOtp ? 'none' : '';
      otpMethodEl.style.display = isOtp ? '' : 'none';
      tabOtp.style.color = isOtp ? '#18181b' : '#a1a1aa';
      tabOtp.style.borderBottomColor = isOtp ? '#18181b' : 'transparent';
      tabPassword.style.color = isOtp ? '#a1a1aa' : '#18181b';
      tabPassword.style.borderBottomColor = isOtp ? 'transparent' : '#18181b';
    };

    window.resetOtpForm = function() {
      otpCodeForm.style.display = 'none';
      otpPhoneForm.style.display = '';
      otpCodeInput.value = '';
      err.classList.remove('show');
    };

    otpPhoneForm.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show');
      otpSendBtn.disabled = true;
      otpSendBtn.innerHTML = '<span class="spinner"></span>Sending...';

      fetch('/api/v1/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhoneInput.value.trim() })
      })
      .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
      .then(function(res) {
        otpSendBtn.disabled = false;
        otpSendBtn.textContent = 'Send OTP';
        if (!res.ok) { throw new Error(errorText(res.data, 'Could not send OTP')); }
        otpSentTo.textContent = 'Code sent to ' + otpPhoneInput.value.trim() + '.';
        otpPhoneForm.style.display = 'none';
        otpCodeForm.style.display = '';
        otpCodeInput.focus();
      })
      .catch(function(error) {
        otpSendBtn.disabled = false;
        otpSendBtn.textContent = 'Send OTP';
        err.textContent = error.message;
        err.classList.add('show');
      });
    });

    otpCodeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show');
      otpVerifyBtn.disabled = true;
      otpVerifyBtn.innerHTML = '<span class="spinner"></span>Verifying...';

      fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhoneInput.value.trim(), code: otpCodeInput.value.trim() })
      })
      .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
      .then(function(res) {
        if (!res.ok) { throw new Error(errorText(res.data, 'Invalid or expired code')); }
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        window.location.href = '/dashboard';
      })
      .catch(function(error) {
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.textContent = 'Verify & sign in';
        err.textContent = error.message;
        err.classList.add('show');
      });
    });
  })();
</script>
</body>
</html>`;
    }
    getSignupPage() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create account — RentFlow</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;650;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Inter',-apple-system,sans-serif;
      background:#0a0a0b;color:#fafafa;line-height:1.6;
      -webkit-font-smoothing:antialiased;
      min-height:100vh;display:flex;flex-direction:column;
    }
    .check-grid-bg{
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
      background-size: 32px 32px;
      background-color: #0b0814;
    }
    .check-grid-glow{
      position:absolute;top:50%;left:20%;transform:translateY(-50%);
      width:800px;height:800px;
      background:radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 60%);
      pointer-events:none;z-index:0;
    }
    .page-wrap{display:flex;min-height:100vh;position:relative;z-index:1}
    .brand-side{
      display:none;flex:1;
      background:transparent;color:white;
      padding:4rem;flex-direction:column;justify-content:space-between
    }
    .brand-side .logo{font-weight:700;font-size:1.5rem;letter-spacing:-0.02em}
    .brand-side .quote{font-size:1.1rem;color:#d4d4d8;max-width:380px;line-height:1.7}
    .brand-side .author{font-size:.9rem;color:#a1a1aa;margin-top:.75rem}
    .form-side{
      flex:1;display:flex;align-items:center;justify-content:center;
      padding:2rem;background:transparent;
    }
    .form-wrap{
      width:100%;max-width:420px;
      background:#ffffff;color:#18181b;
      padding:2.5rem;border-radius:16px;
      box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .form-wrap .rf-logo{
      display:inline-flex;align-items:center;gap:.5rem;
      font-weight:700;font-size:1rem;color:#18181b;
      text-decoration:none;margin-bottom:1.5rem
    }
    .rf-logo .mark{
      width:28px;height:28px;border-radius:6px;
      background:#6366f1;color:white;
      display:flex;align-items:center;justify-content:center;
      font-size:.65rem;font-weight:700
    }
    h1{font-size:1.6rem;font-weight:650;letter-spacing:-0.02em;margin-bottom:.35rem;color:#18181b}
    .sub{color:#71717a;font-size:.875rem;margin-bottom:2rem}
    .sub a{color:#6366f1;font-weight:550;text-decoration:none}
    .sub a:hover{text-decoration:underline}
    .name-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .field{margin-bottom:1.25rem}
    .field label{display:block;font-size:.82rem;font-weight:500;color:#52525b;margin-bottom:.35rem}
    .field input, .field select{
      width:100%;padding:.7rem .85rem;border-radius:8px;
      border:1px solid #e4e4e7;font-size:.9rem;font-family:inherit;
      background:#fafafa;transition:border-color .15s,box-shadow .15s;
      outline:none;color:#18181b;
    }
    .field input:focus, .field select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15);background:#ffffff}
    .field input.error, .field select.error{border-color:#ef4444}
    .error-msg{
      font-size:.8rem;color:#ef4444;display:none;
      background:#fef2f2;padding:.6rem .85rem;border-radius:8px;
      margin-bottom:1.25rem;border:1px solid #fecaca
    }
    .error-msg.show{display:block}
    .btn-submit{
      width:100%;padding:.75rem;border-radius:8px;
      background:#6366f1;color:white;font-size:.9rem;font-weight:550;
      border:none;cursor:pointer;transition:all .15s;
      font-family:inherit;margin-top:.5rem;
    }
    .btn-submit:hover{background:#4f46e5;transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.2)}
    .btn-submit:active{transform:translateY(0)}
    .btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
    .footer-text{text-align:center;margin-top:2rem;font-size:.82rem;color:#a1a1aa}
    .footer-text a{color:#71717a;text-decoration:none;transition:color .15s}
    .footer-text a:hover{color:#18181b}
    .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .6s linear;vertical-align:middle;margin-right:.35rem}
    @keyframes spin{to{transform:rotate(360deg)}}
    @media(min-width:768px){.brand-side{display:flex}}
    .graphic-wrapper{position:relative;width:100%;max-width:440px;margin:0 auto}
    .glass-card-main{
      background:rgba(30,30,36,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      border:1px solid rgba(255,255,255,0.06);border-radius:20px;
      padding:1.75rem;box-shadow:0 30px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.1);
      position:relative;z-index:2
    }
    .gc-header{display:flex;align-items:center;gap:.5rem;font-size:.75rem;font-weight:700;letter-spacing:.05em;color:#a1a1aa;text-transform:uppercase;margin-bottom:1.5rem}
    .gc-dot{width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 10px #10b981}
    .gc-stats{display:flex;gap:2.5rem;margin-bottom:2rem}
    .gc-stat .val{font-size:1.6rem;font-weight:700;color:#ffffff;line-height:1.2}
    .gc-stat .lbl{font-size:.8rem;color:#a1a1aa;margin-top:.25rem}
    .gc-bars{display:flex;align-items:flex-end;gap:.5rem;height:60px;width:100%}
    .gc-bar{flex:1;background:linear-gradient(180deg,#6366f1 0%,rgba(99,102,241,0.2) 100%);border-radius:4px;opacity:0.7;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2)}
    .gc-bar:nth-child(1){height:30%}
    .gc-bar:nth-child(2){height:45%}
    .gc-bar:nth-child(3){height:35%}
    .gc-bar:nth-child(4){height:60%}
    .gc-bar:nth-child(5){height:50%}
    .gc-bar.active{height:90%;opacity:1;background:linear-gradient(180deg,#a855f7 0%,#6366f1 100%);box-shadow:0 0 20px rgba(168,85,247,0.4),inset 0 1px 0 rgba(255,255,255,0.4)}
    .gc-bar:nth-child(7){height:65%}
    .float-pill{
      position:absolute;background:rgba(30,30,36,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,0.08);border-radius:100px;
      padding:.6rem 1.2rem;display:flex;align-items:center;gap:.6rem;
      font-size:.85rem;font-weight:500;color:#e4e4e7;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:3
    }
    .float-pill.left{bottom:-20px;left:-20px}
    .float-pill.right{bottom:-80px;right:-20px}
  </style>
</head>
<body>
<div class="check-grid-bg"><div class="check-grid-glow"></div></div>
<div class="page-wrap">
  <div class="brand-side" style="justify-content:center">
    <div class="graphic-wrapper">
      <div class="glass-card-main">
        <div class="gc-header">
          <div class="gc-dot"></div>
          PORTFOLIO OVERVIEW
        </div>
        <div class="gc-stats">
          <div class="gc-stat"><div class="val">94%</div><div class="lbl">Occupancy</div></div>
          <div class="gc-stat"><div class="val">₹8.2L</div><div class="lbl">Collected</div></div>
          <div class="gc-stat"><div class="val">212</div><div class="lbl">Units</div></div>
        </div>
        <div class="gc-bars">
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar"></div>
          <div class="gc-bar active"></div>
          <div class="gc-bar"></div>
        </div>
      </div>
      
      <div class="float-pill left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Rent received — Unit 4B
      </div>
      
      <div class="float-pill right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fb923c" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        Maintenance resolved in 2 days
      </div>
    </div>
  </div>
  <div class="form-side">
    <div class="form-wrap">
      <a href="/" class="rf-logo"><span class="mark">RF</span> RentFlow</a>
      <h1>Create your account</h1>
      <p class="sub">Start managing your properties in minutes &middot; <a href="/login">Sign in</a></p>

      <div class="error-msg" id="signupError"></div>

      <form id="signupForm">
        <div class="name-row">
          <div class="field">
            <label for="firstName">First name</label>
            <input type="text" id="firstName" placeholder="John" required>
          </div>
          <div class="field">
            <label for="lastName">Last name</label>
            <input type="text" id="lastName" placeholder="Smith" required>
          </div>
        </div>
        <div class="field">
          <label for="companyName">Company name</label>
          <input type="text" id="companyName" placeholder="Acme Properties LLC" required>
        </div>
        <div class="field">
          <label for="signupEmail">Email address</label>
          <input type="email" id="signupEmail" placeholder="you@company.com" required autocomplete="email">
        </div>
        <div class="field">
          <label for="signupPassword">Password</label>
          <input type="password" id="signupPassword" placeholder="At least 8 characters" required minlength="8" autocomplete="new-password">
        </div>
        <button type="submit" class="btn-submit" id="signupBtn">Create account</button>
      </form>

      <div class="footer-text">
        By creating an account, you agree to our terms and privacy policy.
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    var form = document.getElementById('signupForm');
    var fn = document.getElementById('firstName');
    var ln = document.getElementById('lastName');
    var cn = document.getElementById('companyName');
    var em = document.getElementById('signupEmail');
    var pw = document.getElementById('signupPassword');
    var btn = document.getElementById('signupBtn');
    var err = document.getElementById('signupError');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      err.classList.remove('show');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Creating account...';

      fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn.value.trim(),
          lastName: ln.value.trim(),
          companyName: cn.value.trim(),
          email: em.value.trim(),
          password: pw.value
        })
      })
      .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(res.data.message || 'Registration failed');
        }
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        window.location.href = '/dashboard';
      })
      .catch(function(error) {
        err.textContent = error.message;
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Create account';
      });
    });
  })();
</script>
</body>
</html>`;
    }
    getDashboardPage() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — RentFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;650;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      font-family:'Inter',-apple-system,sans-serif;
      background:#f6f6f8;color:#18181b;line-height:1.5;
      -webkit-font-smoothing:antialiased;
      scrollbar-width:thin;scrollbar-color:#d4d4d8 transparent
    }
    ::-webkit-scrollbar{width:10px;height:10px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:100px;border:2px solid #f6f6f8}
    ::-webkit-scrollbar-thumb:hover{background:#a1a1aa}
    .sidebar ::-webkit-scrollbar-thumb{background:#3f3f46;border-color:#18181b}
    .sidebar ::-webkit-scrollbar-thumb:hover{background:#52525b}

    /* === Sidebar Layout === */
    .app-layout{display:flex;min-height:100vh}
    .sidebar{
      width:220px;background:#18181b;color:#fff;
      display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100
    }
    .sidebar .brand{
      display:flex;align-items:center;gap:.55rem;
      padding:1rem 1.25rem;font-weight:650;font-size:.95rem;
      border-bottom:1px solid #27272a;text-decoration:none;color:#fff
    }
    .sidebar .brand .m{
      width:26px;height:26px;border-radius:6px;
      background:#fff;color:#18181b;
      display:flex;align-items:center;justify-content:center;
      font-size:.6rem;font-weight:700
    }
    .sidebar .nav-items{flex:1;padding:.5rem;overflow-y:auto}
    .sidebar .nav-group{font-size:.68rem;color:#71717a;text-transform:uppercase;letter-spacing:.06em;padding:.75rem 1rem .35rem;font-weight:600}
    .sidebar .nav-item{
      display:flex;align-items:center;gap:.6rem;
      padding:.55rem .85rem;border-radius:7px;
      font-size:.82rem;color:#a1a1aa;cursor:pointer;
      transition:background .15s,color .15s,box-shadow .15s;text-decoration:none;margin-bottom:1px;
      position:relative
    }
    .sidebar .nav-item:hover{background:#27272a;color:#f4f4f5}
    .sidebar .nav-item:active{transform:scale(.97)}
    .sidebar .nav-item.active{
      background:linear-gradient(135deg,#c2650f,#a8480a);color:#fff;font-weight:550;
      box-shadow:0 2px 10px rgba(180,83,9,.4),inset 0 1px 0 rgba(255,255,255,.12)
    }
    .sidebar .nav-item .icon{display:flex;align-items:center;justify-content:center;width:20px;flex-shrink:0;opacity:.85}
    .sidebar .nav-item.active .icon,.sidebar .nav-item:hover .icon{opacity:1}
    .sidebar .user-section{
      padding:.75rem;border-top:1px solid #27272a
    }
    .sidebar .user-section .email{font-size:.75rem;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .sidebar .user-section .role{font-size:.7rem;color:#52525b;margin-top:2px}
    .sidebar .user-section .logout-btn{
      display:block;width:100%;margin-top:.4rem;padding:.35rem;
      border-radius:5px;background:transparent;color:#52525b;
      border:1px solid #27272a;font-size:.72rem;cursor:pointer;
      transition:all .12s;font-family:inherit;text-align:center
    }
    .sidebar .user-section .logout-btn:hover{background:#27272a;color:#ef4444;border-color:#3f3f46}

    /* === Main Content === */
    .main-content{margin-left:220px;flex:1;min-width:0;padding:2rem;max-width:1200px}
    .page-header{margin-bottom:1.5rem}
    .page-header h2{font-size:1.35rem;font-weight:650;letter-spacing:-0.02em}
    .page-header p{color:#71717a;font-size:.85rem;margin-top:.15rem}

    /* === Stats Grid === */
    .stats-grid{
      display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
      gap:.75rem;margin-bottom:2rem
    }
    .stat-card{
      background:#ffffff;border:1px solid #ececef;
      border-radius:12px;padding:1.25rem;transition:transform .18s,box-shadow .18s,border-color .18s;
      box-shadow:0 1px 2px rgba(24,24,27,.04)
    }
    .stat-card:hover{border-color:#d4d4d8;box-shadow:0 8px 20px rgba(24,24,27,.08);transform:translateY(-2px)}
    @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .stats-grid .stat-card{animation:cardIn .4s ease backwards}
    .stats-grid .stat-card:nth-child(1){animation-delay:.03s}
    .stats-grid .stat-card:nth-child(2){animation-delay:.08s}
    .stats-grid .stat-card:nth-child(3){animation-delay:.13s}
    .stats-grid .stat-card:nth-child(4){animation-delay:.18s}
    .stats-grid .stat-card:nth-child(5){animation-delay:.23s}
    .stats-grid .stat-card:nth-child(6){animation-delay:.28s}
    .stat-card .stat-num{font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-0.02em;color:#18181b}
    .stat-card .stat-lbl{font-size:.75rem;color:#71717a;margin-top:.35rem;font-weight:500}
    .stat-card .stat-sub{font-size:.68rem;color:#a1a1aa;margin-top:.15rem}
    .stat-card .stat-sub .good{color:#16a34a;font-weight:550}
    .stat-card .stat-sub .warn{color:#d97706;font-weight:550}

    /* === Sections === */
    .section-h{font-size:.95rem;font-weight:600;margin-bottom:.75rem;color:#18181b;display:flex;align-items:center;gap:.5rem}
    .section-h .count{font-size:.72rem;font-weight:500;color:#a1a1aa;background:#f4f4f5;padding:.1rem .45rem;border-radius:100px}

    /* === Card Grids === */
    .card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem;margin-bottom:2rem}
    .card{
      background:#ffffff;border:1px solid #ececef;
      border-radius:12px;padding:1.25rem;transition:transform .18s,box-shadow .18s,border-color .18s;
      box-shadow:0 1px 2px rgba(24,24,27,.04)
    }
    .card:hover{border-color:#d4d4d8;box-shadow:0 8px 20px rgba(24,24,27,.08);transform:translateY(-2px)}
    .prop-card { padding: 0; overflow: hidden; position: relative; height: 260px; }
    .prop-card img { width: 100%; height: 140px; object-fit: cover; display: block; }
    .prop-card-body { position: absolute; bottom: 0; left: 0; width: 100%; height: 120px; background: #ffffff; padding: 1.25rem; transition: height 0.3s ease; }
    .prop-card:hover .prop-card-body { height: 260px; }
    .card h4{font-size:.88rem;font-weight:600;margin-bottom:.35rem}
    .card p{font-size:.8rem;color:#71717a;line-height:1.5}
    .card .meta{font-size:.72rem;color:#a1a1aa;margin-top:.5rem}
    .card-hd{display:flex;align-items:center;gap:.65rem;margin-bottom:.6rem}
    .card-hd h4{margin-bottom:0}
    .card-badge{
      width:34px;height:34px;border-radius:9px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#fef3e8,#fde5c8);color:#b45309
    }
    .card-badge svg{width:16px;height:16px}
    .tag{
      display:inline-flex;align-items:center;gap:.35rem;font-size:.68rem;padding:.2rem .55rem;
      border-radius:100px;font-weight:600;margin-right:.3rem;letter-spacing:.02em
    }
    .tag::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
    .tag-green{background:#f0fdf4;color:#16a34a;box-shadow:inset 0 0 0 1px rgba(22,163,74,.15)}
    .tag-yellow{background:#fefce8;color:#ca8a04;box-shadow:inset 0 0 0 1px rgba(202,138,4,.15)}
    .tag-red{background:#fef2f2;color:#dc2626;box-shadow:inset 0 0 0 1px rgba(220,38,38,.15)}
    .tag-blue{background:#eff6ff;color:#2563eb;box-shadow:inset 0 0 0 1px rgba(37,99,235,.15)}
    .tag-gray{background:#f4f4f5;color:#52525b;box-shadow:inset 0 0 0 1px rgba(82,82,91,.12)}

    /* === Table === */
    .table-wrap{
      background:#ffffff;border:1px solid #ececef;
      border-radius:12px;margin-bottom:2rem;
      overflow-x:auto;-webkit-overflow-scrolling:touch;
      box-shadow:0 1px 2px rgba(24,24,27,.04)
    }
    table{width:100%;border-collapse:collapse;min-width:520px}
    th{
      text-align:left;padding:.7rem .85rem;
      font-size:.7rem;font-weight:650;color:#71717a;
      text-transform:uppercase;letter-spacing:.05em;
      background:#fafafa;border-bottom:1px solid #ececef
    }
    td{padding:.65rem .85rem;font-size:.82rem;border-bottom:1px solid #f4f4f5;color:#52525b}
    tr{transition:background .12s}
    tr:hover td{background:#fafafa}
    tr:last-child td{border-bottom:none}
    td .val{color:#18181b;font-weight:500}
    td .addr{font-size:.72rem;color:#a1a1aa}

    /* === Buttons === */
    .btn{
      display:inline-flex;align-items:center;gap:.4rem;
      padding:.55rem 1rem;border-radius:8px;
      font-size:.82rem;font-weight:550;border:none;
      cursor:pointer;transition:transform .12s,box-shadow .12s,background .12s,border-color .12s;font-family:inherit;
      text-decoration:none
    }
    .btn-primary{background:#18181b;color:white;box-shadow:0 1px 2px rgba(24,24,27,.15)}
    .btn-primary:hover{background:#27272a;transform:translateY(-1px);box-shadow:0 4px 12px rgba(24,24,27,.2)}
    .btn-secondary{background:#ffffff;color:#18181b;border:1px solid #e4e4e7}
    .btn-secondary:hover{background:#fafafa;border-color:#d4d4d8;transform:translateY(-1px)}
    .btn-sm{padding:.35rem .7rem;font-size:.75rem}
    .btn-xs{padding:.2rem .5rem;font-size:.68rem;border-radius:4px}
    .btn-row{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .btn-danger{background:#ef4444;color:white}
    .btn-danger:hover{background:#dc2626}
    .btn:active{transform:scale(.96)!important;transition-duration:.08s}

    /* === Modal === */
    .modal-overlay{
      display:none;position:fixed;inset:0;
      background:rgba(0,0,0,.4);z-index:200;
      align-items:center;justify-content:center;
      padding:2rem
    }
    .modal-overlay.open{display:flex;animation:overlayIn .18s ease}
    @keyframes overlayIn{from{opacity:0}to{opacity:1}}
    @keyframes modalIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    .modal{
      background:#ffffff;border-radius:12px;
      padding:1.5rem;width:100%;max-width:500px;
      max-height:80vh;overflow-y:auto;
      box-shadow:0 20px 60px rgba(0,0,0,.15);
      animation:modalIn .22s cubic-bezier(.2,.8,.2,1)
    }
    .modal h2{font-size:1.1rem;font-weight:600;margin-bottom:1rem}
    .modal .field{margin-bottom:.85rem}
    .modal .field label{display:block;font-size:.75rem;font-weight:500;color:#52525b;margin-bottom:.2rem}
    .modal .field input,.modal .field select,.modal .field textarea{
      width:100%;padding:.5rem .65rem;border-radius:6px;
      border:1px solid #e4e4e7;font-size:.82rem;font-family:inherit;
      outline:none;transition:border-color .15s;background:#fff
    }
    .modal .field input:focus,.modal .field select:focus,.modal .field textarea:focus{border-color:#18181b}
    .modal .field textarea{resize:vertical;min-height:50px}
    .modal .btn-row{margin-bottom:0;margin-top:1rem}

    /* === Loading === */
    .loading{text-align:center;padding:5rem 2rem;color:#a1a1aa}
    .loading .pulse{display:inline-block;width:36px;height:36px;border:3px solid #e4e4e7;border-top-color:#18181b;border-radius:50%;animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}

    /* === Filter bar === */
    .filter-bar{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;align-items:center}
    .filter-bar select,.filter-bar input{
      padding:.45rem .7rem;border-radius:7px;border:1px solid #e4e4e7;
      font-size:.78rem;font-family:inherit;background:#fff;outline:none;
      transition:border-color .15s,box-shadow .15s
    }
    .filter-bar select:hover,.filter-bar input:hover{border-color:#d4d4d8}
    .filter-bar select:focus,.filter-bar input:focus{border-color:#18181b;box-shadow:0 0 0 3px rgba(24,24,27,.06)}

    /* === Empty State === */
    .empty-state{text-align:center;padding:3rem 2rem;color:#a1a1aa}
    .empty-state .icon{display:flex;align-items:center;justify-content:center;margin:0 auto .75rem;opacity:.4}
    .empty-state p{font-size:.85rem}

    /* === Back Link === */
    .back-link{display:inline-flex;align-items:center;gap:.3rem;font-size:.78rem;color:#71717a;cursor:pointer;margin-bottom:.75rem;text-decoration:none}
    .back-link:hover{color:#18181b}

    /* === Toast === */
    .toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:300;display:flex;flex-direction:column;gap:.5rem;pointer-events:none}
    .toast-item{background:#18181b;color:#fff;padding:.65rem 1rem;border-radius:8px;font-size:.82rem;box-shadow:0 8px 24px rgba(0,0,0,.15);animation:toastIn .2s ease;pointer-events:auto;max-width:360px;line-height:1.4}
    .toast-item.success{background:#16a34a}
    .toast-item.error{background:#dc2626}
    .toast-item.info{background:#2563eb}
    @keyframes toastIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}

    /* === Confirm Dialog === */
    .confirm-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:250;align-items:center;justify-content:center;padding:2rem}
    .confirm-overlay.open{display:flex}
    .confirm-box{background:#fff;border-radius:12px;padding:1.5rem;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.15)}
    .confirm-box h3{font-size:1rem;font-weight:600;margin-bottom:.5rem}
    .confirm-box p{font-size:.82rem;color:#71717a;margin-bottom:1.25rem}
    .confirm-box .btn-row{display:flex;gap:.5rem;justify-content:flex-end}

    /* === Responsive === */
    .menu-btn{display:none}
    .sidebar-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99;opacity:0;transition:opacity .2s}
    .sidebar-backdrop.open{display:block;opacity:1}
    @media(max-width:768px){
      .menu-btn{
        display:flex;align-items:center;justify-content:center;
        position:fixed;top:.75rem;left:.75rem;z-index:101;
        width:36px;height:36px;border-radius:8px;
        background:#18181b;color:#fff;border:none;cursor:pointer;
        transition:transform .15s
      }
      .menu-btn:active{transform:scale(.92)}
      .menu-btn line{transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s;transform-origin:12px 12px}
      .menu-btn.open .mb-l1{transform:translateY(6px) rotate(45deg)}
      .menu-btn.open .mb-l2{opacity:0}
      .menu-btn.open .mb-l3{transform:translateY(-6px) rotate(-45deg)}
      .sidebar{
        transform:translateX(-100%);transition:transform .25s ease
      }
      .sidebar.open{transform:translateX(0);box-shadow:8px 0 24px rgba(0,0,0,.2)}
      .main-content{margin-left:0;padding:1rem;padding-top:3.75rem}
      .stats-grid{grid-template-columns:repeat(2,1fr)}

      /* === Tables → cards === */
      .table-wrap{overflow-x:visible;box-shadow:none;border:none;background:transparent;margin-bottom:1.5rem}
      .table-wrap table{min-width:0;width:100%}
      .table-wrap thead{display:none}
      .table-wrap tbody{display:flex;flex-direction:column;gap:.6rem}
      .table-wrap tr{
        display:block;background:#fff;border:1px solid #ececef;border-radius:12px;
        padding:0 1rem;box-shadow:0 1px 2px rgba(24,24,27,.04)
      }
      .table-wrap td{
        display:flex;align-items:center;justify-content:space-between;gap:1rem;
        padding:.55rem 0;border-bottom:1px solid #f4f4f5;
        font-size:.82rem;text-align:right;white-space:normal
      }
      .table-wrap tr td:last-child{border-bottom:none}
      .table-wrap td::before{
        content:attr(data-label);flex-shrink:0;
        font-size:.68rem;font-weight:650;color:#a1a1aa;
        text-transform:uppercase;letter-spacing:.05em;text-align:left
      }
      .table-wrap tr td:first-child{
        padding-top:.75rem;font-size:.92rem;font-weight:650;color:#18181b;justify-content:flex-start
      }
      .table-wrap tr td:first-child::before{display:none}
    }
  </style>
</head>
<body>
<div class="app-layout">
  <button class="menu-btn" id="menuBtn" onclick="toggleSidebar()" aria-label="Open menu">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line class="mb-l1" x1="3" y1="6" x2="21" y2="6"/><line class="mb-l2" x1="3" y1="12" x2="21" y2="12"/><line class="mb-l3" x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
  <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleSidebar(false)"></div>
  <!-- Sidebar -->
  <div class="sidebar" id="sidebar">
    <a href="/" class="brand"><span class="m">RF</span><span>RentFlow</span></a>
    <div class="nav-items" id="navItems">
      <div class="nav-group">Main</div>
      <div class="nav-item active" data-view="dashboard" onclick="showView('dashboard')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span><span>Dashboard</span></div>
      <div class="nav-item" data-view="explore" style="display:none" id="navExplore" onclick="showView('explore')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span><span>Explore Properties</span></div>
      <div class="nav-item" data-view="properties" onclick="showView('properties')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span><span>Properties</span></div>
      <div class="nav-item" data-view="tenants" onclick="showView('tenants')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span>Tenants</span></div>
      <div class="nav-item" data-view="leases" onclick="showView('leases')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span><span>Leases</span></div>
      <div class="nav-item" data-view="finance" onclick="showView('finance')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9.5a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5h-1a2.5 2.5 0 0 1-2.5-2.5"/><line x1="12" y1="5" x2="12" y2="19"/></svg></span><span>Finance</span></div>
      <div class="nav-item" data-view="maintenance" style="display:none" id="navMaintenance" onclick="showView('maintenance')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span>Maintenance</span></div>
      <div class="nav-item" data-view="vendors" style="display:none" id="navVendors" onclick="showView('vendors')"><span class="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2l1.5 4.5h9L18 2"/><path d="M3.5 6.5h17l-1 13a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z"/><path d="M9 10a3 3 0 0 0 6 0"/></svg></span><span>Vendors</span></div>
    </div>
    <div class="user-section">
      <div class="email" id="sidebarEmail">Loading...</div>
      <div class="role" id="sidebarRole">—</div>
      <a href="#" id="switchRoleLink" style="display:none;font-size:.75rem;color:#a1a1aa;text-decoration:underline;margin:.15rem 0 .5rem" onclick="switchRole(); return false;">Switch portal</a>
      <button class="logout-btn" id="logoutBtn">Sign out</button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content" id="mainContent">
    <div class="loading">
      <div class="pulse"></div>
      <p style="margin-top:1rem;font-size:.85rem;color:#71717a">Loading your dashboard...</p>
    </div>
  </div>
</div>

<script>
(function() {
  var token = localStorage.getItem('accessToken');
  if (!token) { window.location.href = '/login'; return; }

  var currentView = 'dashboard';
  var userData = null;
  var roleTypes = [];

  function h(s) { return String(s).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  // Auto-label table cells with their column header so the mobile CSS can
  // render each row as a card (label: value) instead of a scrolling table.
  function applyTableLabels(root) {
    (root || document).querySelectorAll('.table-wrap table').forEach(function(table) {
      var headers = Array.from(table.querySelectorAll('thead th')).map(function(th) { return th.textContent.trim(); });
      if (!headers.length) return;
      table.querySelectorAll('tbody tr').forEach(function(tr) {
        Array.from(tr.children).forEach(function(td, i) {
          if (headers[i] && !td.hasAttribute('data-label')) td.setAttribute('data-label', headers[i]);
        });
      });
    });
  }
  var mainContentEl = document.getElementById('mainContent');
  if (mainContentEl && window.MutationObserver) {
    var tableObserver = new MutationObserver(function() { applyTableLabels(mainContentEl); });
    tableObserver.observe(mainContentEl, { childList: true, subtree: true });
  }

    function closeModal() {
    var el = document.querySelector('.modal-overlay.open');
    if (el) el.remove();
  }
  window.closeModal = closeModal;

  // Event delegation for data-action elements
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    switch(action) {
      case 'show-property':
        showPropertyDetail(el.getAttribute('data-id'), el.getAttribute('data-name'));
        break;
      case 'show-building':
        showBuildingDetail(el.getAttribute('data-id'), el.getAttribute('data-name'), el.getAttribute('data-prop-id'));
        break;
      case 'show-tenant':
        showTenantDetail(el.getAttribute('data-id'));
        break;
      case 'add-building':
        openBuildingModal(el.getAttribute('data-prop-id'));
        break;
      case 'assign-manager':
        openAssignManagerModal(el.getAttribute('data-prop-id'));
        break;
      case 'add-unit':
        openUnitModal(el.getAttribute('data-building-id'));
        break;
      case 'edit-unit':
        editUnit(el.getAttribute('data-id'), el.getAttribute('data-name'),
          el.getAttribute('data-bedrooms'), el.getAttribute('data-bathrooms'),
          el.getAttribute('data-sqft'), el.getAttribute('data-rent'),
          el.getAttribute('data-status'), el.getAttribute('data-floor'),
          el.getAttribute('data-deposit'), el.getAttribute('data-desc'));
        break;
    }
  });

  // Event delegation for change events (select filters)
  document.addEventListener('change', function(e) {
    var el = e.target;
    if (el.id === 'propFilter') renderProperties();
    if (el.id === 'leaseFilter') renderLeases();
    if (el.id === 'maintFilter' || el.id === 'maintPriorityFilter') renderMaintenance();
  });

  // Event delegation for keyup (Enter in search)
  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
      if (e.target.id === 'propSearch') renderProperties();
      if (e.target.id === 'tenantSearch') renderTenants();
    }
  });


  function api(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.headers['Authorization'] = 'Bearer ' + token;
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    return fetch('/api/v1' + path, opts).then(function(r) {
      if (r.status === 401) { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); window.location.href = '/login'; }
      return r.json().then(function(d) { return { ok: r.ok, status: r.status, data: d }; });
    });
  }

  function toast(msg, type) {
    var tc = document.getElementById('toastContainer');
    if (!tc) { tc = document.createElement('div'); tc.id = 'toastContainer'; tc.className = 'toast'; document.body.appendChild(tc); }
    var el = document.createElement('div'); el.className = 'toast-item ' + (type || '');
    el.textContent = msg; tc.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function() { el.remove(); }, 300); }, 3000);
  }

  function confirmAction(msg, cb) {
    var html = '<div class=\"confirm-overlay open\" id=\"confirmDlg\"><div class=\"confirm-box\"><h3>Confirm</h3><p>' + h(msg) + '</p><div class=\"btn-row\"><button class=\"btn btn-danger btn-sm\" id=\"confirmYes\">Yes, proceed</button><button class=\"btn btn-secondary btn-sm\" id=\"confirmNo\">Cancel</button></div></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('confirmYes').onclick = function() { div.remove(); cb(); };
    document.getElementById('confirmNo').onclick = function() { div.remove(); };
  }

  window.showView = function(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
    var navEl = document.querySelector('.nav-item[data-view="' + view + '"]');
    if (navEl) navEl.classList.add('active');
    renderView(view);
    if (window.innerWidth <= 768) toggleSidebar(false);
  }

  window.toggleSidebar = function(force) {
    var sidebar = document.getElementById('sidebar');
    var backdrop = document.getElementById('sidebarBackdrop');
    var menuBtn = document.getElementById('menuBtn');
    var open = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    if (menuBtn) menuBtn.classList.toggle('open', open);
  }

  function renderView(view) {
    switch(view) {
      case 'dashboard': renderDashboard(); break;
      case 'explore': renderExplore(); break;
      case 'properties': renderProperties(); break;
      case 'tenants': renderTenants(); break;
      case 'leases': renderLeases(); break;
      case 'finance': renderFinance(); break;
      case 'maintenance': renderMaintenance(); break;
      case 'vendors': renderVendors(); break;
      default: renderDashboard();
    }
  }

  function setContent(html) {
    document.getElementById('mainContent').innerHTML = html;
  }

  function animateNum(el, target, opts) {
    if (!el) return;
    opts = opts || {};
    var prefix = opts.prefix || '', suffix = opts.suffix || '';
    var duration = 700, startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      var display = opts.decimals ? current.toFixed(opts.decimals) : Math.round(current);
      el.textContent = prefix + (opts.locale ? Number(display).toLocaleString() : display) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Init ─────────────────────────────────────────────── */
  function roleLabel(r) {
    return r === 'ADMIN' ? 'Admin' : r === 'MANAGER' ? 'Manager' : r === 'ACCOUNTANT' ? 'Accountant' : r === 'OWNER' ? 'Owner' : r === 'TENANT' ? 'Tenant' : r;
  }

  function activateRole(role, allRoles) {
    roleTypes = [role];
    document.getElementById('sidebarRole').textContent = roleLabel(role);
    document.getElementById('navItems').style.display = '';
    var switchLink = document.getElementById('switchRoleLink');
    if (switchLink) switchLink.style.display = allRoles.length > 1 ? '' : 'none';

    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER' || r === 'ACCOUNTANT'; });
    var isTenant = roleTypes.includes('TENANT');
    var isOwner = roleTypes.includes('OWNER');

    // Show/hide nav items based on role
    document.getElementById('navMaintenance').style.display = (isStaff || isOwner) ? '' : 'none';
    document.getElementById('navVendors').style.display = (isStaff && (roleTypes.includes('ADMIN') || roleTypes.includes('MANAGER'))) ? '' : 'none';
    document.getElementById('navExplore').style.display = isTenant ? '' : 'none';

    // For non-staff users, hide irrelevant nav items
    if (!isStaff) {
      document.querySelectorAll('.nav-item[data-view="properties"]').forEach(function(el) { el.style.display = isOwner ? '' : 'none'; });
      document.querySelectorAll('.nav-item[data-view="tenants"]').forEach(function(el) { el.style.display = isOwner ? '' : 'none'; });
      document.querySelectorAll('.nav-item[data-view="leases"]').forEach(function(el) { el.style.display = 'none'; });
      document.querySelectorAll('.nav-item[data-view="finance"]').forEach(function(el) { el.style.display = isOwner ? '' : 'none'; });
    }

    renderDashboard();
  }

  function renderRoleSwitcher(allRoles) {
    document.getElementById('navItems').style.display = 'none';
    document.getElementById('sidebarRole').textContent = 'Choose a role';
    var cards = allRoles.map(function(r) {
      return '<div class="card" style="cursor:pointer;text-align:center;padding:1.5rem" onclick="chooseRole(\\'' + r + '\\')"><h4 style="margin-bottom:.35rem">' + roleLabel(r) + '</h4><p style="font-size:.8rem;color:#71717a">Continue as ' + roleLabel(r) + '</p></div>';
    }).join('');
    setContent(
      '<div class="page-header"><h2>Choose how to continue</h2><p>Your account has multiple roles. Pick one to enter its dashboard.</p></div>' +
      '<div class="card-grid">' + cards + '</div>'
    );
  }

  window.chooseRole = function(role) {
    localStorage.setItem('activeRole', role);
    window.location.reload();
  };

  window.switchRole = function() {
    localStorage.removeItem('activeRole');
    window.location.reload();
  };

  async function init() {
    try {
      var res = await api('/auth/profile');
      if (!res.ok) throw new Error('Unauthorized');
      userData = res.data;
      document.getElementById('sidebarEmail').textContent = userData.email;
      var allRoles = (userData.roles || []).map(function(r) { return typeof r === 'string' ? r : (r.type || r.name); });

      if (allRoles.length > 1) {
        var stored = localStorage.getItem('activeRole');
        if (stored && allRoles.indexOf(stored) !== -1) {
          activateRole(stored, allRoles);
        } else {
          renderRoleSwitcher(allRoles);
        }
      } else {
        activateRole(allRoles[0], allRoles);
      }
    } catch(e) {
      setContent('<div class="loading"><p style="font-size:.85rem;color:#71717a">Could not load dashboard. <a href="/login" style="color:#18181b;font-weight:500">Sign in again.</a></p></div>');
    }
  }

  /* ── Logout ───────────────────────────────────────────── */
  document.getElementById('logoutBtn').addEventListener('click', function() {
    var t = localStorage.getItem('accessToken');
    if (t) { fetch('/api/v1/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t } }).catch(function() {}); }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  });

  /* ═══════════════════════════════════════════════════════════
     DASHBOARD VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderDashboard() {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER' || r === 'ACCOUNTANT'; });
    var isTenant = roleTypes.includes('TENANT');
    var isOwner = roleTypes.includes('OWNER');

    if (isStaff) { renderStaffDashboard(); }
    else if (isTenant) { renderTenantPortal(); }
    else if (isOwner) { renderOwnerPortal(); }
    else { renderStaffDashboard(); }
  }

  async function renderStaffDashboard() {
    var name = (userData.firstName || '').split(' ')[0];
    var cn = (userData.company && userData.company.name) || 'your company';
    setContent(
      '<div class="page-header"><h2>Hello, ' + h(name) + '.</h2><p>Portfolio overview for <strong>' + h(cn) + '</strong></p></div>' +
      '<div class="stats-grid" id="dashStats">' +
        ['<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Total Units</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Occupied</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Vacant</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Maintenance</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Collected</div></div>',
         '<div class="stat-card"><div class="stat-num">—%</div><div class="stat-lbl">Rate</div></div>'].join('') +
      '</div>' +
      '<div class="section-h">Recent activity</div>' +
      '<div class="table-wrap" id="dashActivity"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var statsRes = await api('/reports/dashboard');
      if (statsRes.ok) {
        var s = statsRes.data;
        var grid = document.getElementById('dashStats');
        if (grid) {
          var cards = grid.querySelectorAll('.stat-card');
          var occ = s.occupancy || {};
          var fin = s.financial || {};
          if (cards.length >= 6) {
            cards[0].innerHTML = '<div class="stat-num">0</div><div class="stat-lbl">Total Units</div><div class="stat-sub">Across portfolio</div>';
            cards[1].innerHTML = '<div class="stat-num">0</div><div class="stat-lbl">Occupied</div><div class="stat-sub"><span class="good">' + ((occ.occupancyRate || 0)).toFixed(1) + '%</span> rate</div>';
            cards[2].innerHTML = '<div class="stat-num">0</div><div class="stat-lbl">Vacant</div><div class="stat-sub">Available</div>';
            cards[3].innerHTML = '<div class="stat-num">0</div><div class="stat-lbl">Maintenance</div><div class="stat-sub">Under repair</div>';
            cards[4].innerHTML = '<div class="stat-num">₹0</div><div class="stat-lbl">Collected</div><div class="stat-sub">Revenue</div>';
            cards[5].innerHTML = '<div class="stat-num">0%</div><div class="stat-lbl">Occupancy Rate</div><div class="stat-sub">' + (occ.occupiedUnits || 0) + ' of ' + (occ.totalUnits || 0) + ' rented</div>';
            animateNum(cards[0].querySelector('.stat-num'), occ.totalUnits || 0, {});
            animateNum(cards[1].querySelector('.stat-num'), occ.occupiedUnits || 0, {});
            animateNum(cards[2].querySelector('.stat-num'), occ.vacantUnits || 0, {});
            animateNum(cards[3].querySelector('.stat-num'), occ.maintenanceUnits || 0, {});
            animateNum(cards[4].querySelector('.stat-num'), fin.totalCollected || 0, { prefix: '₹', locale: true });
            animateNum(cards[5].querySelector('.stat-num'), occ.occupancyRate || 0, { suffix: '%' });
          }
        }
      }
    } catch(e) {}

    // Load recent activity (invoices and maintenance)
    var activityHtml = '';
    try {
      var invRes = await api('/invoices?limit=5');
      if (invRes.ok && invRes.data.data && invRes.data.data.length) {
        var rows = invRes.data.data.map(function(i) {
          var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : 'tag-yellow';
          return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="val">₹' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + h(i.unit || '—') + '</td><td>' + h(i.tenant || '—') + '</td></tr>';
        }).join('');
        activityHtml = '<table><thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Unit</th><th>Tenant</th></tr></thead><tbody>' + rows + '</tbody></table>';
      } else {
        activityHtml = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No recent activity.</div>';
      }
    } catch(e) { activityHtml = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load activity.</div>'; }
    var el = document.getElementById('dashActivity');
    if (el) el.innerHTML = activityHtml;
  }

  /* ── Explore Properties (Tenant discovery) ────────────────── */
  window.renderExplore = async function() {
    setContent(
      '<div class="page-header"><h2>Explore Properties</h2><p>Search available properties and contact the manager directly</p></div>' +
      '<div class="filter-bar">' +
      '<input id="exLocation" placeholder="City, state, or address..." style="min-width:180px">' +
      '<input id="exMinBudget" type="number" placeholder="Min rent ₹" style="width:120px">' +
      '<input id="exMaxBudget" type="number" placeholder="Max rent ₹" style="width:120px">' +
      '<select id="exType"><option value="">Any type</option><option value="APARTMENT_COMPLEX">Apartment Complex</option><option value="SINGLE_FAMILY">Single Family</option><option value="MULTI_FAMILY">Multi Family</option><option value="COMMERCIAL">Commercial</option><option value="MIXED_USE">Mixed Use</option></select>' +
      '<label style="display:flex;align-items:center;gap:.35rem;font-size:.82rem;color:#52525b"><input type="checkbox" id="exAvailSoon"> Available Soon only</label>' +
      '<button class="btn btn-primary btn-sm" onclick="searchExplore()">Search</button>' +
      '</div>' +
      '<div class="card-grid" id="exploreList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    window.searchExplore();
  };

  window.searchExplore = async function() {
    var listEl = document.getElementById('exploreList');
    listEl.innerHTML = '<div class="loading" style="padding:2rem"><div class="pulse"></div></div>';

    var params = [];
    var location = document.getElementById('exLocation').value.trim();
    var minBudget = document.getElementById('exMinBudget').value;
    var maxBudget = document.getElementById('exMaxBudget').value;
    var type = document.getElementById('exType').value;
    var availSoon = document.getElementById('exAvailSoon').checked;
    if (location) params.push('location=' + encodeURIComponent(location));
    if (minBudget) params.push('minBudget=' + encodeURIComponent(minBudget));
    if (maxBudget) params.push('maxBudget=' + encodeURIComponent(maxBudget));
    if (type) params.push('type=' + encodeURIComponent(type));
    if (availSoon) params.push('isAvailableSoon=true');

    try {
      var res = await api('/discovery/search' + (params.length ? '?' + params.join('&') : ''));
      if (res.ok && res.data && res.data.length) {
        var cards = res.data.map(function(p) {
          var rent = p.rentRange ? ('₹' + p.rentRange.min.toLocaleString() + (p.rentRange.max !== p.rentRange.min ? ' – ₹' + p.rentRange.max.toLocaleString() : '')) : 'Rent on request';
          var statusTag = p.status === 'AVAILABLE_SOON' ? '<span class="tag tag-yellow">Available Soon</span>' : '<span class="tag tag-green">Active</span>';
          var managerHtml = p.manager
            ? '<div style="margin-top:.5rem;padding-top:.5rem;border-top:1px solid #e4e4e7;font-size:.8rem"><strong>Contact manager:</strong> ' + h(p.manager.name) + (p.manager.phone ? ' · ' + h(p.manager.phone) : '') + '</div>'
            : '<div style="margin-top:.5rem;padding-top:.5rem;border-top:1px solid #e4e4e7;font-size:.8rem;color:#a1a1aa">No manager assigned yet</div>';
          var waitlistBtn = p.status === 'AVAILABLE_SOON'
            ? '<button class="btn btn-secondary btn-sm" style="margin-top:.5rem" onclick="joinWaitlist(\\'' + p.id + '\\')">Join Waiting List</button>'
            : '';
          return '<div class="card">' +
            '<div class="card-hd"><div class="card-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><h4>' + h(p.name) + '</h4></div>' +
            '<p>' + h(p.address || '') + ', ' + h(p.city || '') + '</p>' +
            '<div class="meta">' + rent + ' · ' + statusTag + '</div>' +
            managerHtml + waitlistBtn +
            '</div>';
        }).join('');
        listEl.innerHTML = cards;
      } else {
        listEl.innerHTML = '<div class="empty-state"><p>No properties match your search.</p></div>';
      }
    } catch(e) { listEl.innerHTML = '<div class="empty-state"><p>Could not load properties.</p></div>'; }
  };

  window.joinWaitlist = async function(propertyId) {
    try {
      var res = await api('/discovery/properties/' + propertyId + '/waitlist', { method: 'POST' });
      if (res.ok) { toast('Added to waiting list', 'success'); }
      else { toast(res.data.message || 'Failed to join waiting list', 'error'); }
    } catch(e) { toast('Failed to join waiting list', 'error'); }
  };

  /* ── Tenant Portal ─────────────────────────────────────── */
  async function renderTenantPortal() {
    var name = (userData.firstName || '').split(' ')[0];
    setContent(
      '<div class="page-header"><h2>Welcome, ' + h(name) + '.</h2><p>Your rental portal</p></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem" id="tpTopGrid">' +
        '<div class="tp-col"><h3>Your lease</h3><div class="card-grid" id="tpLease"><div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div></div>' +
        '<div class="tp-col"><h3>Lease Checklists</h3><div class="card" id="tpLifecycle" style="font-size:.8rem;color:#71717a">Loading...</div></div>' +
      '</div>' +
      '<div class="section-h">Invoices / Bills</div>' +
      '<div class="filter-bar">' +
      '<select id="tpInvCategoryFilter"><option value="">All Categories</option><option value="RENT">Rent</option><option value="UTILITY">Utility Bills</option><option value="MAINTENANCE">Maintenance</option><option value="TAX">Corporation Tax</option><option value="OTHER">Other Charges</option></select>' +
      '<select id="tpInvStatusFilter"><option value="">All Statuses</option><option value="PAID">Paid</option><option value="PENDING">Pending</option><option value="OVERDUE">Overdue</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="tpInvoices"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Support & Maintenance requests</div>' +
      '<div class="filter-bar">' +
      '<select id="tpMaintCategoryFilter"><option value="">All Types</option><option value="MAINTENANCE">Maintenance & Repairs</option><option value="QUERY">Queries & Support</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="tpMaintenance"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<button class="btn btn-primary btn-sm" onclick="openMaintModal()">+ Submit request</button>' +
      '<div class="section-h">My Documents</div>' +
      '<div class="table-wrap" id="tpDocuments"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<button class="btn btn-primary btn-sm" onclick="openDocumentModal()">+ Add document</button>');

    // Bind event listeners for dynamic filters
    document.getElementById('tpInvCategoryFilter').addEventListener('change', filterTenantInvoices);
    document.getElementById('tpInvStatusFilter').addEventListener('change', filterTenantInvoices);
    document.getElementById('tpMaintCategoryFilter').addEventListener('change', filterTenantMaint);

    try {
      var leaseRes = await api('/tenants/me/lease');
      if (leaseRes.ok) {
        var l = leaseRes.data;
        var un = l.unit ? (l.unit.name || '—') : '—';
        var bn = l.unit && l.unit.building ? l.unit.building.name : '';
        var pn = l.unit && l.unit.building && l.unit.building.property ? l.unit.building.property.name : '';
        document.getElementById('tpLease').innerHTML = '<div class="card"><div class="card-hd"><div class="card-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div><h4>Unit ' + h(un) + '</h4></div><p>' + h(bn) + (bn && pn ? ' · ' : '') + h(pn) + '</p><div class="meta">Rent: <strong>₹' + (l.rentAmount || 0).toLocaleString() + '</strong> · ' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</div></div>';
        
        // Render Checklist
        if (l.leaseLifecycle) {
          var lf = l.leaseLifecycle;
          var getChStatus = function(val) { return val ? '<span style="color:#16a34a;font-weight:600">✓ Done</span>' : '<span style="color:#ca8a04;font-weight:600">⏳ Pending</span>'; };
          document.getElementById('tpLifecycle').innerHTML = 
            '<div style="display:grid;grid-template-columns:1fr;gap:.4rem">' +
            '<div><strong>Agreement Signed:</strong> ' + getChStatus(lf.moveInAgreementSigned) + '</div>' +
            '<div><strong>Deposit Received:</strong> ' + getChStatus(lf.moveInDepositReceived) + '</div>' +
            '<div><strong>KYC Completed:</strong> ' + getChStatus(lf.moveInKycCompleted) + '</div>' +
            '<div><strong>Move-in Photos:</strong> ' + getChStatus(lf.moveInPhotosUploaded) + '</div>' +
            '<div><strong>Key Handover:</strong> ' + getChStatus(lf.moveInKeyHandover) + '</div>' +
            '<hr style="border:0;border-top:1px solid #e4e4e7;margin:.25rem 0">' +
            '<div><strong>Exit Inspection:</strong> ' + getChStatus(lf.moveOutInspection) + '</div>' +
            '<div><strong>Key Return:</strong> ' + getChStatus(lf.moveOutKeyReturn) + '</div>' +
            '</div>';
        } else {
          document.getElementById('tpLifecycle').innerHTML = '<p style="padding:.5rem">No checklist tracking found.</p>';
        }
      }
    } catch(e) { 
      document.getElementById('tpLease').innerHTML = '<div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">No active lease.</div>';
      document.getElementById('tpLifecycle').innerHTML = '<p style="padding:.5rem">No active lease checklist.</p>';
    }

    try {
      var invRes = await api('/tenants/me/invoices');
      if (invRes.ok) {
        window.tenantInvoices = invRes.data || [];
        filterTenantInvoices();
      }
    } catch(e) { document.getElementById('tpInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No invoices.</div>'; }

    try {
      var maintRes = await api('/tenants/me/maintenance');
      if (maintRes.ok) {
        window.tenantMaintRequests = maintRes.data || [];
        filterTenantMaint();
      }
    } catch(e) { document.getElementById('tpMaintenance').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No requests.</div>'; }

    await loadTenantDocuments();
  }

  async function loadTenantDocuments() {
    var el = document.getElementById('tpDocuments');
    try {
      var res = await api('/tenants/me/documents');
      if (res.ok && res.data && res.data.length) {
        var rows = res.data.map(function(d) {
          var link = d.url ? '<a href="' + h(d.url) + '" target="_blank" rel="noopener">' + h(d.title) + '</a>' : h(d.title);
          return '<tr><td>' + link + '</td><td><span class="tag tag-gray">' + h(d.category || 'OTHER') + '</span></td><td>' + (d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '—') + '</td><td><a href="#" onclick="deleteTenantDocument(\\'' + d.id + '\\'); return false;" style="color:#dc2626;font-size:.8rem">Remove</a></td></tr>';
        }).join('');
        el.innerHTML = '<table><thead><tr><th>Title</th><th>Category</th><th>Added</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
      } else {
        el.innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No documents yet.</div>';
      }
    } catch(e) { el.innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load documents.</div>'; }
  }

  window.openDocumentModal = function() {
    var html =
      '<div class="modal-overlay open" id="docModal"><div class="modal">' +
      '<h2>Add document</h2>' +
      '<form id="docForm">' +
      '<div class="field"><label>Title *</label><input type="text" id="docTitle" placeholder="e.g. Aadhaar card, Signed agreement" required></div>' +
      '<div class="field"><label>Category</label><select id="docCategory"><option value="ID_PROOF">ID Proof</option><option value="LEASE_AGREEMENT">Lease Agreement</option><option value="INCOME_PROOF">Income Proof</option><option value="OTHER" selected>Other</option></select></div>' +
      '<div class="field"><label>Upload file (image, PDF, Word, Excel...)</label><input type="file" id="docFile" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"></div>' +
      '<div class="field"><label>...or paste a link instead</label><input type="url" id="docUrl" placeholder="https://..."></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm" id="docSubmitBtn">Add</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('docForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var title = document.getElementById('docTitle').value.trim();
      var category = document.getElementById('docCategory').value;
      var url = document.getElementById('docUrl').value.trim();
      var file = document.getElementById('docFile').files[0];
      if (!title) return;

      var submitBtn = document.getElementById('docSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>' + (file ? 'Uploading...' : 'Adding...');

      try {
        var res;
        if (file) {
          var fd = new FormData();
          fd.append('file', file);
          fd.append('title', title);
          fd.append('category', category);
          res = await api('/tenants/me/documents/upload', { method: 'POST', body: fd });
        } else {
          res = await api('/tenants/me/documents', { method: 'POST', body: { title: title, category: category, url: url || undefined } });
        }
        if (res.ok) { document.getElementById('docModal').remove(); toast('Document added', 'success'); loadTenantDocuments(); }
        else {
          toast(res.data.message || 'Failed', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Add';
        }
      } catch(e) {
        toast('Failed to add document', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add';
      }
    });
  };

  window.deleteTenantDocument = async function(id) {
    try {
      var res = await api('/tenants/me/documents/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Document removed', 'success'); loadTenantDocuments(); }
      else { toast(res.data.message || 'Failed to remove', 'error'); }
    } catch(e) { toast('Failed to remove document', 'error'); }
  };

  window.filterTenantInvoices = function() {
    var cat = document.getElementById('tpInvCategoryFilter').value;
    var status = document.getElementById('tpInvStatusFilter').value;
    var filtered = window.tenantInvoices || [];
    if (cat) filtered = filtered.filter(function(i) { return i.category === cat; });
    if (status) filtered = filtered.filter(function(i) { return i.status === status; });
    
    if (filtered.length) {
      var rows = filtered.map(function(i) {
        var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : 'tag-yellow';
        return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="tag tag-gray">' + h(i.category || 'RENT') + '</span></td><td><span class="val">₹' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class="val">₹' + (i.paidAmount || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td></tr>';
      }).join('');
      document.getElementById('tpInvoices').innerHTML = '<table><thead><tr><th>Invoice</th><th>Category</th><th>Total</th><th>Paid</th><th>Status</th><th>Due</th></tr></thead><tbody>' + rows + '</tbody></table>';
    } else {
      document.getElementById('tpInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No invoices matching filters.</div>';
    }
  };

  window.filterTenantMaint = function() {
    var cat = document.getElementById('tpMaintCategoryFilter').value;
    var filtered = window.tenantMaintRequests || [];
    if (cat) filtered = filtered.filter(function(r) { return r.category === cat; });
    
    if (filtered.length) {
      var rows = filtered.map(function(r) {
        var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
        var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED' ? 'tag-blue' : 'tag-yellow';
        return '<tr><td>' + h(r.title) + '</td><td><span class="tag tag-gray">' + h(r.category || 'MAINTENANCE') + '</span></td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td></tr>';
      }).join('');
      document.getElementById('tpMaintenance').innerHTML = '<table><thead><tr><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead><tbody>' + rows + '</tbody></table>';
    } else {
      document.getElementById('tpMaintenance').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No requests matching filter.</div>';
    }
  };

  window.openMaintModal = function() {
    var html =
      '<div class="modal-overlay open" id="maintModal">' +
      '<div class="modal">' +
      '<h2>Submit support / maintenance request</h2>' +
      '<form id="maintForm">' +
      '<div class="field"><label>Category *</label><select id="maintCategory"><option value="MAINTENANCE">Maintenance & Repairs</option><option value="QUERY">Queries & Support</option></select></div>' +
      '<div class="field"><label>Title *</label><input type="text" id="maintTitle" placeholder="e.g. Leaking faucet / NOC query" required></div>' +
      '<div class="field"><label>Description</label><textarea id="maintDesc" placeholder="Describe the issue..."></textarea></div>' +
      '<div class="field"><label>Priority</label><select id="maintPriority"><option value="LOW">Low</option><option value="MEDIUM" selected>Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Submit</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('maintForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var category = document.getElementById('maintCategory').value;
      var title = document.getElementById('maintTitle').value.trim();
      var desc = document.getElementById('maintDesc').value.trim();
      var priority = document.getElementById('maintPriority').value;
      if (!title) return;
      try {
        var res = await api('/tenants/me/maintenance', { method: 'POST', body: { category: category, title: title, description: desc, priority: priority } });
        if (res.ok) { document.getElementById('maintModal').remove(); renderTenantPortal(); }
        else { toast(res.data.message || 'Failed'); }
      } catch(e) { toast('Failed to submit request'); }
    });
  };

  /* ── Owner Portal ──────────────────────────────────────── */
  async function renderOwnerPortal() {
    var name = (userData.firstName || '').split(' ')[0];
    setContent(
      '<div class="page-header"><h2>Welcome, ' + h(name) + '.</h2><p>Your properties and financial overview</p></div>' +
      '<div class="section-h">Financial summary</div>' +
      '<div class="stats-grid" id="ownFin"><div class="stat-card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Your properties</div>' +
      '<div class="card-grid" id="ownProps"><div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Maintenance requests <span style="font-size:.72rem;font-weight:400;color:#a1a1aa">(on your properties)</span></div>' +
      '<div class="table-wrap" id="ownMaint"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var finRes = await api('/owners/me/financials');
      if (finRes.ok) {
        var f = finRes.data;
        document.getElementById('ownFin').innerHTML =
          '<div class="stat-card"><div class="stat-num">' + (f.units ? f.units.total : 0) + '</div><div class="stat-lbl">Total Units</div><div class="stat-sub"><span class="good">' + (f.units ? f.units.occupied : 0) + ' occupied</span> · <span class="warn">' + (f.units ? f.units.vacant : 0) + ' vacant</span></div></div>' +
          '<div class="stat-card"><div class="stat-num">₹' + ((f.finances ? f.finances.totalRent : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Total Rent</div></div>' +
          '<div class="stat-card"><div class="stat-num">₹' + ((f.finances ? f.finances.totalCollected : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Collected</div><div class="stat-sub">Net: <strong>₹' + ((f.finances ? f.finances.netIncome : 0) || 0).toLocaleString() + '</strong></div></div>' +
          '<div class="stat-card"><div class="stat-num">₹' + ((f.finances ? f.finances.totalExpenses : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Expenses</div></div>';
      }
    } catch(e) { document.getElementById('ownFin').innerHTML = '<div class="stat-card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Could not load financials.</div>'; }

    try {
      var propRes = await api('/owners/me/properties');
      if (propRes.ok && propRes.data && propRes.data.length) {
        var cards = propRes.data.map(function(p) {
          var units = 0, occupied = 0;
          if (p.buildings) { p.buildings.forEach(function(b) { if (b.units) { b.units.forEach(function(u) { units++; if (u.status === 'OCCUPIED') occupied++; }); } }); }
          return '<div class="card"><div class="card-hd"><div class="card-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><h4>' + h(p.name) + '</h4></div><p>' + h(p.address || '') + '</p><div class="meta">' + units + ' units · <span class="tag tag-green">' + occupied + ' occ.</span> <span class="tag tag-yellow">' + (units - occupied) + ' vac.</span></div></div>';
        }).join('');
        document.getElementById('ownProps').innerHTML = cards;
      }
    } catch(e) { document.getElementById('ownProps').innerHTML = '<div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">No properties found.</div>'; }

    // Owner maintenance: fetch all maintenance, filter by their units
    try {
      var maintRes = await api('/maintenance?limit=100');
      if (maintRes.ok) {
        var allMaint = maintRes.data.data || [];
        // Try to get owner's unit IDs from their properties
        var propRes2 = await api('/owners/me/properties');
        var ownerUnitIds = [];
        if (propRes2.ok && propRes2.data) {
          propRes2.data.forEach(function(p) {
            if (p.buildings) p.buildings.forEach(function(b) {
              if (b.units) b.units.forEach(function(u) { ownerUnitIds.push(u.id); });
            });
          });
        }
        var filtered = allMaint.filter(function(m) { return ownerUnitIds.includes(m.unitId) || ownerUnitIds.length === 0; });
        if (filtered.length) {
          var rows = filtered.slice(0,10).map(function(r) {
            var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
            var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' ? 'tag-blue' : 'tag-yellow';
            return '<tr><td>' + h(r.title) + '</td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.unit ? h(r.unit.name) : '—') + '</td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td></tr>';
          }).join('');
          document.getElementById('ownMaint').innerHTML = '<table><thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Unit</th><th>Date</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('ownMaint').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No maintenance requests for your properties.</div>';
        }
      }
    } catch(e) { document.getElementById('ownMaint').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     PROPERTIES VIEW
     ═══════════════════════════════════════════════════════════ */
  window.renderProperties = async function() {
    var isOwner = roleTypes.includes('OWNER');
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });
    var canAddProperty = isStaff || isOwner;

    setContent(
      '<div class="page-header"><h2>Properties</h2><p>Manage your property portfolio</p></div>' +
      (canAddProperty ? '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openPropertyModal()">+ Add Property</button></div>' : '') +
      '<div class="filter-bar">' +
      '<select id="propFilter"><option value="">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="UNDER_MAINTENANCE">Under Maintenance</option></select>' +
      '<input id="propSearch" placeholder="Search..." onkeyup="if(event.keyCode===13)renderProperties()">' +
      '</div>' +
      '<div class="card-grid" id="propList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var status = document.getElementById('propFilter').value;
      var search = document.getElementById('propSearch').value;
      var path = '/properties?limit=50';
      if (status) path += '&status=' + status;
      if (search) path += '&search=' + encodeURIComponent(search);

      var res = await api(path);
      if (res.ok) {
        var props = res.data.data || [];
        if (props.length) {
          var cards = props.map(function(p) {
            var imgUrl = p.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400&h=250';
            return '<div class="card prop-card" style="cursor:pointer" data-action="show-property" data-id="' + p.id + '" data-name="' + h(p.name) + '">' +
              '<img src="' + imgUrl + '" alt="Property Image">' +
              '<div class="prop-card-body">' +
              '<h4>' + h(p.name) + '</h4>' +
              '<p>' + h(p.address || '') + ', ' + h(p.city || '') + '</p>' +
              '<div class="meta">' + (p.buildingCount || 0) + ' buildings · <span class="tag ' + (p.status === 'ACTIVE' ? 'tag-green' : p.status === 'UNDER_MAINTENANCE' ? 'tag-yellow' : 'tag-gray') + '">' + (p.status || '—') + '</span></div>' +
              '</div>' +
              '</div>';
          }).join('');
          document.getElementById('propList').innerHTML = cards;
        } else {
          document.getElementById('propList').innerHTML = '<div class="empty-state"><div class="icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><p>No properties found. ' + (canAddProperty ? 'Click "Add Property" to get started.' : '') + '</p></div>';
        }
      }
    } catch(e) { document.getElementById('propList').innerHTML = '<div class="empty-state"><p>Could not load properties.</p></div>'; }
  }

  /* ── Property Edit/Delete ─────────────────────────────── */
  window.editProperty = function(id, name, address, city, status) {
    var html =
      '<div class="modal-overlay open" id="editPropModal">' +
      '<div class="modal"><h2>Edit Property</h2>' +
      '<form id="editPropForm">' +
      '<div class="field"><label>Name</label><input type="text" id="epName" value="' + h(name) + '" required></div>' +
      '<div class="field"><label>Address</label><input type="text" id="epAddr" value="' + h(address) + '"></div>' +
      '<div class="field"><label>City</label><input type="text" id="epCity" value="' + h(city) + '"></div>' +
      '<div class="field"><label>Status</label><select id="epStatus"><option value="ACTIVE"' + (status==='ACTIVE'?' selected':'') + '>Active</option><option value="INACTIVE"' + (status==='INACTIVE'?' selected':'') + '>Inactive</option><option value="UNDER_MAINTENANCE"' + (status==='UNDER_MAINTENANCE'?' selected':'') + '>Under Maintenance</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Save</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('editPropForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      try {
        var res = await api('/properties/' + id, { method: 'PATCH', body: { name: document.getElementById('epName').value.trim(), address: document.getElementById('epAddr').value.trim(), city: document.getElementById('epCity').value.trim(), status: document.getElementById('epStatus').value } });
        if (res.ok) { document.getElementById('editPropModal').remove(); toast('Property updated', 'success'); renderProperties(); }
        else { toast(res.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to update', 'error'); }
    });
  };

  async function deleteProperty(id) {
    try {
      var res = await api('/properties/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Property deleted', 'success'); renderProperties(); }
      else { toast(res.data.message || 'Failed to delete', 'error'); }
    } catch(e) { toast('Failed to delete', 'error'); }
  }

  /* ── Property Detail ────────────────────────────────────── */
  window.showPropertyDetail = async function(propId, propName) {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });
    var canAssignManager = roleTypes.includes('OWNER') || roleTypes.includes('ADMIN');

    var buttons = '';
    if (isStaff) buttons += '<button class="btn btn-primary btn-sm" data-action="add-building" data-prop-id="' + propId + '">+ Add Building</button>';
    if (canAssignManager) buttons += '<button class="btn btn-secondary btn-sm" data-action="assign-manager" data-prop-id="' + propId + '">Assign Manager</button>';

    setContent('<a class="back-link" onclick="showView(&apos;properties&apos;)">← Back to properties</a>' +
      '<div class="page-header"><h2>' + h(propName) + '</h2><p>Buildings inside this property</p></div>' +
      '<div id="managerBox" style="margin-bottom:1rem"></div>' +
      (buttons ? '<div class="btn-row">' + buttons + '</div>' : '') +
      '<div id="buildingList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var propRes = await api('/properties/' + propId);
      if (propRes.ok) {
        var m = propRes.data.manager;
        document.getElementById('managerBox').innerHTML = m
          ? '<div class="card" style="padding:.75rem 1rem"><strong>Manager:</strong> ' + h(m.firstName + ' ' + m.lastName) + (m.phone ? ' · ' + h(m.phone) : '') + '</div>'
          : '<div class="card" style="padding:.75rem 1rem;color:#a1a1aa;font-size:.85rem">No manager assigned yet.</div>';
      }
    } catch(e) {}

    try {
      var res = await api('/properties/' + propId + '/buildings');
      if (res.ok) {
        var buildings = res.data || [];
        if (buildings.length) {
          var cards = buildings.map(function(b) {
            return '<div class="card" style="cursor:pointer" data-action="show-building" data-id="' + b.id + '" data-name="' + h(b.name) + '" data-prop-id="' + propId + '">' +
              '<div class="card-hd"><div class="card-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div><h4>' + h(b.name) + '</h4></div>' +
              '<p>' + (b.code ? h(b.code) + ' · ' : '') + (b.unitCount || 0) + ' units</p>' +
              '</div>';
          }).join('');
          document.getElementById('buildingList').innerHTML = '<div class="card-grid">' + cards + '</div>';
        } else {
          document.getElementById('buildingList').innerHTML = '<div class="empty-state"><p>No buildings found. ' + (isStaff ? 'Click "+ Add Building" to add one.' : '') + '</p></div>';
        }
      }
    } catch(e) {
      document.getElementById('buildingList').innerHTML = '<div class="empty-state"><p>Could not load buildings.</p></div>';
    }
  };

  /* ── Building Detail ────────────────────────────────────── */
  window.showBuildingDetail = async function(buildingId, buildingName, propId) {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });

    setContent('<a class="back-link" onclick="showPropertyDetail(&apos;' + propId + '&apos;, &apos;&apos;)">← Back to property</a>' +
      '<div class="page-header"><h2>Building: ' + h(buildingName) + '</h2><p>Units listing</p></div>' +
      '<div class="filter-bar">' +
      '<select id="unitFilter"><option value="">All units</option><option value="VACANT">Vacant</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select>' +
      '</div>' +
      (isStaff ? '<div class="btn-row"><button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="' + buildingId + '">+ Add Unit</button></div>' : '') +
      '<div id="buildingUnits"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>'
    );

    var select = document.getElementById('unitFilter');
    select.onchange = function() {
      loadUnits();
    };

    async function loadUnits() {
      try {
        var status = select.value;
        var path = '/properties/buildings/' + buildingId + '/units';
        if (status) path += '?status=' + status;
        var res = await api(path);
        if (res.ok) {
          var units = res.data || [];
          if (units.length) {
            var html = units.map(function(u) {
              return '<div class="card" style="margin-bottom:.75rem">' +
                '<h4>' + h(u.name) + ' <span class="tag ' + (u.status === 'OCCUPIED' ? 'tag-green' : u.status === 'VACANT' ? 'tag-gray' : 'tag-yellow') + '" style="font-size:.65rem">' + (u.status || '—') + '</span></h4>' +
                '<p>' + (u.bedrooms || 0) + 'bd / ' + (u.bathrooms || 0) + 'ba · ' + (u.squareFootage || '—') + ' sqft' + (u.floorNumber ? ' · Floor ' + u.floorNumber : '') + '</p>' +
                '<div class="meta">Rent: <strong>₹' + ((u.rentAmount || 0)).toLocaleString() + '</strong>' + (u.depositAmount ? ' · Deposit: ₹' + u.depositAmount.toLocaleString() : '') + '</div>' +
                (isStaff ? '<div style="margin-top:.5rem"><button class="btn btn-secondary btn-xs" data-action="edit-unit" data-id="' + u.id + '" data-name="' + h(u.name) + '" data-bedrooms="' + (u.bedrooms||0) + '" data-bathrooms="' + (u.bathrooms||0) + '" data-sqft="' + (u.squareFootage||"") + '" data-rent="' + (u.rentAmount||0) + '" data-status="' + (u.status||'VACANT') + '" data-floor="' + (u.floorNumber||"") + '" data-deposit="' + (u.depositAmount||0) + '" data-desc="' + h(u.description||"") + '">Edit</button></div>' : '') +
                '</div>';
            }).join('');
            document.getElementById('buildingUnits').innerHTML = html;
          } else {
            document.getElementById('buildingUnits').innerHTML = '<div class="empty-state"><p>No units found.</p></div>';
          }
        }
      } catch(e) {
        document.getElementById('buildingUnits').innerHTML = '<div class="empty-state"><p>Could not load units.</p></div>';
      }
    }

    loadUnits();
  };

  /* ═══════════════════════════════════════════════════════════
     TENANTS VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderTenants() {
    setContent(
      '<div class="page-header"><h2>Tenants</h2><p>Manage your residents</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openTenantModal()">+ Add Tenant</button></div>' +
      '<div class="filter-bar">' +
      '<input id="tenantSearch" placeholder="Search..." onkeyup="if(event.keyCode===13)renderTenants()">' +
      '</div>' +
      '<div class="table-wrap" id="tenantTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var search = (document.getElementById('tenantSearch') || {}).value;
      var path = '/tenants?limit=50';
      if (search) path += '&search=' + encodeURIComponent(search);
      var res = await api(path);
      if (res.ok) {
        var tenants = res.data.data || [];
        if (tenants.length) {
          var rows = tenants.map(function(t) {
            var st = t.status === 'ACTIVE' ? 'tag-green' : t.status === 'FORMER' ? 'tag-red' : 'tag-gray';
            return '<tr class="clickable-row" style="cursor:pointer" data-action="show-tenant" data-id="' + t.id + '">' +
              '<td><span class="val">' + h(t.firstName) + ' ' + h(t.lastName) + '</span></td>' +
              '<td>' + h(t.email) + '</td>' +
              '<td>' + (t.phone || '—') + '</td>' +
              '<td><span class="tag ' + st + '">' + (t.status || '—') + '</span></td>' +
              '<td>' + new Date(t.createdAt).toLocaleDateString() + '</td>' +
              '</tr>';
          }).join('');
          document.getElementById('tenantTable').innerHTML = '<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Added</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('tenantTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No tenants found.</div>';
        }
      }
    } catch(e) { document.getElementById('tenantTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ── Tenant Detail ──────────────────────────────────────── */
  window.showTenantDetail = async function(id) {
    setContent('<a class="back-link" onclick="showView(&apos;tenants&apos;)">← Back to tenants</a>' +
      '<div class="page-header"><h2>Tenant Profile</h2><p>Tenant contact and status details</p></div>' +
      '<div id="tenantDetail" class="card"><div class="loading"><div class="pulse"></div></div></div>'
    );

    try {
      var res = await api('/tenants/' + id);
      if (res.ok) {
        var t = res.data;
        var emergencyHtml = '—';
        if (t.emergencyContact) {
          try {
            var ec = typeof t.emergencyContact === 'string' ? JSON.parse(t.emergencyContact) : t.emergencyContact;
            if (ec && (ec.name || ec.phone)) {
              emergencyHtml = h(ec.name || '') + (ec.relationship ? ' (' + h(ec.relationship) + ')' : '') + (ec.phone ? ' - ' + h(ec.phone) : '');
            }
          } catch(e) {}
        }
        var docs = Array.isArray(t.documents) ? t.documents : [];
        var docsHtml = docs.length
          ? '<table><thead><tr><th>Title</th><th>Category</th><th>Added</th></tr></thead><tbody>' +
            docs.map(function(d) {
              var link = d.url ? '<a href="' + h(d.url) + '" target="_blank" rel="noopener">' + h(d.title) + '</a>' : h(d.title);
              return '<tr><td>' + link + '</td><td><span class="tag tag-gray">' + h(d.category || 'OTHER') + '</span></td><td>' + (d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '—') + '</td></tr>';
            }).join('') +
            '</tbody></table>'
          : '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No documents on file.</div>';

        document.getElementById('tenantDetail').innerHTML =
          '<h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.75rem">' + h(t.firstName) + ' ' + h(t.lastName) + '</h3>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;font-size:.85rem;line-height:1.6">' +
            '<div>' +
              '<p><strong>Email:</strong> ' + h(t.email) + '</p>' +
              '<p><strong>Phone:</strong> ' + (t.phone ? h(t.phone) : '—') + '</p>' +
              '<p><strong>Status:</strong> <span class="tag ' + (t.status === 'ACTIVE' ? 'tag-green' : t.status === 'FORMER' ? 'tag-red' : 'tag-gray') + '">' + (t.status || '—') + '</span></p>' +
            '</div>' +
            '<div>' +
              '<p><strong>Emergency Contact:</strong> ' + emergencyHtml + '</p>' +
              '<p><strong>Notes:</strong> ' + (t.notes ? h(t.notes) : '—') + '</p>' +
              '<p><strong>Created At:</strong> ' + new Date(t.createdAt).toLocaleString() + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="section-h" style="margin-top:1.25rem">Documents</div>' +
          '<div class="table-wrap">' + docsHtml + '</div>';
      } else {
        document.getElementById('tenantDetail').innerHTML = '<div class="empty-state"><p>Could not load tenant details.</p></div>';
      }
    } catch(e) {
      document.getElementById('tenantDetail').innerHTML = '<div class="empty-state"><p>Could not load tenant details.</p></div>';
    }
  };

  /* ═══════════════════════════════════════════════════════════
     LEASES VIEW
     ═══════════════════════════════════════════════════════════ */
  window.renderLeases = async function() {
    setContent(
      '<div class="page-header"><h2>Leases</h2><p>Active and past rental contracts</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openLeaseModal()">+ Create Lease</button></div>' +
      '<div class="filter-bar">' +
      '<select id="leaseFilter"><option value="">All status</option><option value="ACTIVE">Active</option><option value="EXPIRED">Expired</option><option value="TERMINATED">Terminated</option><option value="DRAFT">Draft</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="leaseTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var status = document.getElementById('leaseFilter').value;
      var path = '/leases?limit=50';
      if (status) path += '&status=' + status;
      var res = await api(path);
      if (res.ok) {
        var leases = res.data.data || [];
        if (leases.length) {
          var rows = leases.map(function(l) {
            var st = l.status === 'ACTIVE' ? 'tag-green' : l.status === 'EXPIRED' ? 'tag-yellow' : l.status === 'TERMINATED' ? 'tag-red' : 'tag-gray';
            return '<tr><td><span class="val">' + h(l.tenant ? (l.tenant.firstName + ' ' + l.tenant.lastName) : '—') + '</span></td><td>' + (l.unit ? h(l.unit.name) : '—') + (l.unit && l.unit.building ? ' · ' + h(l.unit.building.name) : '') + '</td><td><span class="val">₹' + ((l.rentAmount || 0)).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (l.status || '—') + '</span></td><td>' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</td></tr>'
          }).join('');
          document.getElementById('leaseTable').innerHTML = '<table><thead><tr><th>Tenant</th><th>Unit</th><th>Rent</th><th>Status</th><th>Term</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('leaseTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No leases found.</div>';
        }
      }
    } catch(e) { document.getElementById('leaseTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     FINANCE VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderFinance() {
    setContent(
      '<div class="page-header"><h2>Finance</h2><p>Invoices, payments, and expenses</p></div>' +
      '<div class="btn-row">' +
      '<button class="btn btn-primary btn-sm" onclick="openInvoiceModal()">+ Create Invoice</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="openExpenseModal()">+ Add Expense</button>' +
      '</div>' +
      '<div class="section-h">Invoices <span class="count" id="invCount"></span></div>' +
      '<div class="table-wrap" id="finInvoices"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Expenses</div>' +
      '<div class="table-wrap" id="finExpenses"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var invRes = await api('/invoices?limit=20');
      if (invRes.ok) {
        var invs = invRes.data.data || [];
        document.getElementById('invCount').textContent = invs.length;
        if (invs.length) {
          var rows = invs.map(function(i) {
            var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : i.status === 'PENDING' ? 'tag-yellow' : 'tag-gray';
            return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="val">₹' + ((i.totalAmount || 0)).toLocaleString() + '</span></td><td><span class="val">₹' + ((i.paidAmount || 0)).toLocaleString() + '</span></td><td><span class="val">₹' + ((i.totalAmount - i.paidAmount) || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + (i.tenant ? h(i.tenant) : '—') + '</td><td>' + (i.unit ? h(i.unit) : '—') + '</td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td></tr>'
          }).join('');
          document.getElementById('finInvoices').innerHTML = '<table><thead><tr><th>Invoice</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Tenant</th><th>Unit</th><th>Due</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('finInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No invoices.</div>';
        }
      }
    } catch(e) { document.getElementById('finInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }

    try {
      var expRes = await api('/expenses?limit=20');
      if (expRes.ok) {
        var exps = expRes.data.data || [];
        if (exps.length) {
          var rows = exps.map(function(e) {
            return '<tr><td>' + new Date(e.expenseDate).toLocaleDateString() + '</td><td><span class="tag tag-gray">' + (e.category || '—') + '</span></td><td><span class="val">₹' + ((e.amount || 0)).toLocaleString() + '</span></td><td>' + (e.description ? h(e.description) : '—') + '</td><td>' + (e.vendor ? h(e.vendor) : '—') + '</td></tr>'
          }).join('');
          document.getElementById('finExpenses').innerHTML = '<table><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th><th>Vendor</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('finExpenses').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No expenses.</div>';
        }
      }
    } catch(e) { document.getElementById('finExpenses').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     MAINTENANCE VIEW (Staff)
     ═══════════════════════════════════════════════════════════ */
  window.renderMaintenance = async function() {
    setContent(
      '<div class="page-header"><h2>Maintenance</h2><p>All maintenance requests across your portfolio</p></div>' +
      '<div class="filter-bar">' +
      '<select id="maintFilter"><option value="">All status</option><option value="SUBMITTED">Submitted</option><option value="ACKNOWLEDGED">Acknowledged</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>' +
      '<select id="maintPriorityFilter"><option value="">All priority</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="maintTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var status = document.getElementById('maintFilter').value;
      var priority = document.getElementById('maintPriorityFilter').value;
      var path = '/maintenance?limit=50';
      if (status) path += '&status=' + status;
      if (priority) path += '&priority=' + priority;
      var res = await api(path);
      if (res.ok) {
        var reqs = res.data.data || [];
        if (reqs.length) {
          var rows = reqs.map(function(r) {
            var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
            var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED' ? 'tag-blue' : 'tag-yellow';
            var tenantName = r.tenant ? (r.tenant.firstName + ' ' + r.tenant.lastName) : '—';
            return '<tr><td><span class="val">' + h(r.title) + '</span></td><td>' + h(tenantName) + '</td><td>' + (r.unit ? h(r.unit.name) : '—') + '</td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td><td>' +
              (roleTypes.includes('ADMIN') || roleTypes.includes('MANAGER') || roleTypes.includes('OWNER') ? '<select class="maint-status-update" data-id="' + r.id + '" onchange="updateMaintStatus(this)"><option value="">Update</option><option value="ACKNOWLEDGED">Acknowledge</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancel</option></select>' : '') +
              '</td></tr>';
          }).join('');
          document.getElementById('maintTable').innerHTML = '<table><thead><tr><th>Title</th><th>Tenant</th><th>Unit</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('maintTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No maintenance requests found.</div>';
        }
      }
    } catch(e) { document.getElementById('maintTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  window.updateMaintStatus = async function(sel) {
    var id = sel.getAttribute('data-id');
    var status = sel.value;
    if (!status) return;
    try {
      var res = await api('/maintenance/' + id + '/status', { method: 'PATCH', body: { status: status } });
      if (res.ok) { renderMaintenance(); }
      else { toast(res.data.message || 'Failed to update'); }
    } catch(e) { toast('Failed to update'); }
  }

  /* ═══════════════════════════════════════════════════════════
     VENDORS VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderVendors() {
    setContent(
      '<div class="page-header"><h2>Vendors</h2><p>Service providers and contractors</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openVendorModal()">+ Add Vendor</button></div>' +
      '<div class="card-grid" id="vendorList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var res = await api('/vendors');
      if (res.ok) {
        var vendors = res.data || [];
        if (vendors.length) {
          var cards = vendors.map(function(v) {
            return '<div class="card"><div class="card-hd"><div class="card-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div><h4>' + h(v.name) + '</h4></div><p>' + (v.contactPerson ? h(v.contactPerson) + ' · ' : '') + (v.email ? h(v.email) + ' · ' : '') + (v.phone || '') + '</p><div class="meta"><span class="tag tag-blue">' + (v.specialty || 'OTHER') + '</span>' + (v.isApproved ? ' <span class="tag tag-green">Approved</span>' : '') + '</div></div>';
          }).join('');
          document.getElementById('vendorList').innerHTML = cards;
        } else {
          document.getElementById('vendorList').innerHTML = '<div class="empty-state"><div class="icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2l1.5 4.5h9L18 2"/><path d="M3.5 6.5h17l-1 13a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z"/><path d="M9 10a3 3 0 0 0 6 0"/></svg></div><p>No vendors yet. Add one to get started.</p></div>';
        }
      }
    } catch(e) { document.getElementById('vendorList').innerHTML = '<div class="empty-state"><p>Could not load vendors.</p></div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     MODAL HELPERS
     ═══════════════════════════════════════════════════════════ */

  // Property Modal
  window.openPropertyModal = function() {
    var html =
      '<div class="modal-overlay open" id="propModal"><div class="modal">' +
      '<h2>Add Property</h2><form id="propForm">' +
      '<div class="field"><label>Name *</label><input id="pName" placeholder="Property name" required></div>' +
      '<div class="field"><label>Address *</label><input id="pAddr" placeholder="Street address" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>City *</label><input id="pCity" required></div><div class="field"><label>State *</label><input id="pState" required></div><div class="field"><label>ZIP</label><input id="pZip"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Type</label><select id="pType"><option value="APARTMENT_COMPLEX">Apartment Complex</option><option value="SINGLE_FAMILY">Single Family</option><option value="MULTI_FAMILY">Multi Family</option><option value="COMMERCIAL">Commercial</option><option value="MIXED_USE">Mixed Use</option></select></div><div class="field"><label>Year Built</label><input id="pYear" type="number" placeholder="e.g. 2020"></div></div>' +
      '<div class="field"><label>Description</label><textarea id="pDesc" placeholder="Optional description"></textarea></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('propForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('pName').value.trim(), address: document.getElementById('pAddr').value.trim(), city: document.getElementById('pCity').value.trim(), state: document.getElementById('pState').value.trim(), zipCode: document.getElementById('pZip').value.trim(), type: document.getElementById('pType').value, yearBuilt: parseInt(document.getElementById('pYear').value) || undefined, description: document.getElementById('pDesc').value.trim() || undefined };
      try { var r = await api('/properties', { method: 'POST', body: body }); if (r.ok) { document.getElementById('propModal').remove(); renderProperties(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Assign Manager Modal
  window.openAssignManagerModal = function(propId) {
    var html =
      '<div class="modal-overlay open" id="assignMgrModal"><div class="modal">' +
      '<h2>Assign Manager</h2>' +
      '<p style="font-size:.8rem;color:#71717a;margin:-.5rem 0 1rem">Enter the manager mobile number. If no account exists for that number yet, one is created automatically and the manager signs in via OTP.</p>' +
      '<form id="assignMgrForm">' +
      '<div class="field"><label>Mobile Number *</label><input id="amPhone" placeholder="+91 98765 43210" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>First Name</label><input id="amFirst" placeholder="New manager only"></div><div class="field"><label>Last Name</label><input id="amLast" placeholder="New manager only"></div></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Assign</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('assignMgrForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { phone: document.getElementById('amPhone').value.trim(), firstName: document.getElementById('amFirst').value.trim() || undefined, lastName: document.getElementById('amLast').value.trim() || undefined };
      try {
        var r = await api('/properties/' + propId + '/manager', { method: 'PATCH', body: body });
        if (r.ok) { document.getElementById('assignMgrModal').remove(); toast('Manager assigned', 'success'); showPropertyDetail(propId, ''); }
        else { toast(r.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to assign manager', 'error'); }
    });
  };

  // Building Modal
  window.openBuildingModal = function(propId) {
    var html =
      '<div class="modal-overlay open" id="bldgModal"><div class="modal">' +
      '<h2>Add Building</h2><form id="bldgForm">' +
      '<div class="field"><label>Name *</label><input id="bName" placeholder="Building name" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Code</label><input id="bCode" placeholder="e.g. BLDG-A"></div><div class="field"><label>Floors</label><input id="bFloors" type="number" placeholder="1"></div></div>' +
      '<div class="field"><label>Description</label><textarea id="bDesc" placeholder="Optional"></textarea></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('bldgForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('bName').value.trim(), code: document.getElementById('bCode').value.trim() || undefined, totalFloors: parseInt(document.getElementById('bFloors').value) || undefined, description: document.getElementById('bDesc').value.trim() || undefined };
      try { var r = await api('/properties/' + propId + '/buildings', { method: 'POST', body: body }); if (r.ok) { document.getElementById('bldgModal').remove(); showPropertyDetail(propId, ''); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Unit Modal
  window.openUnitModal = function(buildingId) {
    var html =
      '<div class="modal-overlay open" id="unitModal"><div class="modal">' +
      '<h2>Add Unit</h2><form id="unitForm">' +
      '<div class="field"><label>Unit Name *</label><input id="uName" placeholder="e.g. 101" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Bedrooms</label><input id="uBeds" type="number" value="0"></div><div class="field"><label>Bathrooms</label><input id="uBaths" type="number" value="0"></div><div class="field"><label>Sq Ft</label><input id="uSqft" type="number"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent ₹</label><input id="uRent" type="number" value="0"></div><div class="field"><label>Deposit ₹</label><input id="uDep" type="number" value="0"></div></div>' +
      '<div class="field"><label>Floor</label><input id="uFloor" type="number"></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('unitForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('uName').value.trim(), bedrooms: parseInt(document.getElementById('uBeds').value) || 0, bathrooms: parseInt(document.getElementById('uBaths').value) || 0, squareFootage: parseInt(document.getElementById('uSqft').value) || undefined, rentAmount: parseFloat(document.getElementById('uRent').value) || 0, depositAmount: parseFloat(document.getElementById('uDep').value) || 0, floorNumber: parseInt(document.getElementById('uFloor').value) || undefined };
      try { var r = await api('/properties/buildings/' + buildingId + '/units', { method: 'POST', body: body }); if (r.ok) { document.getElementById('unitModal').remove(); showBuildingDetail(buildingId, '', ''); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Delete Unit Modal
  window.editUnit = function(id, name, beds, baths, sqft, rent, status, floor, deposit, desc) {
    var html =
      '<div class="modal-overlay open" id="editUnitModal"><div class="modal">' +
      '<h2>Edit Unit ' + h(name) + '</h2><form id="editUnitForm">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Bedrooms</label><input id="euBeds" type="number" value="' + beds + '"></div><div class="field"><label>Bathrooms</label><input id="euBaths" type="number" value="' + baths + '"></div><div class="field"><label>Sq Ft</label><input id="euSqft" type="number" value="' + sqft + '"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Rent ₹</label><input id="euRent" type="number" value="' + rent + '"></div><div class="field"><label>Deposit ₹</label><input id="euDep" type="number" value="' + deposit + '"></div><div class="field"><label>Floor</label><input id="euFloor" type="number" value="' + floor + '"></div></div>' +
      '<div class="field"><label>Status</label><select id="euStatus"><option value="VACANT"' + (status==='VACANT'?' selected':'') + '>Vacant</option><option value="OCCUPIED"' + (status==='OCCUPIED'?' selected':'') + '>Occupied</option><option value="MAINTENANCE"' + (status==='MAINTENANCE'?' selected':'') + '>Maintenance</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Save</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('editUnitForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { bedrooms: parseInt(document.getElementById('euBeds').value) || 0, bathrooms: parseInt(document.getElementById('euBaths').value) || 0, squareFootage: parseInt(document.getElementById('euSqft').value) || undefined, rentAmount: parseFloat(document.getElementById('euRent').value) || 0, depositAmount: parseFloat(document.getElementById('euDep').value) || 0, floorNumber: parseInt(document.getElementById('euFloor').value) || undefined, status: document.getElementById('euStatus').value };
      try { var r = await api('/properties/units/' + id, { method: 'PATCH', body: body }); if (r.ok) { document.getElementById('editUnitModal').remove(); showView('properties'); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Tenant Modal
  window.openTenantModal = function() {
    var html =
      '<div class="modal-overlay open" id="tenantModal"><div class="modal">' +
      '<h2>Add Tenant</h2><form id="tenantForm">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>First Name *</label><input id="tFn" required></div><div class="field"><label>Last Name *</label><input id="tLn" required></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Email *</label><input type="email" id="tEmail" required></div><div class="field"><label>Phone</label><input id="tPhone"></div></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('tenantForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { firstName: document.getElementById('tFn').value.trim(), lastName: document.getElementById('tLn').value.trim(), email: document.getElementById('tEmail').value.trim(), phone: document.getElementById('tPhone').value.trim() || undefined };
      try { var r = await api('/tenants', { method: 'POST', body: body }); if (r.ok) { document.getElementById('tenantModal').remove(); renderTenants(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Lease Modal
  window.openLeaseModal = function() {
    // Fetch units and tenants for dropdowns
    Promise.all([api('/properties?limit=200'), api('/tenants?limit=200')]).then(function(results) {
      var units = [];
      var tenants = [];
      if (results[0].ok) {
        var props = results[0].data.data || [];
        // We need to get buildings and units - simplified: use a units endpoint
        api('/properties?limit=200').then(function() {});
      }
      var html =
        '<div class="modal-overlay open" id="leaseModal"><div class="modal">' +
        '<h2>Create Lease</h2><form id="leaseForm">' +
        '<div class="field"><label>Tenant *</label><select id="lTenant" required>' +
        (results[1].ok ? (results[1].data.data || []).map(function(t) { return '<option value="' + t.id + '">' + h(t.firstName) + ' ' + h(t.lastName) + '</option>'; }).join('') : '') +
        '</select></div>' +
        '<div class="field"><label>Unit *</label><select id="lUnit" required><option value="">Select tenant first</option></select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent Amount ₹ *</label><input type="number" id="lRent" required></div><div class="field"><label>Deposit ₹</label><input type="number" id="lDep" value="0"></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Start Date *</label><input type="date" id="lStart" required></div><div class="field"><label>End Date</label><input type="date" id="lEnd"></div></div>' +
        '<div class="field"><label>Payment Day</label><input type="number" id="lPayDay" value="1" min="1" max="31"></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);

      // When tenant is selected, fetch units with leases
      document.getElementById('lTenant').addEventListener('change', function() {
        // For now, fetch all units and show vacant ones
        api('/properties?limit=200').then(function(pr) {
          var allUnits = [];
          if (pr.ok) {
            var props = pr.data.data || [];
            Promise.all(props.map(function(p) {
              return api('/properties/' + p.id + '/buildings').then(function(br) {
                if (br.ok) (br.data || []).forEach(function(b) {
                  b.units = []; // will be fetched separately
                });
              });
            }));
          }
        });
      });

      document.getElementById('leaseForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { tenantId: document.getElementById('lTenant').value, unitId: document.getElementById('lUnit').value, rentAmount: parseFloat(document.getElementById('lRent').value) || 0, depositAmount: parseFloat(document.getElementById('lDep').value) || 0, startDate: document.getElementById('lStart').value, endDate: document.getElementById('lEnd').value || null, paymentDay: parseInt(document.getElementById('lPayDay').value) || 1, status: 'ACTIVE' };
        try { var r = await api('/leases', { method: 'POST', body: body }); if (r.ok) { document.getElementById('leaseModal').remove(); renderLeases(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Invoice Modal
  window.openInvoiceModal = function() {
    // Fetch leases to populate dropdown
    api('/leases?limit=200').then(function(lr) {
      var html =
        '<div class="modal-overlay open" id="invModal"><div class="modal">' +
        '<h2>Create Invoice</h2><form id="invForm">' +
        '<div class="field"><label>Lease *</label><select id="iLease" required>' +
        (lr.ok ? (lr.data.data || []).map(function(l) { return '<option value="' + l.id + '">' + h(l.tenant ? l.tenant.firstName + ' ' + l.tenant.lastName : '') + ' - ' + (l.unit ? l.unit.name : '') + '</option>'; }).join('') : '') +
        '</select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent Amount ₹ *</label><input type="number" id="iRent" required></div><div class="field"><label>Late Fee ₹</label><input type="number" id="iLate" value="0"></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Period Start *</label><input type="date" id="iPerStart" required></div><div class="field"><label>Period End *</label><input type="date" id="iPerEnd" required></div></div>' +
        '<div class="field"><label>Due Date *</label><input type="date" id="iDue" required></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
      document.getElementById('invForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { leaseId: document.getElementById('iLease').value, rentAmount: parseFloat(document.getElementById('iRent').value) || 0, lateFee: parseFloat(document.getElementById('iLate').value) || 0, periodStart: document.getElementById('iPerStart').value, periodEnd: document.getElementById('iPerEnd').value, dueDate: document.getElementById('iDue').value, status: 'PENDING' };
        try { var r = await api('/invoices', { method: 'POST', body: body }); if (r.ok) { document.getElementById('invModal').remove(); renderFinance(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Expense Modal
  window.openExpenseModal = function() {
    api('/properties?limit=200').then(function(pr) {
      var html =
        '<div class="modal-overlay open" id="expModal"><div class="modal">' +
        '<h2>Add Expense</h2><form id="expForm">' +
        '<div class="field"><label>Amount ₹ *</label><input type="number" id="eAmt" required></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Category</label><select id="eCat"><option value="REPAIRS">Repairs</option><option value="MAINTENANCE">Maintenance</option><option value="UTILITIES">Utilities</option><option value="INSURANCE">Insurance</option><option value="TAXES">Taxes</option><option value="MANAGEMENT">Management</option><option value="OTHER">Other</option></select></div><div class="field"><label>Property</label><select id="eProp"><option value="">None</option>' +
        (pr.ok ? (pr.data.data || []).map(function(p) { return '<option value="' + p.id + '">' + h(p.name) + '</option>'; }).join('') : '') +
        '</select></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Date</label><input type="date" id="eDate"></div><div class="field"><label>Vendor</label><input id="eVendor"></div></div>' +
        '<div class="field"><label>Description</label><textarea id="eDesc"></textarea></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
      document.getElementById('expForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { amount: parseFloat(document.getElementById('eAmt').value) || 0, category: document.getElementById('eCat').value, propertyId: document.getElementById('eProp').value || null, expenseDate: document.getElementById('eDate').value || new Date().toISOString().split('T')[0], vendor: document.getElementById('eVendor').value.trim() || undefined, description: document.getElementById('eDesc').value.trim() || undefined };
        try { var r = await api('/expenses', { method: 'POST', body: body }); if (r.ok) { document.getElementById('expModal').remove(); renderFinance(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Vendor Modal
  window.openVendorModal = function() {
    var html =
      '<div class="modal-overlay open" id="vendorModal"><div class="modal">' +
      '<h2>Add Vendor</h2><form id="vendorForm">' +
      '<div class="field"><label>Company Name *</label><input id="vName" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Contact Person</label><input id="vContact"></div><div class="field"><label>Specialty</label><select id="vSpec"><option value="PLUMBING">Plumbing</option><option value="ELECTRICAL">Electrical</option><option value="HVAC">HVAC</option><option value="GENERAL">General</option><option value="PAINTING">Painting</option><option value="ROOFING">Roofing</option><option value="LANDSCAPING">Landscaping</option><option value="CLEANING">Cleaning</option><option value="OTHER">Other</option></select></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Email</label><input type="email" id="vEmail"></div><div class="field"><label>Phone</label><input id="vPhone"></div></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('vendorForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('vName').value.trim(), contactPerson: document.getElementById('vContact').value.trim() || undefined, email: document.getElementById('vEmail').value.trim() || undefined, phone: document.getElementById('vPhone').value.trim() || undefined, specialty: document.getElementById('vSpec').value };
      try { var r = await api('/vendors', { method: 'POST', body: body }); if (r.ok) { document.getElementById('vendorModal').remove(); renderVendors(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  /* ── Start ─────────────────────────────────────────────── */
  init();
})();
</script>
</body>
</html>`;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map