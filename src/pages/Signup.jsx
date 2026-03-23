import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png';

export default function Signup() {
  const navigate = useNavigate();
const handleSignup = () => {
  navigate("/sql-editor");
};
  return (
    <div className="page-fade-in" style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* LEFT PANEL: The Dark Showcase */}
      <div style={{
        flex: 1, backgroundColor: '#090a0c', color: 'white', position: 'relative',
        display: 'flex', flexDirection: 'column', padding: '60px 80px', justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Top row: Back + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 10 }}>
          <button onClick={() => navigate('/')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'white', padding: '8px 20px', borderRadius: '100px', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '6px'
          }}>← Back</button>
          <img src={logo} alt="QueryForge" onClick={() => navigate('/')} style={{ height: '36px', cursor: 'pointer', filter: 'brightness(0) invert(1)' }} />
        </div>

        {/* Background Effects */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'var(--v2-accent)', opacity: '0.15', filter: 'blur(100px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-20%', width: '500px', height: '500px', background: '#ff4d4d', opacity: '0.1', filter: 'blur(120px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>

        {/* Center Pitch */}
        <div style={{ zIndex: 10, maxWidth: '500px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,149,0,0.1)', color: 'var(--v2-accent)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '24px', textTransform: 'uppercase', border: '1px solid rgba(255,149,0,0.2)' }}>
            System Access
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 1000, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px' }}>
            The Engine for <br />
            <span style={{ color: 'transparent', background: 'var(--v2-gradient-1)', WebkitBackgroundClip: 'text' }}>Extreme Scale.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#999', lineHeight: 1.6, marginBottom: '40px' }}>
            Enter the workspace where absolute velocity meets clinical precision. Sub-10ms performance on billions of rows.
          </p>

          {/* Social Proof / Stat */}
          <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 1000, color: 'white' }}>1.2M+</div>
              <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>Queries / Sec</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 1000, color: 'white' }}>99.99%</div>
              <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ zIndex: 10, fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
          © 2026 QueryForge Inc. All secure protocols active.
        </div>
      </div>

      {/* RIGHT PANEL: The Form */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>

        {/* Soft Radiant Background for Right Panel */}
        <div className="v2-blobs">
          <div className="v2-blob v2-blob-1" style={{ opacity: 0.6 }}></div>
          <div className="v2-blob v2-blob-2" style={{ opacity: 0.4 }}></div>
        </div>
        <div className="v2-mesh-bg"></div>

        {/* Auth Panel */}
        <div className="v2-auth-panel" style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          borderRadius: '32px',
          padding: '60px 50px',
          width: '100%',
          maxWidth: '460px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 40px 100px rgba(0,0,0,0.08)'
        }}>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 1000, marginBottom: '10px', letterSpacing: '-1px', color: '#111' }}>
            Create an account
          </h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.05rem' }}>
            Join the next-gen data engine.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Full Name" style={{
              width: '100%', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid rgba(0,0,0,0.06)',
              background: '#fff', fontSize: '1rem', outline: 'none', transition: '0.3s', fontWeight: 500, color: '#333'
            }} />
            <input type="email" placeholder="Email Address" style={{
              width: '100%', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid rgba(0,0,0,0.06)',
              background: '#fff', fontSize: '1rem', outline: 'none', transition: '0.3s', fontWeight: 500, color: '#333'
            }} />
            <input type="password" placeholder="Password" style={{
              width: '100%', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid rgba(0,0,0,0.06)',
              background: '#fff', fontSize: '1rem', outline: 'none', transition: '0.3s', fontWeight: 500, color: '#333'
            }} />

            <button type="button" className="v2-btn-cta" style={{ width: '100%', marginTop: '12px', fontSize: '1.1rem', padding: '18px 0', borderRadius: '16px' }}>
              Get Started
            </button>
          </form>

          <div style={{ marginTop: '36px', fontSize: '0.95rem', color: '#777' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--v2-accent)', fontWeight: 800, cursor: 'pointer' }}>Log in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
