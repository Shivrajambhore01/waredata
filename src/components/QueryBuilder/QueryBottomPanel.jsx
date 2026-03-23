import React from 'react';
import { FiCode, FiPlay, FiDownload, FiTable, FiAlertCircle, FiInfo } from 'react-icons/fi';

const QueryBottomPanel = ({ isExecuting, onRun, results, activeTab, setActiveTab, generatedSQL, queryExplanation }) => {
  return (
    <div className="flex flex-col h-full bg-[var(--df-card-bg)] border-t border-[var(--df-border)] font-sans">
      <div className="h-10 border-b border-[var(--df-border)] bg-[var(--df-bg-secondary)] flex items-center justify-between px-3">
        <div className="flex items-center gap-4 h-full">
          <button 
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${activeTab === 'sql' ? 'border-[var(--df-accent)] text-[var(--df-accent)]' : 'border-transparent text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
          >
            <FiCode size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">Live SQL</span>
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${activeTab === 'results' ? 'border-[var(--df-accent)] text-[var(--df-accent)]' : 'border-transparent text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
          >
            <FiTable size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">Results</span>
            {results && !results.error && <span className="bg-[var(--df-accent-soft)] text-[var(--df-accent)] px-1.5 py-0.5 rounded-full text-[9px] font-black">{results.rows.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('explanation')}
            className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${activeTab === 'explanation' ? 'border-[var(--df-accent)] text-[var(--df-accent)]' : 'border-transparent text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
          >
            <FiInfo size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">Pipeline Explanation</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onRun}
            disabled={isExecuting || !generatedSQL}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--df-accent)] text-white text-[10px] font-bold shadow-sm active:scale-95 transition-all ${isExecuting || !generatedSQL ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
          >
            {isExecuting ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiPlay size={12} className="fill-current" />
            )}
            {isExecuting ? 'RUNNING...' : 'RUN PIPELINE'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'sql' && (
          <div className="absolute inset-0 p-4 overflow-auto df-scrollbar bg-[#0f111a] dark:bg-black/40">
            <pre className="font-mono text-[13px] leading-relaxed text-[#c9d1d9] whitespace-pre-wrap">
              {generatedSQL.split(/(\bSELECT\b|\bFROM\b|\bLEFT JOIN\b|\bINNER JOIN\b|\bRIGHT JOIN\b|\bFULL OUTER JOIN\b|\bON\b|\bWHERE\b|\bGROUP BY\b|\bORDER BY\b|\bLIMIT\b|--.*)/g).map((part, i) => {
                if (['SELECT', 'FROM', 'LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'ON', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT'].includes(part)) {
                  return <span key={i} className="text-[#ff7b72] font-semibold">{part}</span>;
                }
                if (part.startsWith('--')) {
                  return <span key={i} className="text-[#8b949e] italic">{part}</span>;
                }
                return <span key={i} className="text-[#a5d6ff]">{part}</span>;
              })}
            </pre>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="absolute inset-0 overflow-auto df-scrollbar bg-[var(--df-bg)]">
            {isExecuting ? (
              <div className="h-full flex flex-col p-4 gap-2 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 bg-[var(--df-border)] rounded w-full opacity-30" />
                ))}
              </div>
            ) : results ? (
              results.error ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-3">
                    <FiAlertCircle size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--df-strong)] mb-1">Execution Error</h3>
                  <p className="max-w-md text-xs text-[var(--df-text-muted)] leading-relaxed">{results.error}</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-full">
                  <thead className="sticky top-0 bg-[var(--df-bg-secondary)] z-10 shadow-sm shadow-black/5">
                    <tr>
                      <th className="px-3 py-2 border-b border-[var(--df-border)] text-[10px] font-black text-[var(--df-text-muted)] uppercase tracking-wider bg-[var(--df-bg-secondary)]">#</th>
                      {results.columns?.map(col => (
                        <th key={col} className="px-3 py-2 border-b border-[var(--df-border)] text-[10px] font-black text-[var(--df-text-muted)] uppercase tracking-wider bg-[var(--df-bg-secondary)]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--df-border)]">
                    {results.rows?.map((row, ri) => (
                      <tr key={ri} className="hover:bg-[var(--df-bg-secondary)]/40 transition-colors group">
                        <td className="px-3 py-1.5 text-[10px] text-[var(--df-text-muted)] font-mono border-r border-[var(--df-border)]/30 w-10">{ri + 1}</td>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-1.5 text-[12px] text-[var(--df-text-soft)] border-r border-[var(--df-border)]/30 truncate max-w-[200px]">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                <FiPlay size={32} className="text-[var(--df-text-muted)] mb-3" />
                <p className="text-sm font-medium text-[var(--df-text-muted)] tracking-wide">
                  Click 'RUN PIPELINE' to execute the visual query.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="absolute inset-0 p-8 overflow-auto df-scrollbar bg-[var(--df-bg)]">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--df-accent-soft)] text-[var(--df-accent)] rounded-xl flex items-center justify-center">
                  <FiInfo size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--df-strong)]">Query Intelligence</h3>
                  <p className="text-xs text-[var(--df-text-muted)] font-medium">Auto-generated explanation of your visual data pipeline</p>
                </div>
              </div>
              
              <div className="bg-[var(--df-card-bg)] border border-[var(--df-border)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--df-accent)]" />
                <p className="text-sm leading-relaxed text-[var(--df-text-soft)] font-medium italic">
                  "{queryExplanation}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryBottomPanel;
