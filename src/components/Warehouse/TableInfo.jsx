import React from 'react';
import { FiActivity, FiLayers, FiDatabase, FiInfo, FiChevronDown, FiChevronRight, FiCopy } from 'react-icons/fi';

const TableInfo = ({ 
  selectedTable, selectedSchema, selectedCatalog, 
  showMetadata, setShowMetadata, handleCopyPath 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        {[
          { label: 'Total Rows', value: selectedTable.rowCount.toLocaleString(), sub: 'Approximate count', icon: <FiActivity size={16} style={{ color: 'var(--df-info)' }} /> },
          { label: 'Columns', value: selectedTable.columns.length, sub: 'Defined in schema', icon: <FiLayers size={16} style={{ color: 'var(--df-accent)' }} /> },
          { label: 'Schema Size', value: selectedSchema.size, sub: `Owned by ${selectedSchema.owner}`, icon: <FiDatabase size={16} style={{ color: 'var(--df-success)' }} /> },
        ].map((stat, i) => (
          <div key={i} className="df-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--df-strong)' }}>{stat.value}</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--df-text-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="df-card overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="w-full flex items-center justify-between px-6 py-3 font-semibold text-sm"
          style={{ backgroundColor: 'var(--df-surface)', borderBottom: '1px solid var(--df-border)', color: 'var(--df-text)' }}
        >
          <div className="flex items-center gap-2">
            <FiInfo style={{ color: 'var(--df-accent)' }} />
            <span>Table Information</span>
          </div>
          {showMetadata ? <FiChevronDown /> : <FiChevronRight />}
        </button>
        {showMetadata && (
          <div className="p-6 text-sm animate-slideDown" style={{ color: 'var(--df-text-soft)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="leading-relaxed flex-1">
                {selectedTable.description} This table is part of the <strong style={{ color: 'var(--df-strong)' }}>{selectedSchema.name}</strong> schema in the <strong style={{ color: 'var(--df-strong)' }}>{selectedCatalog.name}</strong>.
              </p>
              <button onClick={handleCopyPath} className="df-btn df-btn-ghost text-xs flex-shrink-0 ml-4">
                <FiCopy size={12} /> Copy Path
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {[
                ['Type', 'Regular Table'],
                ['Encoding', 'UTF-8'],
                ['Access', 'Read/Write'],
                ['Owner', selectedSchema.owner],
                ['Last Updated', '2026-03-19 18:45:00 UTC'],
              ].map(([label, value], i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-bold w-28" style={{ color: 'var(--df-text)' }}>{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="font-bold w-28" style={{ color: 'var(--df-text)' }}>Full Path:</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--df-accent)' }}>{selectedCatalog.name}.{selectedSchema.name}.{selectedTable.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableInfo;
