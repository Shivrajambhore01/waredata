import React from 'react';
import { FiColumns, FiFilter, FiRefreshCw, FiSearch, FiFileText } from 'react-icons/fi';

const TableControls = ({ 
  rowLimit, setRowLimit, showColumnPicker, setShowColumnPicker, 
  showFilters, setShowFilters, handleRefresh, dataSearchQuery, setDataSearchQuery,
  handleExportJSON,
}) => {
  return (
    <div className="flex items-center justify-between gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--df-text-muted)' }}>Rows:</span>
        <select
          value={rowLimit}
          onChange={(e) => setRowLimit(Number(e.target.value))}
          className="df-select text-xs px-2 py-1.5"
          style={{ width: 'auto' }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--df-border)' }} />

        <button
          onClick={() => setShowColumnPicker(!showColumnPicker)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all"
          style={{
            backgroundColor: showColumnPicker ? 'var(--df-accent-soft)' : 'transparent',
            color: showColumnPicker ? 'var(--df-accent)' : 'var(--df-text-soft)',
            border: `1px solid ${showColumnPicker ? 'var(--df-accent)' : 'var(--df-border)'}`,
          }}
        >
          <FiColumns size={13} /> Columns
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all"
          style={{
            backgroundColor: showFilters ? 'var(--df-accent-soft)' : 'transparent',
            color: showFilters ? 'var(--df-accent)' : 'var(--df-text-soft)',
            border: `1px solid ${showFilters ? 'var(--df-accent)' : 'var(--df-border)'}`,
          }}
        >
          <FiFilter size={13} /> Filters
        </button>

        <button onClick={handleRefresh} className="df-btn df-btn-ghost text-xs px-2.5 py-1.5" style={{ border: '1px solid var(--df-border)' }}>
          <FiRefreshCw size={13} /> Refresh
        </button>

        {handleExportJSON && (
          <button onClick={handleExportJSON} className="df-btn df-btn-ghost text-xs px-2.5 py-1.5" style={{ border: '1px solid var(--df-border)' }}>
            <FiFileText size={13} /> JSON
          </button>
        )}
      </div>

      <div className="relative">
        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2" size={13} style={{ color: 'var(--df-text-muted)' }} />
        <input
          type="text"
          placeholder="Search in results..."
          className="df-input text-xs py-1.5 pr-3 w-48"
          style={{ paddingLeft: '28px' }}
          value={dataSearchQuery}
          onChange={(e) => setDataSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TableControls;
