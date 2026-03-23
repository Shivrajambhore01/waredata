import React, { useState } from 'react';
import { FiZap, FiLoader, FiPower, FiSquare } from 'react-icons/fi';

const STATUS_STYLES = {
  Running: { bg: 'var(--df-success-soft, #D1FAE5)', color: 'var(--df-success, #059669)', label: 'Running' },
  Starting: { bg: 'var(--df-warning-soft, #FEF3C7)', color: 'var(--df-warning, #D97706)', label: 'Starting...' },
  Stopped: { bg: 'var(--df-surface)', color: 'var(--df-text-muted)', label: 'Stopped' },
};

const ComputeStatusBar = () => {
  const [status, setStatus] = useState('Running');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setIsTransitioning(true);
    setStatus('Starting');
    // Simulate startup delay
    setTimeout(() => {
      setStatus('Running');
      setIsTransitioning(false);
    }, 2000);
  };

  const handleStop = () => {
    setStatus('Stopped');
    setIsTransitioning(false);
  };

  const style = STATUS_STYLES[status] || STATUS_STYLES.Stopped;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2"
      style={{
        backgroundColor: 'var(--df-card-bg)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center gap-2">
        <FiZap size={14} style={{ color: 'var(--df-accent)' }} />
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>
          SQL Warehouse
        </span>
      </div>

      {/* Status pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {status === 'Starting' && <FiLoader size={10} className="animate-spin" />}
        {status === 'Running' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />}
        {style.label}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 ml-auto">
        {status === 'Stopped' && (
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{ backgroundColor: 'var(--df-accent-soft)', color: 'var(--df-accent)', border: '1px solid var(--df-accent)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
          >
            <FiPower size={10} /> Start
          </button>
        )}
        {status === 'Running' && (
          <button
            onClick={handleStop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{ backgroundColor: 'var(--df-surface)', color: 'var(--df-text-muted)', border: '1px solid var(--df-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-danger, #DC2626)'; e.currentTarget.style.borderColor = 'var(--df-danger, #DC2626)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-muted)'; e.currentTarget.style.borderColor = 'var(--df-border)'; }}
          >
            <FiSquare size={10} /> Stop
          </button>
        )}
        {status === 'Starting' && (
          <span className="text-[10px] font-medium" style={{ color: 'var(--df-text-muted)' }}>
            Initializing...
          </span>
        )}
      </div>
    </div>
  );
};

export default ComputeStatusBar;
