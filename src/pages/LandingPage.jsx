import React, { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import HeroAnimation from "./HeroAnimation";
import logo from "../assets/logo.png";
/* ─── SVG ICONS ─── */
const IconGlobal = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path className="v2-svg-path-flow" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconSchema = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path className="v2-svg-path-pulse" d="M3 9h18M9 21V9" />
  </svg>
);
const IconQuery = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="v2-svg-path-bolt" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconScale = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path className="v2-svg-path-float" d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </svg>
);
const IconSecurity = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="v2-svg-path-pulse" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconRealtime = () => (
  <svg className="v2-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path className="v2-svg-path-pulse" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const DataEngineSVG = ({ activeStep }) => (
  <svg className="v2-engine-svg" viewBox="0 0 400 400" fill="none">
    <circle cx="200" cy="200" r="30" className="v2-engine-core" fill="url(#coreGradient)" />
    <circle cx="200" cy="200" r="50" className="v2-engine-orbit-1" stroke="var(--v2-accent)" strokeOpacity="0.4" strokeWidth="1" />
    <circle cx="200" cy="200" r="80" className="v2-engine-orbit-2" stroke="var(--v2-accent-alt)" strokeOpacity="0.3" strokeWidth="1" />

    {[
      { cx: 200, cy: 120 }, { cx: 275, cy: 164 }, { cx: 248, cy: 262 }, { cx: 152, cy: 262 }, { cx: 125, cy: 164 }
    ].map((node, i) => (
      <g key={i} className={`v2-engine-node ${activeStep === i ? 'active' : ''}`}>
        <circle cx={node.cx} cy={node.cy} r={activeStep === i ? "12" : "8"} fill={activeStep === i ? "var(--v2-accent)" : "#ccc"} fillOpacity={activeStep === i ? "1" : "0.3"} />
        <path d={`M${node.cx} ${node.cy} L200 200`} stroke="currentColor" strokeOpacity="0.1" />
      </g>
    ))}

    <defs>
      <linearGradient id="coreGradient" x1="160" y1="160" x2="240" y2="240">
        <stop offset="0%" stopColor="#ff9500" />
        <stop offset="100%" stopColor="#ff4d4d" />
      </linearGradient>
    </defs>
  </svg>
);

const IDEPreview = ({ activeStep }) => {
  const content = [
    { title: "warehouse.config", type: "code", body: "source: snowflake\nauth: radiant_oauth\nregion: us-east-1" },
    { title: "forge_query.sql", type: "code", body: "SELECT * FROM events\nWHERE status = 'LIVE'\nLIMIT 100;" },
    { title: "history_v2.diff", type: "code", body: "- v1: manual_deploy\n+ v2: auto_radiant" },
    { title: "insights_view", type: "ui", body: "Vectorized Output: 40ms" },
    { title: "workspace_share", type: "ui", body: "Active Forgers: 12" }
  ];
  return (
    <div className="v2-ide-window">
      <div className="v2-ide-header">
        <div className="v2-ide-dots"><span></span><span></span><span></span></div>
        <div className="v2-ide-title">{content[activeStep]?.title}</div>
      </div>
      <div className="v2-ide-body">
        {content[activeStep]?.type === "code" ? (
          <pre><code>{content[activeStep].body}</code></pre>
        ) : (
          <div className="v2-ide-placeholder">{content[activeStep].body}</div>
        )}
      </div>
    </div>
  );
};

