import{r as l,j as f}from"./vendor-CUQyNFW4.js";const u=`
:root{
  --bg: #eef4f1;
  --bg-2: #f7faf8;
  --panel: rgba(255,255,255,0.95);
  --panel-2: rgba(250,252,251,0.92);
  --panel-soft: rgba(245,249,247,0.92);
  --line: rgba(17,34,29,0.08);
  --line-strong: rgba(17,34,29,0.16);
  --text: #11221d;
  --text-2: #31453e;
  --muted: #6c8078;
  --brand: #03cd8c;
  --brand-2: #00b57a;
  --accent: #f77f00;
  --accent-soft: rgba(247,127,0,0.10);
  --danger: #eb6674;
  --shadow-xl: 0 28px 70px rgba(16,42,34,0.14);
  --shadow-lg: 0 18px 40px rgba(16,42,34,0.11);
  --shadow-md: 0 10px 24px rgba(16,42,34,0.08);
  --radius-xxl: 34px;
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 18px;
  --radius-sm: 14px;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
html,body{
  margin:0;
  padding:0;
  background:
    radial-gradient(circle at 12% 10%, rgba(3,205,140,0.10), transparent 26%),
    radial-gradient(circle at 90% 8%, rgba(247,127,0,0.08), transparent 22%),
    linear-gradient(180deg, #eef4f1 0%, #e7efeb 100%);
  color:var(--text);
  font-family:var(--font);
  overflow:hidden;
}
*{ box-sizing:border-box; }
button{ font: inherit; }

.fh-provider-shell{
  width:100%;
  min-height:100vh;
  padding:26px;
  background:
    radial-gradient(circle at 12% 10%, rgba(3,205,140,0.08), transparent 26%),
    radial-gradient(circle at 90% 8%, rgba(247,127,0,0.07), transparent 22%);
}
.fh-preview-shell{
  position:relative;
  width:min(1820px, 100%);
  min-height:1440px;
  margin:0 auto;
  border-radius:var(--radius-xxl);
  overflow:hidden;
  border:1px solid rgba(17,34,29,0.10);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.76), rgba(247,250,248,0.94)),
    rgba(255,255,255,0.90);
  box-shadow:var(--shadow-xl), inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-shell-noise{
  position:absolute; inset:0; pointer-events:none; opacity:.04;
  background-image:
    radial-gradient(rgba(17,34,29,0.10) .8px, transparent .8px),
    radial-gradient(rgba(17,34,29,0.06) .8px, transparent .8px);
  background-position:0 0, 10px 10px;
  background-size:20px 20px;
}
.fh-preview-app{
  position:relative;
  display:grid;
  grid-template-columns:336px minmax(0,1fr);
  min-height:1440px;
}
.fh-sidebar{
  display:flex;
  flex-direction:column;
  gap:14px;
  padding:22px 18px 20px 20px;
  background:linear-gradient(180deg, rgba(255,255,255,0.88), rgba(246,250,248,0.98));
  border-right:1px solid var(--line);
}
.fh-brand-card{
  display:flex;
  align-items:center;
  gap:14px;
  padding:16px;
  border-radius:24px;
  border:1px solid rgba(3,205,140,0.16);
  background:linear-gradient(145deg, rgba(3,205,140,0.11), rgba(247,127,0,0.06));
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.92);
}
.fh-brand-mark,.fh-nav-title-icon,.fh-item-icon,.fh-card-title-icon,.fh-mini-icon,.fh-topbar-icon,.fh-icon-btn svg{
  display:grid; place-items:center;
}
.fh-brand-mark{
  width:56px; height:56px; border-radius:18px; flex:0 0 56px;
  color:#043121;
  background:linear-gradient(135deg, var(--brand), #abf6d6);
  box-shadow:0 18px 30px rgba(3,205,140,0.22);
}
.fh-brand-mark svg{ width:28px; height:28px; }
.fh-brand-copy h1{
  margin:0; font-size:21px; line-height:1.08; letter-spacing:-0.03em;
}
.fh-brand-copy p{
  margin:5px 0 0; font-size:12px; line-height:1.5; color:var(--muted);
}
.fh-workspace-card{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:14px 16px;
  border-radius:18px;
  border:1px solid var(--line);
  background:var(--panel);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.92);
}
.fh-workspace-meta{
  display:flex; align-items:center; gap:12px; min-width:0;
}
.fh-workspace-avatar{
  width:42px; height:42px; flex:0 0 42px;
  border-radius:14px;
  display:grid; place-items:center;
  color:#083323; font-weight:800; font-size:13px;
  background:linear-gradient(135deg, rgba(3,205,140,0.92), rgba(247,127,0,0.84));
}
.fh-workspace-meta strong{
  display:block; font-size:14px; line-height:1.2;
}
.fh-workspace-meta span{
  display:block; margin-top:2px; font-size:11px; color:var(--muted); line-height:1.4;
}
.fh-live-pill{
  display:inline-flex; align-items:center; gap:6px;
  min-height:30px; padding:0 10px; border-radius:999px;
  font-size:10px; font-weight:900; letter-spacing:.06em;
  color:#035336; background:rgba(3,205,140,0.12);
  border:1px solid rgba(3,205,140,0.16);
  white-space:nowrap;
}
.fh-live-pill svg{ width:14px; height:14px; }

.fh-sidebar-scroll{
  position:relative;
  flex:1;
  min-height:0;
  padding-right:12px;
}
.fh-scroll-inner{
  position:relative;
  max-height:calc(100vh - 320px);
  min-height:780px;
  overflow-y:auto;
  padding-right:10px;
  display:flex;
  flex-direction:column;
  gap:12px;
  scrollbar-width:thin;
  scrollbar-color: rgba(3,205,140,0.82) rgba(17,34,29,0.08);
}
.fh-scroll-inner::-webkit-scrollbar{ width:10px; }
.fh-scroll-inner::-webkit-scrollbar-track{
  background:rgba(17,34,29,0.06); border-radius:999px;
}
.fh-scroll-inner::-webkit-scrollbar-thumb{
  background:linear-gradient(180deg, rgba(3,205,140,0.95), rgba(0,181,122,0.86));
  border-radius:999px;
  border:2px solid transparent;
  background-clip:padding-box;
}
.fh-sidebar-scrollbar{
  position:absolute; top:0; bottom:0; right:0; width:8px;
  border-radius:999px; background:rgba(17,34,29,0.06);
}
.fh-sidebar-scrollbar span{
  position:absolute; left:0; right:0; top:128px; height:120px;
  border-radius:999px;
  background:linear-gradient(180deg, rgba(3,205,140,0.92), rgba(0,181,122,0.86));
  box-shadow:0 10px 18px rgba(3,205,140,0.18);
}
.fh-nav-section{
  border-radius:20px;
  border:1px solid rgba(17,34,29,0.07);
  background:rgba(255,255,255,0.80);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.92);
  overflow:hidden;
  transition:border-color .24s ease, box-shadow .24s ease, background .24s ease;
}
.fh-nav-section.open{
  border-color:rgba(3,205,140,0.18);
  box-shadow:0 14px 28px rgba(3,205,140,0.10), inset 0 1px 0 rgba(255,255,255,0.92);
  background:linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,251,249,0.96));
}
.fh-accordion-header{
  width:100%;
  border:none;
  background:transparent;
  cursor:pointer;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:12px 12px;
}
.fh-accordion-title{
  display:flex; align-items:center; gap:12px; min-width:0;
}
.fh-nav-title-icon{
  width:34px; height:34px; flex:0 0 34px;
  border-radius:12px;
  color:var(--brand-2);
  background:rgba(3,205,140,0.10);
  border:1px solid rgba(3,205,140,0.12);
}
.fh-nav-title-icon svg,.fh-item-icon svg,.fh-card-title-icon svg,.fh-mini-icon svg,.fh-topbar-icon svg,.fh-icon-btn svg,.fh-chip svg,.fh-primary-btn svg,.fh-secondary-btn svg,.fh-hero-pill svg,.fh-live-pill svg,.fh-accordion-chevron svg{
  width:18px; height:18px;
}
.fh-nav-title-text{
  font-size:11px;
  font-weight:900;
  letter-spacing:.18em;
  color:var(--muted);
  text-transform:uppercase;
}
.fh-accordion-chevron{
  width:32px; height:32px; flex:0 0 32px;
  border-radius:10px; display:grid; place-items:center;
  color:var(--muted);
  background:rgba(17,34,29,0.04);
  transition:transform .24s ease, color .24s ease, background .24s ease;
}
.fh-nav-section.open .fh-accordion-chevron{
  color:var(--brand-2);
  background:rgba(3,205,140,0.10);
  transform:rotate(180deg);
}
.fh-nav-panel{
  overflow:hidden;
  max-height:0;
  opacity:0;
  transform:translateY(-6px);
  transition:max-height .36s ease, opacity .22s ease, transform .22s ease, padding .22s ease;
  padding:0 10px;
}
.fh-nav-section.open .fh-nav-panel{
  max-height:520px;
  opacity:1;
  transform:translateY(0);
  padding:0 10px 12px;
}
.fh-nav-item{
  width:100%;
  border:none;
  cursor:pointer;
  text-align:left;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  padding:9px 10px;
  border-radius:14px;
  background:transparent;
  color:var(--text-2);
  transition:all .18s ease;
}
.fh-nav-item + .fh-nav-item{ margin-top:6px; }
.fh-nav-item:hover{ background:rgba(17,34,29,0.04); }
.fh-nav-item.is-active{
  color:var(--text);
  background:linear-gradient(135deg, rgba(3,205,140,0.16), rgba(3,205,140,0.06));
  border:1px solid rgba(3,205,140,0.16);
  box-shadow:0 10px 22px rgba(3,205,140,0.09), inset 0 1px 0 rgba(255,255,255,0.72);
}
.fh-nav-item-left{
  display:flex; align-items:center; gap:10px; min-width:0;
}
.fh-item-icon{
  width:30px; height:30px; flex:0 0 30px;
  border-radius:10px;
  color:var(--muted);
  background:rgba(17,34,29,0.04);
}
.fh-nav-item.is-active .fh-item-icon{
  color:var(--brand-2);
  background:rgba(3,205,140,0.12);
}
.fh-nav-item-label{
  font-size:12.5px;
  font-weight:650;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.fh-item-pill{
  min-height:24px;
  padding:0 8px;
  border-radius:999px;
  display:inline-flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:900; letter-spacing:.08em;
  color:#a73e49;
  background:rgba(235,102,116,0.10);
  border:1px solid rgba(235,102,116,0.16);
  flex-shrink:0;
}
.fh-sidebar-footer{
  padding:16px;
  border-radius:22px;
  background:linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,251,249,0.98));
  border:1px solid var(--line);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.94);
}
.fh-sidebar-footer h4{ margin:0 0 6px; font-size:15px; letter-spacing:-0.02em; }
.fh-sidebar-footer p{ margin:0 0 14px; font-size:12px; line-height:1.55; color:var(--muted); }
.fh-footer-actions{ display:flex; gap:10px; }

.fh-primary-btn,.fh-secondary-btn{
  min-height:42px;
  padding:0 14px;
  border-radius:14px;
  border:none;
  font-weight:800;
  font-size:13px;
  cursor:pointer;
  display:inline-flex; align-items:center; gap:8px;
}
.fh-primary-btn{
  color:#053523;
  background:linear-gradient(135deg, var(--brand), #98f1ce);
  box-shadow:0 14px 24px rgba(3,205,140,0.18);
}
.fh-secondary-btn{
  color:var(--text);
  background:rgba(17,34,29,0.05);
  border:1px solid var(--line);
}

.fh-workspace{
  min-width:0;
  display:flex;
  flex-direction:column;
}
.fh-topbar{
  position:relative;
  z-index:2;
  display:flex;
  flex-direction:column;
  gap:14px;
  padding:18px 22px;
  background:linear-gradient(180deg, rgba(255,255,255,0.92), rgba(249,252,251,0.88));
  border-bottom:1px solid var(--line);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-topbar-primary{
  display:grid;
  grid-template-columns: 300px minmax(0,1fr) auto;
  gap:16px;
  align-items:center;
}
.fh-breadcrumb{
  display:flex; align-items:center; gap:8px;
  min-height:46px; padding:0 14px;
  border-radius:16px;
  background:rgba(17,34,29,0.04);
  border:1px solid var(--line);
  color:var(--text-2); font-size:12px; font-weight:700;
}
.fh-divider{ color:var(--muted); }
.fh-topbar-icon{
  width:18px; height:18px; color:var(--muted);
}
.fh-search-wrap{
  min-height:48px;
  display:flex; align-items:center; gap:10px;
  padding:0 16px;
  border-radius:18px;
  background:var(--panel);
  border:1px solid var(--line);
  color:var(--muted); font-size:13px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.94);
}
.fh-topbar-actions{
  display:flex; align-items:center; gap:10px;
}
.fh-icon-btn{
  width:44px; height:44px;
  border-radius:14px;
  border:1px solid var(--line);
  background:var(--panel);
  cursor:pointer;
  display:grid; place-items:center;
  color:var(--text-2);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.94);
}
.fh-avatar-pill{
  min-width:60px; height:46px;
  border-radius:16px;
  border:1px solid rgba(3,205,140,0.16);
  background:linear-gradient(135deg, rgba(3,205,140,0.10), rgba(247,127,0,0.06));
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:0 12px;
}
.fh-avatar-dot{
  width:8px; height:8px; border-radius:999px; background:var(--brand);
  box-shadow:0 0 0 6px rgba(3,205,140,0.12);
}
.fh-avatar-pill strong{ font-size:12px; letter-spacing:.04em; }

.fh-topbar-secondary{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:18px;
}
.fh-page-title{
  min-width:0;
}
.fh-page-title h2{
  margin:10px 0 8px;
  font-size:34px;
  line-height:1.05;
  letter-spacing:-0.05em;
}
.fh-page-title p{
  margin:0;
  max-width:900px;
  font-size:14px;
  line-height:1.6;
  color:var(--muted);
}
.fh-command-actions{
  display:flex; align-items:center; gap:10px; flex-shrink:0;
}
.fh-chip,.fh-hero-pill{
  display:inline-flex; align-items:center; gap:8px;
  min-height:32px; padding:0 12px;
  border-radius:999px;
  font-size:11px; font-weight:900; letter-spacing:.08em;
}
.chip-brand{
  color:#035336;
  background:rgba(3,205,140,0.12);
  border:1px solid rgba(3,205,140,0.16);
}
.chip-soft{
  color:var(--text-2);
  background:rgba(17,34,29,0.05);
  border:1px solid var(--line);
}

.fh-body{
  display:grid;
  grid-template-columns:minmax(0, 1fr) 330px;
  gap:18px;
  padding:18px;
}
.fh-main{ min-width:0; display:flex; flex-direction:column; gap:18px; }
.fh-hero-card{
  display:flex; justify-content:space-between; gap:18px;
  padding:22px;
  border-radius:30px;
  border:1px solid rgba(3,205,140,0.12);
  background:
    radial-gradient(circle at 85% 18%, rgba(247,127,0,0.10), transparent 24%),
    linear-gradient(135deg, rgba(255,255,255,0.97), rgba(246,250,248,0.94));
  box-shadow:var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-hero-copy h3{
  margin:14px 0 10px;
  font-size:28px;
  line-height:1.08;
  letter-spacing:-0.045em;
}
.fh-hero-copy p{
  margin:0;
  max-width:760px;
  color:var(--muted);
  font-size:14px;
  line-height:1.62;
}
.fh-hero-badges{
  display:flex; flex-direction:column; gap:10px; justify-content:center; align-items:flex-end;
}
.fh-hero-pill{
  color:#035336;
  background:rgba(3,205,140,0.12);
  border:1px solid rgba(3,205,140,0.16);
}
.fh-stats-grid{
  display:grid;
  grid-template-columns:repeat(4, minmax(0,1fr));
  gap:14px;
}
.fh-stat-card{
  padding:18px;
  border-radius:24px;
  border:1px solid var(--line);
  background:var(--panel);
  box-shadow:var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-stat-head{
  display:flex; align-items:center; gap:8px;
  font-size:11px; font-weight:900; letter-spacing:.10em;
  color:var(--muted);
  text-transform:uppercase;
}
.fh-mini-icon{
  width:28px; height:28px; border-radius:10px;
  color:var(--brand-2);
  background:rgba(3,205,140,0.10);
}
.fh-stat-card strong{
  display:block; margin:18px 0 10px;
  font-size:30px; line-height:1; letter-spacing:-0.04em;
}
.fh-stat-card p{
  margin:0; font-size:13px; line-height:1.55; color:var(--muted);
}
.fh-content-grid{
  display:grid;
  grid-template-columns:repeat(2, minmax(0,1fr));
  gap:16px;
}
.fh-feature-card{
  padding:18px;
  border-radius:26px;
  border:1px solid var(--line);
  background:var(--panel);
  box-shadow:var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-feature-card.span-two{ grid-column:span 2; }
.fh-card-head{
  display:flex; align-items:flex-start; gap:12px;
}
.fh-card-title-icon{
  width:40px; height:40px; flex:0 0 40px;
  border-radius:14px;
  color:var(--brand-2);
  background:rgba(3,205,140,0.10);
  border:1px solid rgba(3,205,140,0.12);
}
.fh-card-head h4{
  margin:1px 0 4px; font-size:18px; line-height:1.1; letter-spacing:-0.03em;
}
.fh-card-head p{
  margin:0; font-size:12.5px; line-height:1.55; color:var(--muted);
}
.fh-feature-layout{
  display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px;
}
.fh-soft-panel{
  margin-top:16px;
  padding:16px;
  border-radius:20px;
  background:linear-gradient(180deg, rgba(248,251,249,0.96), rgba(244,248,246,0.96));
  border:1px solid rgba(17,34,29,0.06);
}
.fh-soft-panel h5{
  margin:0 0 12px; font-size:14px; letter-spacing:-0.02em;
}
.fh-feature-list{
  margin:0; padding-left:18px;
  display:grid; gap:8px;
  color:var(--text-2); font-size:13px; line-height:1.55;
}
.fh-vertical-list{
  display:flex; flex-direction:column; gap:10px;
}
.fh-list-row{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:10px 12px;
  border-radius:14px;
  background:rgba(255,255,255,0.76);
  border:1px solid rgba(17,34,29,0.06);
  font-size:12.5px;
}
.fh-list-row span:last-child{ color:var(--muted); }
.fh-progress-row{
  display:grid; grid-template-columns: 84px minmax(0,1fr) 42px; gap:10px; align-items:center;
  margin-top:10px;
}
.fh-progress-row label,.fh-progress-row strong{
  font-size:12px; color:var(--text-2);
}
.fh-progress-row strong{ text-align:right; color:var(--muted); }
.fh-progress-bar{
  position:relative; height:10px; border-radius:999px;
  background:rgba(17,34,29,0.08); overflow:hidden;
}
.fh-progress-bar span{
  position:absolute; inset:0 auto 0 0; border-radius:999px;
  background:linear-gradient(90deg, var(--brand), var(--brand-2));
}
.fh-progress-bar.accent span{
  background:linear-gradient(90deg, var(--accent), #f6a84a);
}

.fh-right-rail{
  display:flex; flex-direction:column; gap:16px;
}
.fh-rail-card{
  padding:18px;
  border-radius:26px;
  border:1px solid var(--line);
  background:var(--panel);
  box-shadow:var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.96);
}
.fh-timeline{
  margin-top:16px;
  display:flex; flex-direction:column; gap:14px;
}
.fh-timeline-item{
  display:grid; grid-template-columns: 52px 18px minmax(0,1fr); gap:12px; align-items:flex-start;
}
.fh-time{
  padding-top:2px;
  font-size:11px; font-weight:900; letter-spacing:.08em; color:var(--muted);
}
.fh-dot-line{
  position:relative; width:18px; min-height:54px;
}
.fh-dot-line::before{
  content:""; position:absolute; left:7px; top:0; bottom:0; width:2px; border-radius:999px; background:rgba(17,34,29,0.08);
}
.fh-dot-line::after{
  content:""; position:absolute; left:3px; top:4px; width:10px; height:10px; border-radius:999px; background:var(--brand); box-shadow:0 0 0 6px rgba(3,205,140,0.12);
}
.fh-event-copy strong{
  display:block; font-size:13px; line-height:1.3;
}
.fh-event-copy span{
  display:block; margin-top:4px; font-size:12px; line-height:1.5; color:var(--muted);
}
.fh-health-panel{
  margin-top:16px;
  display:flex; align-items:center; gap:16px;
}
.fh-health-ring{
  width:94px; height:94px; flex:0 0 94px;
  border-radius:999px;
  display:grid; place-items:center;
  background:
    radial-gradient(circle at center, rgba(255,255,255,0.92) 0 58%, transparent 60%),
    conic-gradient(var(--brand) 0 78%, rgba(17,34,29,0.08) 78% 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.94);
}
.fh-health-ring strong{
  font-size:28px; letter-spacing:-0.04em;
}
.fh-health-copy strong{
  display:block; font-size:15px; line-height:1.35;
}
.fh-health-copy p{
  margin:6px 0 0; font-size:12.5px; line-height:1.6; color:var(--muted);
}
.fh-footer-note{
  margin-top:14px;
  padding:12px 14px;
  border-radius:16px;
  font-size:12px;
  line-height:1.6;
  color:var(--muted);
  background:rgba(17,34,29,0.04);
  border:1px solid var(--line);
}

@media (max-width: 1280px){
  .fh-preview-app{ grid-template-columns:300px minmax(0,1fr); }
  .fh-body{ grid-template-columns:1fr; }
  .fh-right-rail{ grid-row:1; }
  .fh-stats-grid{ grid-template-columns:repeat(2, minmax(0,1fr)); }
}
`,g=`
<div class="fh-provider-shell">
  <div class="fh-preview-shell">
    <div class="fh-shell-noise"></div>
    <div class="fh-preview-app">
      <aside class="fh-sidebar">
        <div class="fh-brand-card">
          <div class="fh-brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 13.7 8l4.8 1.7-4.8 1.7L12 16l-1.7-4.6L5.5 9.7 10.3 8 12 3.5Z"/><path d="M18.5 3.5v3"/><path d="M20 5h-3"/><path d="M5.5 16.5v4"/><path d="M7.5 18.5h-4"/></svg></div>
          <div class="fh-brand-copy">
            <h1>FaithHub Provider</h1>
            <p>Premium mission-control shell for ministries, churches, and faith organizations.</p>
          </div>
        </div>

        <div class="fh-workspace-card">
          <div class="fh-workspace-meta">
            <div class="fh-workspace-avatar">FH</div>
            <div>
              <strong>Restoration House Global</strong>
              <span>Multi-campus • Kampala / Nairobi / Online</span>
            </div>
          </div>
          <span class="fh-live-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20V4"/><path d="M8 8h8"/><path d="M7 20h10"/><path d="M5.5 12a6.5 6.5 0 0 1 13 0"/><path d="M3.8 12a8.2 8.2 0 0 1 16.4 0"/></svg><span>LIVE READY</span></span>
        </div>

        <div class="fh-sidebar-scroll">
          <div class="fh-scroll-inner">
            
            <section class="fh-nav-section" data-section-id="home">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="home">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4 10.5 12 4l8 6.5"/><path d="M6.5 9.8V20h11V9.8"/><path d="M9.5 20v-5.5h5V20"/></svg></span>
                  <span class="fh-nav-title-text">HOME</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="dashboard" data-parent-id="home">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4 10.5 12 4l8 6.5"/><path d="M6.5 9.8V20h11V9.8"/><path d="M9.5 20v-5.5h5V20"/></svg></span>
                    <span class="fh-nav-item-label">Dashboard</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="info">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="info">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="15" rx="2.4"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/></svg></span>
                  <span class="fh-nav-title-text">INFO &amp; EVENTS</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="event-manager" data-parent-id="info">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="15" rx="2.4"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/></svg></span>
                    <span class="fh-nav-item-label">Event Manager</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="noticeboard" data-parent-id="info">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M6 16.5h12"/><path d="M8 16.5V11a4 4 0 1 1 8 0v5.5"/><path d="M10 19a2 2 0 0 0 4 0"/></svg></span>
                    <span class="fh-nav-item-label">Noticeboard</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="books" data-parent-id="info">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M6 4.5h9.5a3 3 0 0 1 3 3V19"/><path d="M6 4.5A2.5 2.5 0 0 0 3.5 7V18A2.5 2.5 0 0 0 6 20.5h12.5"/><path d="M6 4.5V20.5"/></svg></span>
                    <span class="fh-nav-item-label">Books</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="resources" data-parent-id="info">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7 3.5h7l4 4V20.5H7Z"/><path d="M14 3.5v4h4"/><path d="M9.5 12h6"/><path d="M9.5 15.5h6"/></svg></span>
                    <span class="fh-nav-item-label">Resources</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="teachings">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="teachings">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 6.5 12 3l7.5 3.5L12 10Z"/><path d="M6 9.5v6.8c0 1.4 2.7 3.2 6 3.2s6-1.8 6-3.2V9.5"/><path d="M12 10v9.5"/></svg></span>
                  <span class="fh-nav-title-text">TEACHINGS</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="teachings-dashboard" data-parent-id="teachings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M9.5 4.5v15"/><path d="M9.5 10.5h11"/></svg></span>
                    <span class="fh-nav-item-label">Teachings Dashboard</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="standalone-teaching-builder" data-parent-id="teachings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4 20l4.7-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z"/><path d="m13.5 6.5 4 4"/></svg></span>
                    <span class="fh-nav-item-label">Standalone Teaching Builder</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="series-dashboard" data-parent-id="teachings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 4 4.5 8 12 12l7.5-4L12 4Z"/><path d="M4.5 12 12 16l7.5-4"/><path d="M4.5 16 12 20l7.5-4"/></svg></span>
                    <span class="fh-nav-item-label">Series Dashboard</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="series-builder" data-parent-id="teachings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 4 4.5 8 12 12l7.5-4L12 4Z"/><path d="M4.5 12 12 16l7.5-4"/><path d="M4.5 16 12 20l7.5-4"/></svg></span>
                    <span class="fh-nav-item-label">Series Builder</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="episode-builder" data-parent-id="teachings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7 4.5h10v15l-5-3.5-5 3.5Z"/></svg></span>
                    <span class="fh-nav-item-label">Episode Builder</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section open" data-section-id="live">
              <button class="fh-accordion-header" type="button" aria-expanded="true" data-section-trigger="live">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20V4"/><path d="M8 8h8"/><path d="M7 20h10"/><path d="M5.5 12a6.5 6.5 0 0 1 13 0"/><path d="M3.8 12a8.2 8.2 0 0 1 16.4 0"/></svg></span>
                  <span class="fh-nav-title-text">LIVE SESSIONZ</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item is-active" type="button" data-item-id="live-dashboard" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M3.5 12h4l2-4 4 8 2-4h5"/></svg></span>
                    <span class="fh-nav-item-label">Live Dashboard</span>
                  </span>
                  <span class="fh-item-pill">LIVE</span>
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="live-builder" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m4 20 8-8"/><path d="m12 12 8-8"/><path d="m15 4 1 3"/><path d="m18 7 3 1"/><path d="m5 11 1.5 2.8"/><path d="m8 14 2.8 1.5"/></svg></span>
                    <span class="fh-nav-item-label">Live Builder</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="live-schedule" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5l3 1.8"/></svg></span>
                    <span class="fh-nav-item-label">Live Schedule</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="live-studio" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="6" width="12.5" height="12" rx="2.2"/><path d="m16 10 4.5-2.5v9L16 14Z"/></svg></span>
                    <span class="fh-nav-item-label">Live Studio</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="stream-platforms" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m7.8 11 8-4"/><path d="m7.8 13 8 4"/></svg></span>
                    <span class="fh-nav-item-label">Stream to Platforms</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="post-live-publishing" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 16V7"/><path d="m8.5 10.5 3.5-3.5 3.5 3.5"/><path d="M4 16.5v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/></svg></span>
                    <span class="fh-nav-item-label">Post-live Publishing</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="replays-clips" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="M7.5 5.5v13"/><path d="M16.5 5.5v13"/><path d="M3.5 9.5h4"/><path d="M16.5 9.5h4"/><path d="M3.5 14.5h4"/><path d="M16.5 14.5h4"/></svg></span>
                    <span class="fh-nav-item-label">Replays &amp; Clips</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="reviews-moderation" data-parent-id="live">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="M12 8.2v4.6"/><circle cx="12" cy="16.3" r=".9" fill="currentColor" stroke="none"/></svg></span>
                    <span class="fh-nav-item-label">Reviews &amp; Moderation</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="audience">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="audience">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M16.5 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H8a3.5 3.5 0 0 0-3.5 3.5V19"/><circle cx="10.5" cy="8" r="3"/><path d="M18.8 19v-1a3 3 0 0 0-2.2-2.9"/><path d="M15.7 5.5a3 3 0 0 1 0 5"/></svg></span>
                  <span class="fh-nav-title-text">AUDIENCE</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="channels-contacts" data-parent-id="audience">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M16.5 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H8a3.5 3.5 0 0 0-3.5 3.5V19"/><circle cx="10.5" cy="8" r="3"/><path d="M18.8 19v-1a3 3 0 0 0-2.2-2.9"/><path d="M15.7 5.5a3 3 0 0 1 0 5"/></svg></span>
                    <span class="fh-nav-item-label">Channels &amp; Contact Manager</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="audience-notifications" data-parent-id="audience">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m3.5 12 16-8-4.5 16-3.2-5.2Z"/><path d="M19.5 4 11.8 12"/></svg></span>
                    <span class="fh-nav-item-label">Audience Notifications</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="beacon">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="beacon">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 12.5V9l10-4v11l-10-3.5Z"/><path d="M14.5 8.5h2a3 3 0 0 1 0 6h-2"/><path d="m7.5 14.5 1.4 4"/></svg></span>
                  <span class="fh-nav-title-text">BEACON</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="beacon-dashboard" data-parent-id="beacon">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 12.5V9l10-4v11l-10-3.5Z"/><path d="M14.5 8.5h2a3 3 0 0 1 0 6h-2"/><path d="m7.5 14.5 1.4 4"/></svg></span>
                    <span class="fh-nav-item-label">Beacon Dashboard</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="beacon-builder" data-parent-id="beacon">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 4.5 13.2 8l3.3 1.2-3.3 1.2L12 14l-1.2-3.6L7.5 9.2 10.8 8 12 4.5Z"/></svg></span>
                    <span class="fh-nav-item-label">Beacon Builder</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="beacon-marketplace" data-parent-id="beacon">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 8 6 4.5h12L19.5 8"/><path d="M5 8.5v9.5h14V8.5"/><path d="M9 12h6"/><path d="M8 18v-4.5h8V18"/></svg></span>
                    <span class="fh-nav-item-label">Beacon Marketplace</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="beacon-manager" data-parent-id="beacon">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M5 18.5h14"/><path d="M8 16V10"/><path d="M12 16V6.5"/><path d="M16 16v-3.5"/></svg></span>
                    <span class="fh-nav-item-label">Beacon Manager</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="commerce">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="commerce">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7 9V7a5 5 0 0 1 10 0v2"/><path d="M5 9.5h14l-1.2 10H6.2Z"/></svg></span>
                  <span class="fh-nav-title-text">COMMERCE</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="merchandise" data-parent-id="commerce">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7 9V7a5 5 0 0 1 10 0v2"/><path d="M5 9.5h14l-1.2 10H6.2Z"/></svg></span>
                    <span class="fh-nav-item-label">Merchandise</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="faithmart" data-parent-id="commerce">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 8 6 4.5h12L19.5 8"/><path d="M5 8.5v9.5h14V8.5"/><path d="M9 12h6"/><path d="M8 18v-4.5h8V18"/></svg></span>
                    <span class="fh-nav-item-label">FaithMart</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="giving">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="giving">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20s-6.5-4.2-8.3-8.3a4.7 4.7 0 0 1 8.3-4.4 4.7 4.7 0 0 1 8.3 4.4C18.5 15.8 12 20 12 20Z"/></svg></span>
                  <span class="fh-nav-title-text">CHARITY &amp; GIVING</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="wallet" data-parent-id="giving">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 7.5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"/><path d="M16.5 12h3"/><circle cx="15.2" cy="12" r=".9" fill="currentColor" stroke="none"/><path d="M5 7.5V6a1.5 1.5 0 0 1 1.5-1.5H17"/></svg></span>
                    <span class="fh-nav-item-label">Wallet</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="donations-funds" data-parent-id="giving">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20s-6.5-4.2-8.3-8.3a4.7 4.7 0 0 1 8.3-4.4 4.7 4.7 0 0 1 8.3 4.4C18.5 15.8 12 20 12 20Z"/></svg></span>
                    <span class="fh-nav-item-label">Donations &amp; Funds</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="charity-crowdfunding" data-parent-id="giving">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3"/><path d="M21.5 12h-3"/><path d="M12 18.5v3"/><path d="M5.5 12h-3"/></svg></span>
                    <span class="fh-nav-item-label">Charity Crowdfunding</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="community">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="community">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M8.5 12.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z"/><path d="M16.5 10.8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z"/><path d="M4.5 18.5a4.5 4.5 0 0 1 8.8-1.5"/><path d="M13.2 17.2a4 4 0 0 1 6.3 1.3"/></svg></span>
                  <span class="fh-nav-title-text">COMMUNITY</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="community-groups" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M8.5 12.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z"/><path d="M16.5 10.8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z"/><path d="M4.5 18.5a4.5 4.5 0 0 1 8.8-1.5"/><path d="M13.2 17.2a4 4 0 0 1 6.3 1.3"/></svg></span>
                    <span class="fh-nav-item-label">Community Groups</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="prayer-requests" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M9.5 12.5V5.5a2.5 2.5 0 0 1 5 0v7"/><path d="M9.5 8h-2A2.5 2.5 0 0 0 5 10.5v1.5A8 8 0 0 0 13 20h0a8 8 0 0 0 8-8v-1.5A2.5 2.5 0 0 0 18.5 8h-2"/></svg></span>
                    <span class="fh-nav-item-label">Prayer Requests</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="testimonies" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3.5Z"/></svg></span>
                    <span class="fh-nav-item-label">Testimonies</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="prayer-journal" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M6 4.5h10.5a2 2 0 0 1 2 2V20H8a2 2 0 0 1-2-2Z"/><path d="M6 4.5V18a2 2 0 0 0 2 2"/><path d="M11.5 10.5c.7-1.2 2.1-1.3 2.9-.4.8.9.7 2.1-.4 3.1l-2 1.8-2-1.8c-1-.9-1.2-2.2-.4-3.1.8-.9 2.2-.8 2.9.4Z"/></svg></span>
                    <span class="fh-nav-item-label">Prayer Journal</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="community-forum" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 6.5h15v10h-5l-2.5 2.5-2.5-2.5h-5Z"/></svg></span>
                    <span class="fh-nav-item-label">Community Forum</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="counseling" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M8.6 8.6 6.1 6.1"/><path d="m15.4 8.6 2.5-2.5"/><path d="m8.6 15.4-2.5 2.5"/><path d="m15.4 15.4 2.5 2.5"/></svg></span>
                    <span class="fh-nav-item-label">Counseling</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="projects" data-parent-id="community">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="7.5" width="17" height="11" rx="2.2"/><path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2"/><path d="M3.5 12h17"/></svg></span>
                    <span class="fh-nav-item-label">Projects</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="team">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="team">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M16.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M4.5 19a4 4 0 0 1 6-3.4"/><path d="M19.5 19a4 4 0 0 0-6-3.4"/><path d="M12 18.5a4 4 0 0 1 0-7.8 4 4 0 0 1 0 7.8Z"/></svg></span>
                  <span class="fh-nav-title-text">TEAM</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="leadership" data-parent-id="team">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m4.5 17 2-9 5.5 4 5.5-4 2 9Z"/><path d="M6.5 17h11"/></svg></span>
                    <span class="fh-nav-item-label">Leadership</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="serving-teams" data-parent-id="team">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M16.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M4.5 19a4 4 0 0 1 6-3.4"/><path d="M19.5 19a4 4 0 0 0-6-3.4"/><path d="M12 18.5a4 4 0 0 1 0-7.8 4 4 0 0 1 0 7.8Z"/></svg></span>
                    <span class="fh-nav-item-label">Serving Teams</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="roles-permissions" data-parent-id="team">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="m9.3 12.3 1.8 1.8 3.6-3.7"/></svg></span>
                    <span class="fh-nav-item-label">Roles &amp; Permissions</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="subscriptions" data-parent-id="team">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="13" rx="2.4"/><path d="M3.5 10h17"/><path d="M7.5 15h3"/></svg></span>
                    <span class="fh-nav-item-label">Subscriptions</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
            <section class="fh-nav-section" data-section-id="settings">
              <button class="fh-accordion-header" type="button" aria-expanded="false" data-section-trigger="settings">
                <span class="fh-accordion-title">
                  <span class="fh-nav-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="2.6"/><path d="M4.8 13.3 3.5 12l1.3-1.3.4-1.8 1.8-.4L8.3 7l1.8.4 1.9-.2 1.2-1.5 1.7.7L16.7 8l1.8.4.4 1.8L20.5 12l-1.6 1.8-.4 1.8-1.8.4-1.2 1.5-1.7-.7L12 16.7l-1.9.2-1.2 1.5-1.7-.7L7.3 16l-1.8-.4-.4-1.8Z"/></svg></span>
                  <span class="fh-nav-title-text">SETTINGS</span>
                </span>
                <span class="fh-accordion-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="m8 10 4 4 4-4"/></svg></span>
              </button>
              <div class="fh-nav-panel">
                
                <button class="fh-nav-item" type="button" data-item-id="workspace-settings" data-parent-id="settings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="2.6"/><path d="M4.8 13.3 3.5 12l1.3-1.3.4-1.8 1.8-.4L8.3 7l1.8.4 1.9-.2 1.2-1.5 1.7.7L16.7 8l1.8.4.4 1.8L20.5 12l-1.6 1.8-.4 1.8-1.8.4-1.2 1.5-1.7-.7L12 16.7l-1.9.2-1.2 1.5-1.7-.7L7.3 16l-1.8-.4-.4-1.8Z"/></svg></span>
                    <span class="fh-nav-item-label">Workspace Settings</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="moderation" data-parent-id="settings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="M12 8.2v4.6"/><circle cx="12" cy="16.3" r=".9" fill="currentColor" stroke="none"/></svg></span>
                    <span class="fh-nav-item-label">Moderation</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="audit" data-parent-id="settings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M9 4.5h6"/><path d="M10 3.5h4a1 1 0 0 1 1 1v1H9v-1a1 1 0 0 1 1-1Z"/><rect x="5.5" y="5.5" width="13" height="15" rx="2"/><path d="M8.5 10h7"/><path d="M8.5 14h7"/><path d="M8.5 18h4"/></svg></span>
                    <span class="fh-nav-item-label">Audit</span>
                  </span>
                  
                </button>
            
                <button class="fh-nav-item" type="button" data-item-id="qa-center" data-parent-id="settings">
                  <span class="fh-nav-item-left">
                    <span class="fh-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.8 14.3 5l2.6-.2.9 2.4 2 1.6-.9 2.4.3 2.6-2.1 1.4-.7 2.5-2.6-.1-2.3 1.2-2.3-1.2-2.6.1-.7-2.5-2.1-1.4.3-2.6-.9-2.4 2-1.6.9-2.4 2.6.2Z"/><path d="m9.2 12.4 1.8 1.8 3.8-4"/></svg></span>
                    <span class="fh-nav-item-label">QA Center</span>
                  </span>
                  
                </button>
            
              </div>
            </section>
        
          </div>
          <div class="fh-sidebar-scrollbar"><span></span></div>
        </div>

        <div class="fh-sidebar-footer">
          <h4>Quick Create</h4>
          <p>Launch a live session, teaching, Beacon campaign, or giving moment without leaving the shell.</p>
          <div class="fh-footer-actions">
            <button class="fh-primary-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 5v14"/><path d="M5 12h14"/></svg><span>New Live Session</span></button>
            <button class="fh-secondary-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg><span>Open Builder</span></button>
          </div>
        </div>
      </aside>

      <section class="fh-workspace">
        <header class="fh-topbar">
          <div class="fh-topbar-primary">
            <div class="fh-breadcrumb">
              <span class="fh-topbar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4 10.5 12 4l8 6.5"/><path d="M6.5 9.8V20h11V9.8"/><path d="M9.5 20v-5.5h5V20"/></svg></span>
              <span>Provider</span>
              <span class="fh-divider">/</span>
              <span>Mission Control</span>
            </div>

            <div class="fh-search-wrap">
              <span class="fh-topbar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg></span>
              <span>Search live sessions, teachings, contacts, Beacon campaigns, funds, and settings</span>
            </div>

            <div class="fh-topbar-actions">
              <button class="fh-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M6 16.5h12"/><path d="M8 16.5V11a4 4 0 1 1 8 0v5.5"/><path d="M10 19a2 2 0 0 0 4 0"/></svg></button>
              <button class="fh-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="15" rx="2.4"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/></svg></button>
              <button class="fh-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/></svg></button>
              <div class="fh-avatar-pill">
                <span class="fh-avatar-dot"></span>
                <strong>EO</strong>
              </div>
            </div>
          </div>

          <div class="fh-topbar-secondary">
            <div class="fh-page-title">
              <span class="fh-chip chip-brand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4"/><path d="M12 3.5a13 13 0 0 1 0 17"/><path d="M12 3.5a13 13 0 0 0 0 17"/></svg><span>WORLD-CLASS PROVIDER SHELL</span></span>
              <h2>Provider Mission Control</h2>
              <p>One elegant desktop shell for live ministry, teachings, outreach, Beacon promotion, charity & giving, community care, team governance, moderation, audit, and QA.</p>
            </div>
            <div class="fh-command-actions">
              <button class="fh-secondary-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="15" rx="2.4"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/></svg><span>Schedule Review</span></button>
              <button class="fh-secondary-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 12.5V9l10-4v11l-10-3.5Z"/><path d="M14.5 8.5h2a3 3 0 0 1 0 6h-2"/><path d="m7.5 14.5 1.4 4"/></svg><span>Launch Beacon</span></button>
              <button class="fh-primary-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 5v14"/><path d="M5 12h14"/></svg><span>Create</span></button>
            </div>
          </div>
        </header>

        <div class="fh-body">
          <main class="fh-main">
            <section class="fh-hero-card">
              <div class="fh-hero-copy">
                <span class="fh-hero-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 4.5 13.2 8l3.3 1.2-3.3 1.2L12 14l-1.2-3.6L7.5 9.2 10.8 8 12 4.5Z"/></svg><span>Provider OS</span></span>
                <h3>The sidebar now behaves like a true executive navigation system</h3>
                <p>Each category is collapsible under its own capitalized title, every item carries a rightful icon, only one section can remain open at a time, and the sidebar stays scrollable without feeling cluttered.</p>
              </div>
              <div class="fh-hero-badges">
                <span class="fh-chip chip-soft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="m9.3 12.3 1.8 1.8 3.6-3.7"/></svg><span>Moderation Visible</span></span>
                <span class="fh-chip chip-soft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 6.5 12 3l7.5 3.5L12 10Z"/><path d="M6 9.5v6.8c0 1.4 2.7 3.2 6 3.2s6-1.8 6-3.2V9.5"/><path d="M12 10v9.5"/></svg><span>Standalone + Series</span></span>
                <span class="fh-chip chip-soft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 12.5V9l10-4v11l-10-3.5Z"/><path d="M14.5 8.5h2a3 3 0 0 1 0 6h-2"/><path d="m7.5 14.5 1.4 4"/></svg><span>Beacon Linked or Standalone</span></span>
                <span class="fh-chip chip-soft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20s-6.5-4.2-8.3-8.3a4.7 4.7 0 0 1 8.3-4.4 4.7 4.7 0 0 1 8.3 4.4C18.5 15.8 12 20 12 20Z"/></svg><span>Giving + Crowdfunding</span></span>
              </div>
            </section>

            <section class="fh-stats-grid">
              
            <article class="fh-stat-card">
              <div class="fh-stat-head">
                <span class="fh-mini-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M13.5 2.5 6 13h4l-1 8.5L18 10.5h-4l-.5-8Z"/></svg></span>
                <span>LIVE READINESS</span>
              </div>
              <strong>96%</strong>
              <p>Tonight’s global prayer broadcast is green across studio, moderation, and distribution.</p>
            </article>
        
            <article class="fh-stat-card">
              <div class="fh-stat-head">
                <span class="fh-mini-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 4 4.5 8 12 12l7.5-4L12 4Z"/><path d="M4.5 12 12 16l7.5-4"/><path d="M4.5 16 12 20l7.5-4"/></svg></span>
                <span>TEACHING PIPELINE</span>
              </div>
              <strong>18</strong>
              <p>Series, standalone teachings, and episodes are progressing in one connected shell.</p>
            </article>
        
            <article class="fh-stat-card">
              <div class="fh-stat-head">
                <span class="fh-mini-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M16.5 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H8a3.5 3.5 0 0 0-3.5 3.5V19"/><circle cx="10.5" cy="8" r="3"/><path d="M18.8 19v-1a3 3 0 0 0-2.2-2.9"/><path d="M15.7 5.5a3 3 0 0 1 0 5"/></svg></span>
                <span>AUDIENCE HEALTH</span>
              </div>
              <strong>82%</strong>
              <p>Push, email, SMS, WhatsApp, and channel consent hygiene remain strong.</p>
            </article>
        
            <article class="fh-stat-card">
              <div class="fh-stat-head">
                <span class="fh-mini-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20s-6.5-4.2-8.3-8.3a4.7 4.7 0 0 1 8.3-4.4 4.7 4.7 0 0 1 8.3 4.4C18.5 15.8 12 20 12 20Z"/></svg></span>
                <span>GIVING MOMENTUM</span>
              </div>
              <strong>$48.2k</strong>
              <p>Recurring donors, funds, and charity crowdfunding are moving inside one finance layer.</p>
            </article>
        
            </section>

            <section class="fh-content-grid">
              <article class="fh-feature-card span-two">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4"/><path d="M12 3.5a13 13 0 0 1 0 17"/><path d="M12 3.5a13 13 0 0 0 0 17"/></svg></span>
                  <div>
                    <h4>Provider Shell Overview</h4>
                    <p>Strong information hierarchy, premium whitespace, role-aware navigation, and operational clarity across the full provider journey.</p>
                  </div>
                </div>
                <div class="fh-feature-layout">
                  <div class="fh-soft-panel">
                    <h5>What changed in this regeneration</h5>
                    <ul class="fh-feature-list">
                      <li>Accordion sidebar with one-open-at-a-time behavior</li>
                      <li>All category titles in uppercase</li>
                      <li>Rightful icons for category titles and every sidebar item</li>
                      <li>Improved scrollable sidebar experience</li>
                      <li>Cleaner hierarchy between navigation, workspace, and quick actions</li>
                    </ul>
                  </div>
                  <div class="fh-soft-panel">
                    <h5>FaithHub provider architecture retained</h5>
                    <ul class="fh-feature-list">
                      <li>Optional standalone teachings alongside Series and Episodes</li>
                      <li>Live Sessions lifecycle from planning to replay publishing</li>
                      <li>Beacon as linked or standalone promotion</li>
                      <li>Standard giving plus charity crowdfunding journeys</li>
                      <li>Team intentionally placed before Settings</li>
                    </ul>
                  </div>
                </div>
              </article>

              <article class="fh-feature-card">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 20V4"/><path d="M8 8h8"/><path d="M7 20h10"/><path d="M5.5 12a6.5 6.5 0 0 1 13 0"/><path d="M3.8 12a8.2 8.2 0 0 1 16.4 0"/></svg></span>
                  <div>
                    <h4>Live Sessions Readiness</h4>
                    <p>Broadcast control, studio, scheduling, platform routing, and post-live flow remain tightly connected.</p>
                  </div>
                </div>
                <div class="fh-soft-panel">
                  <h5>Tonight’s operating status</h5>
                  <div class="fh-vertical-list">
                    <div class="fh-list-row"><span>Global Prayer Night</span><span>Ready • 18:30</span></div>
                    <div class="fh-list-row"><span>Backup ingest</span><span>Green</span></div>
                    <div class="fh-list-row"><span>Caption operator</span><span>Assigned</span></div>
                    <div class="fh-list-row"><span>Post-live publishing</span><span>Auto queue armed</span></div>
                  </div>
                </div>
              </article>

              <article class="fh-feature-card">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M16.5 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H8a3.5 3.5 0 0 0-3.5 3.5V19"/><circle cx="10.5" cy="8" r="3"/><path d="M18.8 19v-1a3 3 0 0 0-2.2-2.9"/><path d="M15.7 5.5a3 3 0 0 1 0 5"/></svg></span>
                  <div>
                    <h4>Audience Activation</h4>
                    <p>One provider-grade outreach layer across push, email, SMS, and messaging channels.</p>
                  </div>
                </div>
                <div class="fh-soft-panel">
                  <h5>Channel mix health</h5>
                  
        <div class="fh-progress-row">
          <label>Push</label>
          <div class="fh-progress-bar"><span style="width:82%"></span></div>
          <strong>82%</strong>
        </div>
    
                  
        <div class="fh-progress-row">
          <label>Email</label>
          <div class="fh-progress-bar"><span style="width:74%"></span></div>
          <strong>74%</strong>
        </div>
    
                  
        <div class="fh-progress-row">
          <label>WhatsApp</label>
          <div class="fh-progress-bar accent"><span style="width:61%"></span></div>
          <strong>61%</strong>
        </div>
    
                  
        <div class="fh-progress-row">
          <label>Telegram</label>
          <div class="fh-progress-bar"><span style="width:38%"></span></div>
          <strong>38%</strong>
        </div>
    
                </div>
              </article>

              <article class="fh-feature-card">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M4.5 12.5V9l10-4v11l-10-3.5Z"/><path d="M14.5 8.5h2a3 3 0 0 1 0 6h-2"/><path d="m7.5 14.5 1.4 4"/></svg></span>
                  <div>
                    <h4>Beacon Promotion OS</h4>
                    <p>Campaign planning, creative, placements, and measurement all remain visible from provider mission control.</p>
                  </div>
                </div>
                <div class="fh-soft-panel">
                  <h5>Active campaigns</h5>
                  <div class="fh-vertical-list">
                    <div class="fh-list-row"><span>Revival Night Launch</span><span>Active • 2.8x ROAS</span></div>
                    <div class="fh-list-row"><span>Charity Water Drive</span><span>Learning • High intent</span></div>
                    <div class="fh-list-row"><span>Youth Worship Replay</span><span>Ready • Launch today</span></div>
                  </div>
                </div>
              </article>

              <article class="fh-feature-card">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M8.5 12.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z"/><path d="M16.5 10.8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z"/><path d="M4.5 18.5a4.5 4.5 0 0 1 8.8-1.5"/><path d="M13.2 17.2a4 4 0 0 1 6.3 1.3"/></svg></span>
                  <div>
                    <h4>Community & Care</h4>
                    <p>Warmth and operational rigor coexist across pastoral care and member engagement.</p>
                  </div>
                </div>
                <div class="fh-soft-panel">
                  <h5>Care queue</h5>
                  <div class="fh-vertical-list">
                    <div class="fh-list-row"><span>Prayer requests</span><span>14 new</span></div>
                    <div class="fh-list-row"><span>Counseling triage</span><span>3 urgent</span></div>
                    <div class="fh-list-row"><span>Testimonies pending</span><span>8 ready</span></div>
                    <div class="fh-list-row"><span>Community groups</span><span>42 active</span></div>
                  </div>
                </div>
              </article>

              <article class="fh-feature-card">
                <div class="fh-card-head">
                  <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="m9.3 12.3 1.8 1.8 3.6-3.7"/></svg></span>
                  <div>
                    <h4>Trust, Team & Governance</h4>
                    <p>Leadership, roles, moderation, audit, QA, and subscriptions are treated as first-class shell surfaces.</p>
                  </div>
                </div>
                <div class="fh-soft-panel">
                  <h5>Control posture</h5>
                  <div class="fh-vertical-list">
                    <div class="fh-list-row"><span>Leadership teams</span><span>Aligned</span></div>
                    <div class="fh-list-row"><span>Roles & permissions</span><span>Granular</span></div>
                    <div class="fh-list-row"><span>Moderation queue</span><span>7 open</span></div>
                    <div class="fh-list-row"><span>QA checks</span><span>19 passed</span></div>
                  </div>
                </div>
              </article>
            </section>
          </main>

          <aside class="fh-right-rail">
            <article class="fh-rail-card">
              <div class="fh-card-head">
                <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><rect x="3.5" y="5.5" width="17" height="15" rx="2.4"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/></svg></span>
                <div>
                  <h4>Today’s Command Queue</h4>
                  <p>Everything urgent across live production, team coordination, publishing, and approvals.</p>
                </div>
              </div>
              <div class="fh-timeline">
                <div class="fh-timeline-item"><div class="fh-time">09:00</div><div class="fh-dot-line"></div><div class="fh-event-copy"><strong>Production check</strong><span>Studio, Campus A</span></div></div><div class="fh-timeline-item"><div class="fh-time">11:30</div><div class="fh-dot-line"></div><div class="fh-event-copy"><strong>Leadership stand-up</strong><span>Mission Control</span></div></div><div class="fh-timeline-item"><div class="fh-time">16:00</div><div class="fh-dot-line"></div><div class="fh-event-copy"><strong>Series artwork approval</strong><span>Teachings</span></div></div><div class="fh-timeline-item"><div class="fh-time">18:30</div><div class="fh-dot-line"></div><div class="fh-event-copy"><strong>Global Prayer Night</strong><span>Live in 1h 12m</span></div></div><div class="fh-timeline-item"><div class="fh-time">21:00</div><div class="fh-dot-line"></div><div class="fh-event-copy"><strong>Replay publish window</strong><span>Post-live</span></div></div>
              </div>
            </article>

            <article class="fh-rail-card">
              <div class="fh-card-head">
                <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M3.5 12h4l2.2-4.2 3.6 8.4 2.2-4.2h5"/></svg></span>
                <div>
                  <h4>Workspace Health</h4>
                  <p>One score blending stream readiness, moderation posture, content completeness, and notification hygiene.</p>
                </div>
              </div>
              <div class="fh-health-panel">
                <div class="fh-health-ring"><strong>91</strong></div>
                <div class="fh-health-copy">
                  <strong>Healthy, premium, and launch-ready</strong>
                  <p>Moderation response times are inside target, live dependencies are green, and the provider workspace is ready for scale.</p>
                </div>
              </div>
            </article>

            <article class="fh-rail-card">
              <div class="fh-card-head">
                <span class="fh-card-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M12 3.5 19 6v6c0 4.7-3 7-7 8.5C8 19 5 16.7 5 12V6Z"/><path d="M12 8.2v4.6"/><circle cx="12" cy="16.3" r=".9" fill="currentColor" stroke="none"/></svg></span>
                <div>
                  <h4>Trust, QA & Approvals</h4>
                  <p>Provider-grade safeguards that keep the shell credible and safe.</p>
                </div>
              </div>
              <div class="fh-vertical-list">
                <div class="fh-list-row"><span>Moderation queue</span><span>07 open</span></div>
                <div class="fh-list-row"><span>Audit anomalies</span><span>01 warning</span></div>
                <div class="fh-list-row"><span>QA checks</span><span>19 passed</span></div>
                <div class="fh-list-row"><span>Pending approvals</span><span>12 awaiting</span></div>
              </div>
              <div class="fh-footer-note">Team remains intentionally placed before Settings, and the shell keeps moderation, audit, and QA visible instead of buried.</div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </div>
</div>
`;function m(){const s=l.useRef(null);return l.useEffect(()=>{const t=s.current;if(!t)return;const p=Array.from(t.querySelectorAll(".fh-nav-section")),c=Array.from(t.querySelectorAll(".fh-accordion-header")),r=Array.from(t.querySelectorAll(".fh-nav-item")),i=a=>{p.forEach(n=>{const e=n.dataset.sectionId===a;n.classList.toggle("open",e);const d=n.querySelector(".fh-accordion-header");d&&d.setAttribute("aria-expanded",String(e))})},o=a=>{r.forEach(n=>{const e=n.dataset.itemId===a;n.classList.toggle("is-active",e),e&&n.dataset.parentId&&i(n.dataset.parentId)})},h=c.map(a=>{const n=()=>{const e=a.dataset.sectionTrigger;e&&i(e)};return a.addEventListener("click",n),[a,n]}),v=r.map(a=>{const n=()=>{const e=a.dataset.itemId;e&&o(e)};return a.addEventListener("click",n),[a,n]});return i("live"),o("live-dashboard"),t.setAttribute("data-accordion-ready","true"),()=>{h.forEach(([a,n])=>a.removeEventListener("click",n)),v.forEach(([a,n])=>a.removeEventListener("click",n))}},[]),f.jsx("div",{ref:s,dangerouslySetInnerHTML:{__html:`<style>${u}</style>${g}`}})}export{m as default};
//# sourceMappingURL=FaithHubProviderShellLightV3-wq9c3TYn.js.map
