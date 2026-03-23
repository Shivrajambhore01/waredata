import React from 'react';
import './HeroAnimation.css';

export default function HeroAnimation() {
  return (
    <div className="ha-scene">
      {/* Vibrant background glows */}
      <div className="ha-bg-glow ha-glow-1"></div>
      <div className="ha-bg-glow ha-glow-2"></div>
      <div className="ha-bg-glow ha-glow-3"></div>

      {/* Connection lines with animated flow dots */}
      <svg className="ha-connections" viewBox="0 0 600 500" fill="none">
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9500" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lg2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="3" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="5" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Main connecting lines */}
        <path d="M300 240 L115 80" className="ha-line ha-l1" filter="url(#glow1)" />
        <path d="M300 240 L485 80" className="ha-line ha-l2" filter="url(#glow1)" />
        <path d="M300 240 L540 250" className="ha-line ha-l3" filter="url(#glow1)" />
        <path d="M300 240 L60 250" className="ha-line ha-l4" filter="url(#glow1)" />
        <path d="M300 240 L140 430" className="ha-line ha-l5" filter="url(#glow1)" />
        <path d="M300 240 L460 430" className="ha-line ha-l6" filter="url(#glow1)" />

        {/* Secondary net lines */}
        <path d="M115 80 L485 80" className="ha-line ha-l-net" />
        <path d="M60 250 L140 430" className="ha-line ha-l-net" />
        <path d="M540 250 L460 430" className="ha-line ha-l-net" />
        <path d="M115 80 L60 250" className="ha-line ha-l-net" />
        <path d="M485 80 L540 250" className="ha-line ha-l-net" />
        <path d="M140 430 L460 430" className="ha-line ha-l-net" />

        {/* Animated flow dots */}
        <circle r="4" fill="#ff9500" filter="url(#glow2)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M300 240 L115 80" />
        </circle>
        <circle r="3.5" fill="#ff4d4d" filter="url(#glow2)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M300 240 L485 80" begin="0.4s" />
        </circle>
        <circle r="3" fill="#ffb347" filter="url(#glow2)">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M300 240 L540 250" begin="0.8s" />
        </circle>
        <circle r="3" fill="#ff9500" filter="url(#glow2)">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M300 240 L60 250" begin="0.2s" />
        </circle>
        <circle r="3.5" fill="#ff4d4d" filter="url(#glow2)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M300 240 L140 430" begin="0.6s" />
        </circle>
        <circle r="3" fill="#ffb347" filter="url(#glow2)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M300 240 L460 430" begin="1s" />
        </circle>
        {/* Return dots */}
        <circle r="2.5" fill="#ff9500" opacity="0.6" filter="url(#glow1)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M115 80 L300 240" begin="1.5s" />
        </circle>
        <circle r="2.5" fill="#ff4d4d" opacity="0.6" filter="url(#glow1)">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M485 80 L300 240" begin="2s" />
        </circle>
        {/* Net flow */}
        <circle r="2" fill="#ffb347" opacity="0.5">
          <animateMotion dur="5s" repeatCount="indefinite" path="M115 80 L485 80" begin="1s" />
        </circle>
        <circle r="2" fill="#ff9500" opacity="0.5">
          <animateMotion dur="5s" repeatCount="indefinite" path="M140 430 L460 430" begin="2s" />
        </circle>
      </svg>

      {/* Orbiting ring */}
      <div className="ha-orbit">
        <div className="ha-orbit-dot"></div>
        <div className="ha-orbit-dot ha-od2"></div>
        <div className="ha-orbit-dot ha-od3"></div>
      </div>
      <div className="ha-orbit ha-orbit-2">
        <div className="ha-orbit-dot"></div>
        <div className="ha-orbit-dot ha-od2"></div>
      </div>

      {/* ── LAPTOP ── */}
      <div className="ha-laptop">
        <div className="ha-laptop-glow"></div>
        <div className="ha-screen">
          <div className="ha-screen-hdr">
            <span className="ha-d ha-dr"></span>
            <span className="ha-d ha-dy"></span>
            <span className="ha-d ha-dg"></span>
            <span className="ha-stitle">forge_query.sql</span>
          </div>
          <div className="ha-code">
            <div className="ha-cl ha-ca1"><span className="ha-ln">1</span><span className="ha-kw">SELECT</span> <span className="ha-col">name</span>, <span className="ha-col">revenue</span>, <span className="ha-col">region</span></div>
            <div className="ha-cl ha-ca2"><span className="ha-ln">2</span><span className="ha-kw">FROM</span> <span className="ha-tbl">warehouse.analytics</span></div>
            <div className="ha-cl ha-ca3"><span className="ha-ln">3</span><span className="ha-kw">JOIN</span> <span className="ha-tbl">dim.regions</span> <span className="ha-kw">ON</span> <span className="ha-col">r.id</span> = <span className="ha-col">a.region_id</span></div>
            <div className="ha-cl ha-ca4"><span className="ha-ln">4</span><span className="ha-kw">WHERE</span> <span className="ha-col">status</span> = <span className="ha-str">'LIVE'</span> <span className="ha-kw">AND</span> <span className="ha-col">revenue</span> {'>'} <span className="ha-num">10000</span></div>
            <div className="ha-cl ha-ca5"><span className="ha-ln">5</span><span className="ha-kw">GROUP BY</span> <span className="ha-col">region</span> <span className="ha-kw">ORDER BY</span> <span className="ha-col">revenue</span> <span className="ha-kw">DESC</span></div>
            <div className="ha-result ha-ca6">
              <span className="ha-ri">⚡</span> <span>2,847 rows · 8ms · 3 partitions scanned</span>
            </div>
          </div>
          <div className="ha-cursor"></div>
        </div>
        <div className="ha-base"></div>
      </div>

      {/* ── Mini dashboard panel (right side) ── */}
      <div className="ha-mini-dash">
        <div className="ha-mini-hdr">Live Metrics</div>
        <div className="ha-mini-chart">
          <div className="ha-bar" style={{'--h':'60%','--delay':'0.5s','--c':'#ff9500'}}></div>
          <div className="ha-bar" style={{'--h':'85%','--delay':'0.7s','--c':'#ff4d4d'}}></div>
          <div className="ha-bar" style={{'--h':'45%','--delay':'0.9s','--c':'#ffb347'}}></div>
          <div className="ha-bar" style={{'--h':'70%','--delay':'1.1s','--c':'#ff9500'}}></div>
          <div className="ha-bar" style={{'--h':'90%','--delay':'1.3s','--c':'#ff4d4d'}}></div>
          <div className="ha-bar" style={{'--h':'55%','--delay':'1.5s','--c':'#ffb347'}}></div>
          <div className="ha-bar" style={{'--h':'75%','--delay':'1.7s','--c':'#ff9500'}}></div>
        </div>
        <div className="ha-mini-stat">
          <span className="ha-mini-num">1.2M</span>
          <span className="ha-mini-lbl">rows/sec</span>
        </div>
      </div>

      {/* ── NODE: Data Lake ── */}
      <div className="ha-node ha-n1">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-orange">
          <svg viewBox="0 0 40 40"><ellipse cx="20" cy="12" rx="14" ry="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M6 12v16c0 3.3 6.3 6 14 6s14-2.7 14-6V12" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M6 20c0 3.3 6.3 6 14 6s14-2.7 14-6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/></svg>
        </div>
        <span className="ha-nlbl">Data Lake</span>
      </div>

      {/* ── NODE: Pipeline ── */}
      <div className="ha-node ha-n2">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-coral">
          <svg viewBox="0 0 40 40"><path d="M4 20h8l4-8 4 16 4-12 4 8h8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="ha-nlbl">Pipeline</span>
      </div>

      {/* ── NODE: Dashboard ── */}
      <div className="ha-node ha-n3">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-amber">
          <svg viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M4 16h32" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="20" width="6" height="12" rx="1" fill="currentColor" opacity="0.3"/><rect x="17" y="24" width="6" height="8" rx="1" fill="currentColor" opacity="0.3"/><rect x="26" y="22" width="6" height="10" rx="1" fill="currentColor" opacity="0.3"/></svg>
        </div>
        <span className="ha-nlbl">Dashboard</span>
      </div>

      {/* ── NODE: ETL ── */}
      <div className="ha-node ha-n4">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-coral">
          <svg viewBox="0 0 40 40"><path d="M8 12h10l4 8-4 8H8l4-8-4-8z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M22 16h10M22 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="35" cy="16" r="2" fill="currentColor" opacity="0.5"/><circle cx="35" cy="24" r="2" fill="currentColor" opacity="0.5"/></svg>
        </div>
        <span className="ha-nlbl">ETL</span>
      </div>

      {/* ── NODE: Schema ── */}
      <div className="ha-node ha-n5">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-amber">
          <svg viewBox="0 0 40 40"><rect x="8" y="4" width="24" height="10" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="8" y="26" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="22" y="26" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M20 14v6M14 20v6M27 20v6" stroke="currentColor" strokeWidth="1.5"/></svg>
        </div>
        <span className="ha-nlbl">Schema</span>
      </div>

      {/* ── NODE: Charts ── */}
      <div className="ha-node ha-n6">
        <div className="ha-halo"></div>
        <div className="ha-nicon ha-c-orange">
          <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M20 6a14 14 0 0 1 14 14H20V6z" fill="currentColor" opacity="0.25"/><path d="M20 20L32 12" stroke="currentColor" strokeWidth="1.5"/></svg>
        </div>
        <span className="ha-nlbl">Charts</span>
      </div>

      {/* Floating particles */}
      <div className="ha-p ha-p1"></div>
      <div className="ha-p ha-p2"></div>
      <div className="ha-p ha-p3"></div>
      <div className="ha-p ha-p4"></div>
      <div className="ha-p ha-p5"></div>
      <div className="ha-p ha-p6"></div>
      <div className="ha-p ha-p7"></div>
      <div className="ha-p ha-p8"></div>
      <div className="ha-p ha-p9"></div>
      <div className="ha-p ha-p10"></div>
    </div>
  );
}
