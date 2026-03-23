import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const TableNode = ({ data, selected }) => {
  const { name, type, columns } = data;
  const isFact = type === 'FACT';

  return (
    <div className={`df-card min-w-[220px] transition-all duration-300 border-2 ${selected ? 'border-[var(--df-accent)] shadow-[0_0_20px_var(--df-accent-soft)] scale-[1.02]' : 'border-[rgba(0,0,0,0.15)] dark:border-[#333] hover:border-[var(--df-text-soft)] shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]'}`}>
      {/* Table Header */}
      <div className={`px-4 py-3 rounded-t-xl border-b border-[var(--df-border)] flex items-center justify-between ${isFact ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20' : 'bg-[var(--df-bg-secondary)]'}`}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isFact ? 'text-[var(--df-accent)]' : 'text-[var(--df-info)]'}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span className="font-bold text-[var(--df-strong)] truncate max-w-[120px]">{name}</span>
        </div>
        <div className={`df-badge ${isFact ? 'df-badge-accent' : 'df-badge-success'} scale-90`}>
          {type}
        </div>
      </div>

      {/* Columns List */}
      <div className="px-3 py-2 bg-[var(--df-card-bg)] rounded-b-xl max-h-[250px] overflow-y-auto df-scrollbar">
        {columns.map((col, idx) => (
          <div key={idx} className="flex items-center justify-between py-1.5 px-2 hover:bg-[var(--df-bg-secondary)] rounded-lg transition-colors group">
            <div className="flex items-center gap-2">
              <span className="text-[var(--df-text-muted)] group-hover:text-[var(--df-accent)] transition-colors">
                {col.isPK && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                    <path d="M21 2l-2 2M21 21l-9-9M15 15l2 2M11 11l2 2M8 8a5 5 0 1 1 5 5L13 22l-3-3-3 3-3-3-3 3V8z" />
                  </svg>
                )}
                {col.isFK && !col.isPK && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
                {!col.isPK && !col.isFK && <div className="w-3 h-3 border border-current rounded-sm opacity-30" />}
              </span>
              <span className={`text-[13px] ${col.isPK || col.isFK ? 'font-semibold text-[var(--df-strong)]' : 'text-[var(--df-text)]'}`}>
                {col.name}
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono text-[var(--df-text-muted)] tracking-tighter bg-[var(--df-bg-secondary)] px-1.5 py-0.5 rounded">
              {col.type}
            </span>
          </div>
        ))}
      </div>

      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-[var(--df-accent)] border-2 border-[var(--df-bg)]" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-[var(--df-accent)] border-2 border-[var(--df-bg)]" />
    </div>
  );
};

export default memo(TableNode);
