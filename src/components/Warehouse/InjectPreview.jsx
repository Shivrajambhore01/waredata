import React, { useState, useEffect } from 'react';
import { FiDownloadCloud, FiChevronRight, FiArrowLeft, FiLayers, FiActivity, FiDatabase, FiTable, FiLoader, FiCheck } from 'react-icons/fi';

const PROGRESS_STAGES = [
  { key: 'connecting', label: 'Connecting to source...', percent: 20 },
  { key: 'scanning', label: 'Scanning table metadata...', percent: 50 },
  { key: 'injecting', label: 'Injecting into warehouse...', percent: 80 },
  { key: 'complete', label: 'Injection complete!', percent: 100 },
];

const InjectPreview = ({
  selectedCatalog,
  selectedSchema,
  selectedTable,
  injectTable,
  handleBackToDashboard,
}) => {
  const [isInjecting, setIsInjecting] = useState(false);
  const [injected, setInjected] = useState(false);
  const [progressStage, setProgressStage] = useState(0);

  const handleInject = async () => {
    setIsInjecting(true);
    setProgressStage(0);

    // Simulate staged progress
    const advanceStage = (stage) => new Promise(resolve => {
      setTimeout(() => { setProgressStage(stage); resolve(); }, 600);
    });

    await advanceStage(0); // connecting
    await advanceStage(1); // scanning

    // Actual injection happens during "injecting" stage
    setProgressStage(2);
    await injectTable(selectedCatalog, selectedSchema, selectedTable);

    setProgressStage(3); // complete
    setTimeout(() => {
      setIsInjecting(false);
      setInjected(true);
    }, 800);
  };

  // Auto-transition after success
  useEffect(() => {
    if (injected) {
      const timer = setTimeout(() => {
        // The parent will detect isTableInjected becoming true and switch to data grid
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [injected]);

  if (injected) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
        <div className="text-center max-w-md mx-auto p-8 animate-fadeIn">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center relative" style={{ backgroundColor: 'var(--df-success-soft, #D1FAE5)' }}>
            <FiCheck size={36} style={{ color: 'var(--df-success, #059669)' }} />
            {/* Pulse ring animation */}
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: 'var(--df-success, #059669)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--df-strong)' }}>Successfully Injected!</h2>
          <p className="text-sm mb-1" style={{ color: 'var(--df-text-soft)' }}>
            <span className="font-semibold" style={{ color: 'var(--df-accent)' }}>{selectedTable.name}</span> is now in your Warehouse.
          </p>
          <p className="text-xs mt-4" style={{ color: 'var(--df-text-muted)' }}>Loading data grid...</p>
          <FiLoader size={16} className="animate-spin mx-auto mt-3" style={{ color: 'var(--df-accent)' }} />
        </div>
      </div>
    );
  }

  const currentStage = PROGRESS_STAGES[progressStage];

  return (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
      <div className="text-center max-w-lg mx-auto p-8">

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
          <FiDownloadCloud size={28} style={{ color: 'var(--df-accent)' }} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--df-strong)' }}>{selectedTable.name}</h2>
        <p className="text-sm mb-1 flex items-center justify-center gap-1" style={{ color: 'var(--df-text-soft)' }}>
          {selectedCatalog.name} <FiChevronRight size={10} style={{ color: 'var(--df-border)' }} /> {selectedSchema.name}
        </p>
        <p className="text-xs mb-6 leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--df-text-muted)' }}>
          {selectedTable.description || 'This table has not been injected into the warehouse yet. Inject it to enable querying, filtering, and export.'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-6 text-xs" style={{ color: 'var(--df-text-soft)' }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1"><FiActivity size={12} style={{ color: 'var(--df-info, #3B82F6)' }} /></div>
            <div className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>{selectedTable.rowCount?.toLocaleString() ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--df-text-muted)' }}>Rows</div>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: 'var(--df-border)' }} />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1"><FiLayers size={12} style={{ color: 'var(--df-accent)' }} /></div>
            <div className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>{selectedTable.columns?.length ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--df-text-muted)' }}>Columns</div>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: 'var(--df-border)' }} />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1"><FiDatabase size={12} style={{ color: 'var(--df-success, #059669)' }} /></div>
            <div className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>{selectedTable.storageSize || 'N/A'}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--df-text-muted)' }}>Size</div>
          </div>
        </div>

        {/* Sample Data Preview */}
        {selectedTable.sampleData && selectedTable.sampleData.length > 0 && !isInjecting && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-sm text-left" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}>
            <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: 'var(--df-surface)', borderBottom: '1px solid var(--df-border)' }}>
              <FiTable size={12} style={{ color: 'var(--df-accent)' }} />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>Sample Data (3 rows)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--df-surface)' }}>
                    {selectedTable.columns?.slice(0, 5).map(col => (
                      <th key={col.name} className="px-3 py-2 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--df-text-muted)' }}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedTable.sampleData.slice(0, 3).map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--df-border)' }}>
                      {selectedTable.columns?.slice(0, 5).map(col => (
                        <td key={col.name} className="px-3 py-2 truncate max-w-[150px]" style={{ color: 'var(--df-text-soft)' }}>
                          {String(row[col.name] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Bar (during injection) */}
        {isInjecting && (
          <div className="mb-6 max-w-xs mx-auto animate-fadeIn">
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--df-surface)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentStage.percent}%`, backgroundColor: 'var(--df-accent)' }}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiLoader size={12} className="animate-spin" style={{ color: 'var(--df-accent)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--df-text-soft)' }}>{currentStage.label}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleInject}
          disabled={isInjecting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--df-accent)',
            color: 'white',
          }}
          onMouseEnter={(e) => { if (!isInjecting) e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
        >
          {isInjecting ? (
            <><FiLoader size={16} className="animate-spin" /> Injecting...</>
          ) : (
            <><FiDownloadCloud size={16} /> Inject to Warehouse</>
          )}
        </button>

        {/* Back */}
        {!isInjecting && (
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-1.5 mx-auto mt-4 text-xs transition-colors"
            style={{ color: 'var(--df-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-muted)'; }}
          >
            <FiArrowLeft size={12} /> Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default InjectPreview;