const CountUp = ({ end, duration = 2000, decimals = 0, suffix = "", prefix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(easeProgress * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

/* ─── DATA ─── */
const FEATURES = [
  {
    title: "Global Scale",
    desc: "Deploy across regions with zero-latency synchronization.",
    specs: ["99.99% SLO", "Multi-Region", "Auto-Sync"],
    color: "#ff9500", icon: <IconGlobal />
  },
  {
    title: "Schema First",
    desc: "Built-in quality control and automated governance.",
    specs: ["Type Safety", "Auto-Validation", "Governance"],
    color: "#ff4d4d", icon: <IconGlobal />
  },
  {
    title: "Query Forge",
    desc: "Vectorized SQL engine for extreme throughput.",
    specs: ["1.2M rows/s", "Sub-10ms", "Vector Engine"],
    color: "#ff9500", icon: <IconGlobal />
  },
  {
    title: "Auto-Scale",
    desc: "Dynamically matches your high-performance workload.",
    specs: ["Zero-Idle", "Cloud-Native", "Instant-UP"],
    color: "#ff4d4d", icon: <IconRealtime />
  },
  {
    title: "Safe Guard",
    desc: "Enterprise security with granular access control.",
    specs: ["RBAC", "Encryption", "Audit Logs"],
    color: "#ff9500", icon: <IconGlobal />
  },
  {
    title: "Real-time",
    desc: "Instant streaming data for real-time decisioning.",
    specs: ["100ms Ingestion", "WebSocket", "Live-Feed"],
    color: "#ff4d4d", icon: <IconRealtime />
  }
];

const IconStep1 = () => <svg className="v2-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7" /><path d="M4 7a2 2 0 012-2h12a2 2 0 012 2" /><path d="M12 5v14" /><path d="M4 12h16" /></svg>;
const IconStep2 = () => <svg className="v2-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>;
const IconStep3 = () => <svg className="v2-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
const IconStep4 = () => <svg className="v2-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>;
const IconStep5 = () => <svg className="v2-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;

const STEPS = [
  { title: "Warehouse", icon: <IconStep1 />, desc: "Establish a secure, high-throughput bridge to Snowflake or BigQuery with automated schema discovery." },
  { title: "SQL Forge", icon: <IconStep2 />, desc: "Multi-modal AI workspace for complex SQL construction, featuring real-time syntax validation." },
  { title: "History", icon: <IconStep3 />, desc: "Enterprise-grade versioning system that tracks every cell execution for instant rollbacks." },
  { title: "Insights", icon: <IconStep4 />, desc: "Transform massive datasets into interactive, vectorized visualizations with sub-100ms rendering." },
  { title: "Workspace", icon: <IconStep5 />, desc: "Collaborative cloud environment with granular RBAC and real-time multiplayer editing." }
];

const TICKER_ITEMS = ["LIVE: 1.2M rows/s", "LATENCY: 12ms", "QUERIES: 84k/min", "NODES: 124 Online", "Uptime: 99.999%"];

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Auto-Flow Logic */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 1500); // Increased speed from 2500ms to 1500ms
    return () => clearInterval(timer);
  }, []);

  /* IntersectionObserver for Fade-In-Out */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          entry.target.classList.remove("reveal-out");
        } else {
          entry.target.classList.add("reveal-out");
          entry.target.classList.remove("reveal-in");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="v2-container">
      <div className="v2-blobs">
        <div className="v2-blob v2-blob-1"></div>
        <div className="v2-blob v2-blob-2"></div>
      </div>

      <nav className={`v2-nav ${navScrolled ? "scrolled" : ""}`}>
        <div className="v2-nav-inner">
          <div className="v2-brand">
            <img src={logo} alt="QueryForge logo" className="v2-logo-img" />
          </div>
          <div className="v2-nav-links">
            <a href="#features">Features</a><a href="#how">How it works</a><a href="#pricing">Pricing</a>
            <a href="/login" className="v2-btn-login">Sign In</a>
            <a href="/signup" className="v2-btn-cta" style={{ textDecoration: 'none' }}>Get Started</a>
          </div>
        </div>
      </nav>
      <br />
      <br />
<br />
<br />
      <br />
      <section className="v2-hero split">
        <div className="v2-hero-text reveal-on-scroll">
          <div className="v2-ticker"><div className="v2-ticker-track">{[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (<span key={i} className="v2-ticker-item">{item}</span>))}</div></div>
          <div className="v2-badge pop-in">v2.0 Radiant is Live</div>
          <h1 className="v2-hero-title vibrant-stagger">
            <span className="word">Ship</span> <span className="word">Data</span>
            <span className="word gradient-1">Faster.</span><br />
            <span className="word">Scale</span> <span className="word">Beyond</span>
            <span className="word gradient-2">Limits.</span>
          </h1>
          <p className="v2-hero-sub-left">Next-gen data engine for extreme scale.</p>

          {/* Hero Data Points */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div style={{ padding: '14px 24px', background: '#fffcf9', border: '1px solid rgba(255,149,0,0.15)', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 1000, color: 'var(--v2-accent)', letterSpacing: '-0.5px' }}>100x</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px', marginTop: '4px' }}>Query Speed</div>
            </div>
            <div style={{ padding: '14px 24px', background: '#fffcf9', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 1000, color: '#111', letterSpacing: '-0.5px' }}>Zero</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px', marginTop: '4px' }}>Copy Storage</div>
            </div>
            <div style={{ padding: '14px 24px', background: '#fffcf9', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 1000, color: '#111', letterSpacing: '-0.5px' }}>ACID</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px', marginTop: '4px' }}>Compliant</div>
            </div>
          </div>

          <div className="v2-hero-actions-left"><button className="v2-btn-primary v2-btn-glow">Launch Workspace</button></div>
        </div>
        <div className="v2-hero-visual reveal-on-scroll">
          <HeroAnimation />
        </div>
      </section>

      <section id="features" className="v2-features">
        <div className="v2-features-inner">
          <div className="v2-section-header reveal-on-scroll">
            <div className="v2-masterclass-badge">PRO FEATURES</div>
            <h2>Engineering Masterclass</h2>
          </div>
          <div className="v2-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`v2-feature-card reveal-on-scroll delay-${i % 3}`}>
                <div className="v2-feature-icon-wrapper" style={{ '--feat-color': f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="v2-feature-specs">
                  {f.specs.map((s, si) => <span key={si}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="v2-how horizontal reveal-on-scroll">
        <div className="v2-how-glow"></div>
        <div className="v2-how-inner">
          <div className="v2-section-header">
            <div className="v2-masterclass-badge">PRO PLATFORM</div>
            <h2>Vertical Integration Masterclass</h2>
            <p className="v2-how-sub">An immersive journey through the high-velocity data engine.</p>
          </div>

          <div className="v2-horizontal-steps reveal-on-scroll">
            {STEPS.map((s, i) => (
              <div key={i} className={`v2-step-h ${activeStep === i ? 'active' : ''}`}>
                <div className="v2-step-h-icon">{s.icon}</div>
                <div className="v2-step-h-text">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="v2-step-h-line"><div className="v2-flow-energy"></div></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="v2-cta reveal-on-scroll">
        <div className="v2-cta-inner">
          <h2 className="v2-cta-title">Ready to experience extreme scale?</h2>
          <p className="v2-cta-sub">Join thousands of engineers building the future of data analytics.</p>

          <div className="v2-cta-stats">
            <div className="v2-cta-stat">
              <div className="v2-cta-stat-number" style={{ color: 'var(--v2-accent)' }}><CountUp end={10} suffix="k+" /></div>
              <div className="v2-cta-stat-label">Active Teams</div>
            </div>
            <div className="v2-cta-stat-divider"></div>
            <div className="v2-cta-stat">
              <div className="v2-cta-stat-number"><CountUp end={99.99} decimals={2} suffix="%" /></div>
              <div className="v2-cta-stat-label">Uptime SLA</div>
            </div>
            <div className="v2-cta-stat-divider"></div>
            <div className="v2-cta-stat">
              <div className="v2-cta-stat-number"><CountUp end={1.2} decimals={1} suffix="M+" /></div>
              <div className="v2-cta-stat-label">Rows / Sec</div>
            </div>
            <div className="v2-cta-stat-divider"></div>
            <div className="v2-cta-stat">
              <div className="v2-cta-stat-number"><CountUp end={84} suffix="k" /></div>
              <div className="v2-cta-stat-label">Queries / Min</div>
            </div>
          </div>

          <a href="/signup" style={{ textDecoration: 'none' }}>
            <button className="v2-btn-cta">Get Started Now</button>
          </a>
        </div>
      </section>

      <footer className="v2-footer-new reveal-on-scroll">
        <div className="v2-footer-new-inner">
          <div className="v2-footer-new-top">
            <div className="v2-footer-new-brand-col">
              <div className="v2-brand" style={{ marginBottom: '16px' }}>
                <img src={logo} alt="QueryForge" className="v2-logo-img" style={{ height: '36px' }} />
              </div>
              <p className="v2-footer-new-tagline">Next-gen data engine for extreme scale analytics.</p>
            </div>
            <div className="v2-footer-new-link-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how">How it Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="v2-footer-new-link-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>
            <div className="v2-footer-new-link-col">
              <h4>Account</h4>
              <a href="/login">Log In</a>
              <a href="/signup">Sign Up</a>
              <a href="#">Support</a>
            </div>
          </div>
          <div className="v2-footer-new-bottom">
            <span>© 2026 QueryForge Inc.</span>
            <span className="v2-footer-new-powered">Powered by Arithwise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
