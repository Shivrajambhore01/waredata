import React from 'react';
import { FiX, FiInfo, FiBarChart2 } from 'react-icons/fi';

const StatsModal = ({ isOpen, onClose, stats, tableName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }} className="w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderBottomColor: 'var(--df-border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
              <FiBarChart2 size={20} style={{ color: 'var(--df-accent)' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>Table Statistics: {tableName}</h3>
              <p className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>Detailed column-level metrics and distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--df-sidebar-hover)] rounded-full transition-colors" style={{ color: 'var(--df-text-muted)' }}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 df-scrollbar">
          <div className="grid grid-cols-1 gap-6">
            <table className="df-table w-full text-left">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                  <th>Distinct</th>
                  <th>Nulls</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {stats && stats.map((col, i) => (
                  <tr key={i}>
                    <td className="font-bold" style={{ color: 'var(--df-strong)' }}>{col.name}</td>
                    <td className="font-mono text-[10px]" style={{ color: 'var(--df-accent)' }}>{col.type}</td>
                    <td style={{ color: 'var(--df-text-soft)' }}>{col.distinct_count?.toLocaleString()}</td>
                    <td style={{ color: 'var(--df-text-soft)' }}>
                      {col.null_count > 0 ? (
                        <span className="text-amber-600 font-medium">{col.null_count?.toLocaleString()}</span>
                      ) : '0'}
                    </td>
                    <td className="truncate max-w-[100px]" style={{ color: 'var(--df-text-muted)' }}>{col.min || '-'}</td>
                    <td className="truncate max-w-[100px]" style={{ color: 'var(--df-text-muted)' }}>{col.max || '-'}</td>
                    <td>
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--df-surface)' }}>
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${(col.non_null / col.total) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ backgroundColor: 'var(--df-bg-secondary)', borderTopColor: 'var(--df-border)' }}>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--df-text-muted)' }}>
            <FiInfo size={12} />
            Computed from real-time scan of the injected table.
          </div>
          <button 
            onClick={onClose}
            className="df-btn df-btn-primary px-6 py-2 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
