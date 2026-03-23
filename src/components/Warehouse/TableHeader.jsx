import React from 'react';
import { FiTable, FiChevronRight, FiEye, FiLayers, FiPlay, FiRefreshCw, FiDownload } from 'react-icons/fi';

const TableHeader = ({ 
  selectedCatalog, selectedSchema, selectedTable, 
  viewMode, setViewMode, handleRunQuery, handleRefresh, handleExportCSV, isLoading 
}) => {
  return (
    <div className="px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-card-bg)', borderBottom: '1px solid var(--df-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
          <FiTable style={{ color: 'var(--df-accent)' }} size={22} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>{selectedCatalog.name}</span>
            <FiChevronRight size={10} style={{ color: 'var(--df-text-muted)' }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-accent)' }}>{selectedSchema.name}</span>
            <FiChevronRight size={10} style={{ color: 'var(--df-text-muted)' }} />
            <h2 className="text-lg font-bold leading-none" style={{ color: 'var(--df-strong)' }}>{selectedTable.name}</h2>
          </div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--df-text-muted)' }}>{selectedTable.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--df-surface)' }}>
          <button onClick={() => setViewMode('data')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all`}
            style={{ backgroundColor: viewMode === 'data' ? 'var(--df-card-bg)' : 'transparent', color: viewMode === 'data' ? 'var(--df-strong)' : 'var(--df-text-soft)', boxShadow: viewMode === 'data' ? 'var(--df-shadow-xs)' : 'none' }}>
            <FiEye size={14} /> Preview
          </button>
          <button onClick={() => setViewMode('schema')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all`}
            style={{ backgroundColor: viewMode === 'schema' ? 'var(--df-card-bg)' : 'transparent', color: viewMode === 'schema' ? 'var(--df-strong)' : 'var(--df-text-soft)', boxShadow: viewMode === 'schema' ? 'var(--df-shadow-xs)' : 'none' }}>
            <FiLayers size={14} /> Schema
          </button>
        </div>

        <div className="w-px h-6" style={{ backgroundColor: 'var(--df-border)' }} />

        <button onClick={handleRunQuery} className="df-btn df-btn-primary text-xs px-3 py-1.5">
          <FiPlay size={13} /> Run Query
        </button>
        <button onClick={handleRefresh} className="p-2 rounded-lg transition-all" style={{ color: 'var(--df-text-soft)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
        <button onClick={handleExportCSV} className="p-2 rounded-lg transition-all" style={{ color: 'var(--df-text-soft)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <FiDownload size={16} />
        </button>
      </div>
    </div>
  );
};

export default TableHeader;
