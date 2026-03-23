import React from 'react';

const SchemaDetailPanel = ({ table, isOpen, onClose }) => {
  if (!table) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-[400px] bg-[var(--df-card-bg)] border-l border-[var(--df-border)] shadow-2xl z-[200] transition-transform duration-500 ease-[var(--df-ease)] df-scrollbar overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-[var(--df-card-bg)] border-b border-[var(--df-border)] px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${table.type === 'FACT' ? 'bg-[var(--df-accent-soft)] text-[var(--df-accent)]' : 'bg-[var(--df-info-soft)] text-[var(--df-info)]'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--df-strong)] leading-tight">{table.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`df-badge ${table.type === 'FACT' ? 'df-badge-accent' : 'df-badge-success'} scale-90`}>
                {table.type}
              </span>
              <span className="text-xs text-[var(--df-text-muted)] tracking-tight">SCHEMA: PUBLIC</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[var(--df-bg-secondary)] rounded-full transition-colors text-[var(--df-text-soft)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        <section className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--df-text-muted)]">Definition</h4>
          <p className="text-sm text-[var(--df-text-soft)] leading-relaxed">
            {table.type === 'FACT' 
              ? `This fact table contains quantitative data for analysis. It typically holds business process measurements or metrics.` 
              : `This dimension table provides descriptive attributes for the business. It is used to filter and group quantitative data in fact tables.`}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--df-text-muted)]">Columns ({table.columns.length})</h4>
          </div>
          <div className="border border-[var(--df-border)] rounded-xl overflow-hidden divide-y divide-[var(--df-border)]">
            {table.columns.map((col, idx) => (
              <div key={idx} className="p-4 hover:bg-[var(--df-bg-secondary)] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--df-strong)]">{col.name}</span>
                      {col.isPK && (
                        <span className="text-[10px] bg-yellow-400/10 text-yellow-600 px-1.5 py-0.5 rounded font-black uppercase">PK</span>
                      )}
                      {col.isFK && (
                        <span className="text-[10px] bg-blue-400/10 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">FK</span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--df-text-muted)] mt-0.5">{col.type}</span>
                  </div>
                </div>
                {col.isFK && (
                  <div className="flex items-center gap-1 text-[var(--df-info)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    <span className="text-[10px] font-bold">REFS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--df-text-muted)]">Sample Data Preview</h4>
          <div className="p-10 border border-dashed border-[var(--df-border)] rounded-xl text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-[var(--df-text-muted)] opacity-30"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></svg>
            <p className="text-xs text-[var(--df-text-muted)]">Querying limited sample...</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[var(--df-border)]">
        <button className="df-btn df-btn-secondary w-full py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Export SQL Definition
        </button>
      </div>
    </div>
  );
};

export default SchemaDetailPanel;
