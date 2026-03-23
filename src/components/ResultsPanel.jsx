import React, { useState } from 'react';
import { FiTable, FiClock, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const ResultsPanel = ({ activeTab }) => {
  const [activeTabName, setActiveTabName] = useState('TABLE');

  if (!activeTab) return null;

  const { results, status, executionTime } = activeTab;
  const hasResults = results && !results.error && results.rows;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--df-card-bg)' }}>
      {/* Tabs */}
      <div className="flex items-center justify-between px-6 h-12" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-surface)' }}>
        <button
          onClick={() => setActiveTabName('TABLE')}
          className="flex items-center gap-2 h-full text-[11px] font-bold tracking-widest transition-all relative"
          style={{ color: activeTabName === 'TABLE' ? 'var(--df-strong)' : 'var(--df-text-muted)' }}
        >
          <div className="flex items-center gap-2 uppercase">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTabName === 'TABLE' ? 'var(--df-strong)' : 'transparent' }}></div>
            Results Table
          </div>
          {activeTabName === 'TABLE' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 rounded-t-full" style={{ backgroundColor: 'var(--df-strong)' }}></div>
          )}
        </button>
        
        {/* Execution Diagnostics */}
        <div className="flex items-center gap-4 text-[11px] font-bold tracking-wider" style={{ color: 'var(--df-text-soft)' }}>
          {status === 'running' && (
             <span className="flex items-center gap-1.5" style={{ color: 'var(--df-info)' }}>
               <FiLoader className="animate-spin" /> Executing
             </span>
          )}
          {status === 'success' && (
             <span className="flex items-center gap-1.5" style={{ color: 'var(--df-success)' }}>
               <FiCheckCircle /> Success
             </span>
          )}
          {status === 'error' && (
             <span className="flex items-center gap-1.5" style={{ color: 'var(--df-danger)' }}>
               <FiXCircle /> Error
             </span>
          )}
          {executionTime && (
             <span className="flex items-center gap-1.5">
               <FiClock /> {executionTime}
             </span>
          )}
          {hasResults && (
             <span className="flex items-center gap-1.5 uppercase border-l pl-4" style={{ borderColor: 'var(--df-border)' }}>
               <FiTable /> {results.rows.length} row{results.rows.length !== 1 ? 's' : ''}
             </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto df-scrollbar relative" style={{ backgroundColor: 'var(--df-surface)' }}>
        {!results && status !== 'running' && (
          <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
            <FiTable size={48} className="mb-4" style={{ color: 'var(--df-text-muted)' }} />
            <p className="text-[13px] font-medium" style={{ color: 'var(--df-text-soft)' }}>Run a query to see results</p>
          </div>
        )}

        {status === 'running' && (
          <div className="flex flex-col items-center justify-center h-full py-20 opacity-70">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: 'var(--df-accent)', borderTopColor: 'transparent' }}></div>
            <p className="text-[13px] font-bold tracking-wide animate-pulse" style={{ color: 'var(--df-accent)' }}>Fetching data...</p>
          </div>
        )}

        {results?.error && status !== 'running' && (
          <div className="p-8">
            <div className="rounded-lg p-4 flex items-start gap-3 shadow-sm border" style={{ backgroundColor: 'var(--df-danger-soft)', borderColor: 'var(--df-danger)' }}>
              <div className="w-5 h-5 rounded-full text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5" style={{ backgroundColor: 'var(--df-danger)' }}>!</div>
              <p className="text-[13px] font-mono leading-relaxed" style={{ color: 'var(--df-danger)' }}>
                {results.error}
              </p>
            </div>
          </div>
        )}

        {hasResults && activeTabName === 'TABLE' && status !== 'running' && (
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="df-table w-full text-left border-collapse text-[13px]">
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--df-card-bg)' }}>
                  <tr className="shadow-sm">
                    {/* Add row number column */}
                    <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap border-b" style={{ borderColor: 'var(--df-border)', color: 'var(--df-text-muted)', width: '40px', minWidth: '40px' }}>Row</th>
                    {results.columns.map(col => (
                      <th key={col} className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap border-b" style={{ borderColor: 'var(--df-border)', color: 'var(--df-text-muted)' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row, ri) => (
                    <tr key={ri} className="border-b transition-colors hover:bg-[var(--df-sidebar-hover)]" style={{ borderColor: 'var(--df-border)' }}>
                      <td className="px-4 py-2.5 font-mono text-[11px] whitespace-nowrap border-r" style={{ color: 'var(--df-text-muted)', borderColor: 'var(--df-border)' }}>
                        {ri + 1}
                      </td>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2.5 font-medium whitespace-nowrap" style={{ color: 'var(--df-text)' }}>
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {results.rows.length === 0 && (
                    <tr>
                      <td colSpan={results.columns.length + 1} className="py-8 text-center text-[13px] italic" style={{ color: 'var(--df-text-soft)' }}>
                        Zero rows returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
