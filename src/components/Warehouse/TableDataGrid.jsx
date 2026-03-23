import React from 'react';
import { FiArrowUp, FiArrowDown, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TableDataGrid = ({ 
  viewMode, selectedTable, showColumnPicker, hiddenColumns, setHiddenColumns, 
  visibleColumns, handleSort, sortConfig, showFilters, columnFilters, setColumnFilters, processedData,
  currentPage, setCurrentPage, totalPages, totalFilteredRows, paginatedData,
}) => {
  const displayData = paginatedData || processedData;

  if (viewMode === 'schema') {
    return (
      <div className="df-card overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <table className="df-table w-full text-left">
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Type</th>
              <th>Nullable</th>
              <th>Key</th>
            </tr>
          </thead>
          <tbody>
            {selectedTable.columns.map((col, i) => (
              <tr key={i}>
                <td className="font-bold text-sm" style={{ color: 'var(--df-strong)' }}>{col.name}</td>
                <td className="font-mono text-xs" style={{ color: 'var(--df-accent)' }}>{col.type}</td>
                <td className="text-sm" style={{ color: 'var(--df-text-soft)' }}>YES</td>
                <td className="text-sm" style={{ color: 'var(--df-text-soft)' }}>{col.type.includes('PRIMARY KEY') ? 'PRI' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {showColumnPicker && (
        <div className="absolute top-0 left-0 z-10 rounded-xl p-4 w-64 animate-fadeIn" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}>
          <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid var(--df-border)' }}>
            <h4 className="text-xs font-bold uppercase" style={{ color: 'var(--df-text)' }}>Display Columns</h4>
            <button onClick={() => setShowColumnPicker(false)} style={{ color: 'var(--df-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-muted)'; }}>
              <FiX size={14} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto df-scrollbar">
            {selectedTable.columns.map(col => (
              <label key={col.name} className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <input
                  type="checkbox"
                  checked={!hiddenColumns.includes(col.name)}
                  onChange={() => setHiddenColumns(prev => prev.includes(col.name) ? prev.filter(c => c !== col.name) : [...prev, col.name])}
                  className="df-checkbox"
                />
                <span className="text-xs" style={{ color: 'var(--df-text-soft)' }}>{col.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="df-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="df-table w-full text-left">
            <thead>
              <tr>
                {visibleColumns.map(col => (
                  <th key={col.name} onClick={() => handleSort(col.name)} className="cursor-pointer group">
                    <div className="flex items-center gap-2">
                      {col.name}
                      {sortConfig?.key === col.name ? (
                        sortConfig.direction === 'asc' ? <FiArrowUp size={12} style={{ color: 'var(--df-accent)' }} /> : <FiArrowDown size={12} style={{ color: 'var(--df-accent)' }} />
                      ) : (
                        <FiArrowUp size={12} className="opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'var(--df-text-muted)' }} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
              {showFilters && (
                <tr>
                  {visibleColumns.map(col => (
                    <td key={`filter-${col.name}`} className="px-4 py-2" style={{ backgroundColor: 'var(--df-surface)', borderBottom: '1px solid var(--df-border)' }}>
                      <input
                        type="text"
                        placeholder={`Filter ${col.name}...`}
                        className="df-input text-[10px] px-2 py-1"
                        value={columnFilters[col.name] || ''}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, [col.name]: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((row, i) => (
                  <tr key={i}>
                    {visibleColumns.map(col => (
                      <td key={col.name} className="font-medium truncate max-w-[200px]" style={{ color: 'var(--df-text)' }}>
                        {String(row[col.name] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-12 text-center italic text-sm" style={{ color: 'var(--df-text-muted)' }}>
                    No data available matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && setCurrentPage && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--df-border)', backgroundColor: 'var(--df-surface)' }}>
            <span className="text-[11px] font-medium" style={{ color: 'var(--df-text-muted)' }}>
              Showing {totalFilteredRows === 0 ? 0 : ((currentPage - 1) * 25) + 1}–{Math.min(currentPage * 25, totalFilteredRows)} of {totalFilteredRows?.toLocaleString()} rows
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: 'var(--df-text-soft)' }}
                onMouseEnter={(e) => { if (currentPage > 1) { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
              >
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) { page = i + 1; }
                else if (currentPage <= 3) { page = i + 1; }
                else if (currentPage >= totalPages - 2) { page = totalPages - 4 + i; }
                else { page = currentPage - 2 + i; }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="w-7 h-7 rounded-md text-[11px] font-bold transition-all"
                    style={{
                      backgroundColor: page === currentPage ? 'var(--df-accent)' : 'transparent',
                      color: page === currentPage ? 'white' : 'var(--df-text-soft)',
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: 'var(--df-text-soft)' }}
                onMouseEnter={(e) => { if (currentPage < totalPages) { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDataGrid;
