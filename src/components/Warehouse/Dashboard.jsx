import React, { useState, useMemo } from 'react';
import { generateCSV, generateJSON, downloadAsFile } from '../../data/warehouseMockData';
import { 
  FiSearch, FiZap, FiPlus, FiGrid, FiClock, FiArrowRight, FiTable, 
  FiExternalLink, FiChevronDown, FiUpload, FiPlay, FiStar, FiMoreVertical, FiActivity,
  FiX, FiFilter, FiBox, FiDownload, FiTrash2
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const Dashboard = ({ 
  stats, searchQuery, setSearchQuery, navigate, recentActivity, 
  favoriteTables, handleTableClick, toggleFavorite, handleRunQuery,
  searchCategory, setSearchCategory, recentActivityHistory, favorites,
  injectedTables, catalogs
}) => {
  const toast = useToast();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [showQuickInject, setShowQuickInject] = useState(false);
  const [quickInjectSearch, setQuickInjectSearch] = useState('');
  const [activeRowMenu, setActiveRowMenu] = useState(null);

  // Find full table object from catalogs for a given injected table
  const findFullTable = (schemaName, tableName) => {
    for (const cat of (catalogs || [])) {
      for (const sch of (cat.schemas || [])) {
        if (sch.name === schemaName) {
          const tbl = sch.tables?.find(t => t.name === tableName);
          if (tbl) return { catalog: cat, schema: sch, table: tbl };
        }
      }
    }
    return null;
  };

  const handleRunQueryForTable = (schemaName, tableName) => {
    const query = `SELECT * FROM ${schemaName}.${tableName};`;
    navigate('/sql-editor', { state: { prefillQuery: query } });
  };

  const handleExportCSVForTable = (schemaName, tableName) => {
    // Find the table to get its sample data
    const match = findFullTable(schemaName, tableName);
    if (!match || !match.table) {
      toast.error(`Table ${tableName} not found for export`);
      return;
    }
    const csv = generateCSV(match.table.columns, match.table.sampleData);
    downloadAsFile(csv, `${tableName}.csv`, 'text/csv');
    toast.success(`Exporting ${tableName}.csv (Mock)...`);
  };

  // Helper to get all non-injected tables
  const nonInjectedTables = useMemo(() => {
    const result = [];
    (catalogs || []).forEach(cat => {
      cat.schemas?.forEach(sch => {
        sch.tables?.forEach(tbl => {
          const isAlreadyInjected = (injectedTables || []).some(it => it.tableId === tbl.id || it.id === tbl.id);
          if (!isAlreadyInjected) {
            result.push({ catalog: cat, schema: sch, table: tbl });
          }
        });
      });
    });
    return result;
  }, [catalogs, injectedTables]);

  const filteredQuickInject = nonInjectedTables.filter(item => {
    const q = quickInjectSearch.toLowerCase();
    return item.table.name.toLowerCase().includes(q) || 
           item.schema.name.toLowerCase().includes(q) || 
           item.catalog.name.toLowerCase().includes(q);
  });

  // If no tables are injected, show empty state
  if (injectedTables.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
          <FiGrid size={32} style={{ color: 'var(--df-accent)', opacity: 0.8 }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--df-strong)' }}>Warehouse Empty</h2>
        <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--df-text-soft)' }}>
          No data available. Inject data from your <span className="font-semibold" style={{ color: 'var(--df-strong)' }}>Data Sources</span> in the sidebar to begin.
        </p>
        <div className="flex flex-col gap-3 w-48 font-['Nohemi']">
          <button 
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            style={{ backgroundColor: 'var(--df-accent)', color: 'white' }}
            onClick={() => setShowQuickInject(true)}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
          >
            <FiPlus size={14} /> Quick Ingest
          </button>
          <button 
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            style={{ backgroundColor: 'var(--df-surface)', color: 'var(--df-strong)', border: '1px solid var(--df-border)' }}
            onClick={() => navigate('/catalog')}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
          >
            <FiGrid size={14} /> Browse Catalog
          </button>
        </div>

        {/* Quick Inject Modal (also available in empty state) */}
        {showQuickInject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }} className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderBottomColor: 'var(--df-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
                    <FiBox size={18} style={{ color: 'var(--df-accent)' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>Quick Ingest</h3>
                    <p className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>Select non-injected tables from your Catalog</p>
                  </div>
                </div>
                <button onClick={() => setShowQuickInject(false)} className="p-2 hover:bg-[var(--df-sidebar-hover)] rounded-full transition-colors" style={{ color: 'var(--df-text-muted)' }}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="px-6 py-4 border-b" style={{ borderBottomColor: 'var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--df-text-muted)' }} size={14} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name, schema, or catalog..."
                    className="w-full text-xs df-input py-2.5 pr-4 rounded-lg"
                    style={{ paddingLeft: '36px' }}
                    value={quickInjectSearch}
                    onChange={(e) => setQuickInjectSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 df-scrollbar">
                {filteredQuickInject.length > 0 ? (
                  <div className="space-y-1">
                    {filteredQuickInject.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          handleTableClick(item.catalog, item.schema, item.table);
                          setShowQuickInject(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer group"
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; e.currentTarget.style.borderColor = 'var(--df-border)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 group-hover:text-amber-600 transition-colors" style={{ backgroundColor: 'var(--df-bg)', border: '1px solid var(--df-border)' }}>
                          <FiTable size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--df-strong)' }}>
                            {item.table.name}
                            <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-50 text-amber-700 rounded-full border border-amber-100 uppercase tracking-wider">External</span>
                          </div>
                          <div className="text-[10px] truncate" style={{ color: 'var(--df-text-muted)' }}>
                            {item.catalog.name}.{item.schema.name}
                          </div>
                        </div>
                        <FiPlus className="opacity-0 group-hover:opacity-100 transition-all font-bold" style={{ color: 'var(--df-text-muted)' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FiFilter className="mx-auto mb-2" size={32} style={{ color: 'var(--df-border)' }} />
                    <p className="text-xs" style={{ color: 'var(--df-text-muted)' }}>
                      {quickInjectSearch ? 'No matching tables found.' : 'All catalog tables have been injected.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t flex items-center justify-between" style={{ backgroundColor: 'var(--df-bg-secondary)', borderTopColor: 'var(--df-border)' }}>
                <span className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>{filteredQuickInject.length} tables available</span>
                <button 
                  onClick={() => { setShowQuickInject(false); navigate('/catalog'); }}
                  className="text-[10px] font-bold underline underline-offset-4"
                  style={{ color: 'var(--df-accent)' }}
                >
                  View full Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }




  return (
    <div className="flex-1 overflow-y-auto p-6 df-scrollbar relative" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--df-strong)' }}>Warehouse</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm" style={{ color: 'var(--df-text-soft)' }}>Manage catalogs, schemas, and tables.</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--df-success-soft)', color: 'var(--df-success)', border: '1px solid var(--df-success-soft)' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--df-success)' }} />
                Compute: {stats.computeStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="df-btn df-btn-primary text-xs px-3 py-1.5"
              >
                <FiPlus size={14} /> Create <FiChevronDown size={12} />
              </button>
              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl py-1 z-50 overflow-hidden animate-fadeIn" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}>
                  {[
                    { icon: FiTable, label: 'Create Table', onClick: () => { setShowCreateMenu(false); navigate('/sql-editor', { state: { prefillQuery: 'CREATE TABLE schema_name.table_name (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  created_at TIMESTAMP DEFAULT NOW()\n);' } }); } },
                    { icon: FiGrid, label: 'Create Schema', onClick: () => { setShowCreateMenu(false); navigate('/sql-editor', { state: { prefillQuery: 'CREATE SCHEMA IF NOT EXISTS new_schema;' } }); } },
                    { icon: FiBox, label: 'Quick Ingest', onClick: () => { setShowCreateMenu(false); setShowQuickInject(true); } },
                  ].map(({ icon: Icon, label, onClick }) => (
                    <button key={label} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--df-text-soft)' }}
                      onClick={onClick}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
                    >
                      <Icon style={{ color: 'var(--df-accent)' }} /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => navigate('/sql-editor')} className="df-btn df-btn-secondary text-xs px-3 py-1.5">
              <FiPlay size={13} strokeWidth={2.5} /> Run Query
            </button>
            <button 
              onClick={() => setShowQuickInject(true)}
              className="df-btn df-btn-secondary text-xs px-3 py-1.5"
            >
              <FiPlus size={13} style={{ color: 'var(--df-accent)' }} /> Add Data
            </button>
          </div>
        </div>

        {/* Quick Inject Modal */}
        {showQuickInject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }} className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderBottomColor: 'var(--df-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
                    <FiBox size={18} style={{ color: 'var(--df-accent)' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--df-strong)' }}>Quick Ingest</h3>
                    <p className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>Select non-injected tables from your Catalog</p>
                  </div>
                </div>
                <button onClick={() => setShowQuickInject(false)} className="p-2 hover:bg-[var(--df-sidebar-hover)] rounded-full transition-colors" style={{ color: 'var(--df-text-muted)' }}>
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="px-6 py-4 border-b" style={{ borderBottomColor: 'var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--df-text-muted)' }} size={14} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name, schema, or catalog..."
                    className="w-full text-xs df-input py-2.5 pr-4 rounded-lg"
                    style={{ paddingLeft: '36px' }}
                    value={quickInjectSearch}
                    onChange={(e) => setQuickInjectSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Body: List of Tables */}
              <div className="flex-1 overflow-y-auto p-4 df-scrollbar">
                {filteredQuickInject.length > 0 ? (
                  <div className="space-y-1">
                    {filteredQuickInject.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          handleTableClick(item.catalog, item.schema, item.table);
                          setShowQuickInject(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer group"
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; e.currentTarget.style.borderColor = 'var(--df-border)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 group-hover:text-amber-600 transition-colors" style={{ backgroundColor: 'var(--df-bg)', border: '1px solid var(--df-border)' }}>
                          <FiTable size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--df-strong)' }}>
                            {item.table.name}
                            <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-50 text-amber-700 rounded-full border border-amber-100 uppercase tracking-wider">External</span>
                          </div>
                          <div className="text-[10px] truncate" style={{ color: 'var(--df-text-muted)' }}>
                            {item.catalog.name}.{item.schema.name}
                          </div>
                        </div>
                        <FiPlus className="opacity-0 group-hover:opacity-100 transition-all font-bold" style={{ color: 'var(--df-text-muted)' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FiFilter className="mx-auto mb-2" size={32} style={{ color: 'var(--df-border)' }} />
                    <p className="text-xs" style={{ color: 'var(--df-text-muted)' }}>
                      {quickInjectSearch ? 'No matching tables found.' : 'All catalog tables have been injected.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between" style={{ backgroundColor: 'var(--df-bg-secondary)', borderTopColor: 'var(--df-border)' }}>
                <span className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>{filteredQuickInject.length} tables available</span>
                <button 
                  onClick={() => { setShowQuickInject(false); navigate('/catalog'); }}
                  className="text-[10px] font-bold underline underline-offset-4"
                  style={{ color: 'var(--df-accent)' }}
                >
                  View full Catalog
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar + Search */}
        <div className="flex items-center gap-4 py-2" style={{ borderTop: '1px solid var(--df-border)', borderBottom: '1px solid var(--df-border)' }}>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}>
            {[
              { label: 'SQL Editor', icon: FiZap, to: '/sql-editor' },
              { label: 'Create Table', icon: FiPlus },
              { label: 'Catalogs', icon: FiGrid },
              { label: 'History', icon: FiClock, to: '/query-history' },
            ].map((btn, i) => (
              <button 
                key={i}
                onClick={() => btn.to && navigate(btn.to)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all"
                style={{ color: 'var(--df-text-soft)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
              >
                <btn.icon size={13} /> {btn.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
              <FiSearch size={15} style={{ color: 'var(--df-text-muted)' }} />
              <div className="w-px h-4" style={{ backgroundColor: 'var(--df-border)' }} />
              <button 
                onClick={() => setShowSearchFilters(!showSearchFilters)}
                className="flex items-center gap-1 text-[10px] font-black uppercase transition-colors"
                style={{ color: 'var(--df-text-soft)' }}
              >
                {searchCategory} <FiChevronDown size={8} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Search injected data assets..."
              className="df-input py-2 pr-12 text-xs rounded-lg"
              style={{ paddingLeft: '140px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {showSearchFilters && (
              <div className="absolute left-10 top-full mt-1 w-32 rounded-lg py-1 z-50 overflow-hidden animate-fadeIn" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}>
                {['All', 'Catalog', 'Schema', 'Table'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setSearchCategory(cat); setShowSearchFilters(false); }}
                    className="w-full text-left px-3 py-1.5 text-[10px] font-bold transition-colors"
                    style={{ color: 'var(--df-text-soft)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1 py-0.5 rounded" style={{ color: 'var(--df-text-muted)', backgroundColor: 'var(--df-surface)', border: '1px solid var(--df-border)' }}>
              ⌘ K
            </div>
          </div>
        </div>

        {/* Stats + Main Layout */}
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            {/* Stats Row */}
            <div className="df-card flex items-center gap-8 px-6 py-4">
              {[
                { label: 'Catalogs', val: stats.totalCatalogs },
                { label: 'Schemas', val: stats.totalSchemas },
                { label: 'Tables', val: stats.totalTables },
                { label: 'Storage', val: stats.storageUsed },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>{stat.label}</span>
                    <span className="text-sm font-extrabold leading-none mt-0.5 truncate max-w-[120px]" style={{ color: 'var(--df-strong)' }} title={stat.val}>{stat.val}</span>
                  </div>
                  {i < 3 && <div className="w-px h-8 ml-4" style={{ backgroundColor: 'var(--df-border)' }} />}
                </div>
              ))}
            </div>

            {/* Storage Usage Bar */}
            <div className="df-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--df-strong)' }}>Storage Usage Breakdown</h3>
                  <p className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>Distribution of data across injected catalogs</p>
                </div>
                <span className="text-xs font-black" style={{ color: 'var(--df-accent)' }}>{stats.storageUsed}</span>
              </div>
              <div className="h-2.5 w-full rounded-full flex overflow-hidden" style={{ backgroundColor: 'var(--df-surface)' }}>
                {injectedTables.length > 0 ? (
                  injectedTables.slice(0, 5).map((t, i) => {
                    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
                    // Simple mock width for visualization if storageSize is just a string like "1.2 MB"
                    const width = 100 / Math.min(injectedTables.length, 5); 
                    return (
                      <div 
                        key={i} 
                        style={{ width: `${width}%`, backgroundColor: colors[i % colors.length] }} 
                        title={`${t.catalogName}.${t.tableName}: ${t.storageSize}`}
                        className="h-full transition-all hover:opacity-80 cursor-help"
                      />
                    );
                  })
                ) : (
                  <div className="flex-1" />
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {injectedTables.slice(0, 5).map((t, i) => {
                  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-[10px] font-medium" style={{ color: 'var(--df-text-soft)' }}>{t.tableName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {favoriteTables.filter(ft => injectedTables.some(it => it.tableId === ft.table.id)).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--df-text-muted)' }}>
                  <FiStar /> Favorite Tables
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {favoriteTables.filter(ft => injectedTables.some(it => it.tableId === ft.table.id)).map(({ catalog, schema, table }) => (
                    <div 
                      key={`fav-card-${table.id}`}
                      onClick={() => handleTableClick(catalog, schema, table)}
                      className="df-card df-card-interactive p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
                          <FiStar className="text-amber-500 fill-amber-500" size={14} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate" style={{ color: 'var(--df-strong)' }}>{table.name}</span>
                          <span className="text-[10px] truncate" style={{ color: 'var(--df-text-muted)' }}>{catalog.name}.{schema.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Recent Tables (Filtered by injected) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--df-text-muted)' }}>
                  <FiClock /> Recently Injected
                </h3>
                <button onClick={() => navigate('/catalog')} className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--df-accent)' }}>
                  View all assets
                </button>
              </div>

              <div className="df-card overflow-hidden min-h-[100px] flex flex-col justify-center">
                {injectedTables.length > 0 ? (
                  <table className="df-table w-full text-left text-xs">
                    <thead>
                      <tr>
                        <th>Asset</th>

                        <th>Storage</th>
                        <th>Injected</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {injectedTables.slice(0, 5).map((t, i) => {
                        return (
                          <tr key={i} className="group cursor-pointer">
                            <td>
                              <div className="flex items-center gap-2.5">
                                <FiTable style={{ color: 'var(--df-accent)' }} size={14} />
                                <div className="flex flex-col">
                                  <span className="font-bold" style={{ color: 'var(--df-strong)' }}>{t.tableName}</span>
                                  <span className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>{t.source || `${t.catalogName}.${t.schemaName}.${t.tableName}`}</span>
                                </div>
                              </div>
                            </td>

                            <td style={{ color: 'var(--df-text-soft)' }}>{t.storageSize || 'N/A'}</td>
                            <td style={{ color: 'var(--df-text-soft)' }}>
                              {t.injected_at ? new Date(t.injected_at).toLocaleString() : 'Recently'}
                            </td>
                            <td>
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleRunQueryForTable(t.schemaName, t.tableName)}
                                  className="p-1.5 rounded transition-all" title="Run Query"
                                  style={{ color: 'var(--df-text-soft)' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                  <FiPlay size={14} />
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setActiveRowMenu(activeRowMenu === t.tableId ? null : t.tableId); }}
                                    className="p-1.5 rounded transition-all" style={{ color: 'var(--df-text-soft)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                    <FiMoreVertical size={14} />
                                  </button>
                                  {activeRowMenu === t.tableId && (
                                    <div className="absolute right-0 top-full mt-1 w-40 rounded-lg py-1 z-50 animate-fadeIn"
                                      style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}>
                                      <button onClick={() => { handleRunQueryForTable(t.schemaName, t.tableName); setActiveRowMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors"
                                        style={{ color: 'var(--df-text-soft)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                        <FiPlay size={12} /> Run Query
                                      </button>
                                      <button onClick={() => { handleExportCSVForTable(t.schemaName, t.tableName); setActiveRowMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors"
                                        style={{ color: 'var(--df-text-soft)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                        <FiDownload size={12} /> Export CSV
                                      </button>
                                      {(() => { const match = findFullTable(t.schemaName, t.tableName); return match ? (
                                        <button onClick={() => { handleTableClick(match.catalog, match.schema, match.table); setActiveRowMenu(null); }}
                                          className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors"
                                          style={{ color: 'var(--df-text-soft)' }}
                                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                          <FiExternalLink size={12} /> Open Table
                                        </button>
                                      ) : null; })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-xs font-medium" style={{ color: 'var(--df-text-muted)' }}>
                    No tables injected yet. Browse the Catalog to inject data.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Panel */}
          <div className="w-72 space-y-4">
            <div className="df-card p-4 flex flex-col h-full">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4" style={{ color: 'var(--df-strong)' }}>
                <FiActivity style={{ color: 'var(--df-accent)' }} /> Recent Activity
              </h3>
              <div className="space-y-5">
                {recentActivityHistory.length > 0 ? recentActivityHistory.map((item) => (
                  <div key={item.id} className="relative pl-5" style={{ borderLeft: '1px solid var(--df-border)' }}>
                    <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full" style={{
                      backgroundColor: item.type === 'query' ? 'var(--df-info)' : item.type === 'table' ? 'var(--df-accent)' : '#F59E0B',
                      border: '2px solid var(--df-card-bg)'
                    }} />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[11px] leading-tight font-medium" style={{ color: 'var(--df-text-soft)' }}>{item.detail}</p>
                      <span className="text-[9px] flex items-center gap-1" style={{ color: 'var(--df-text-muted)' }}>
                        <FiClock size={10} /> {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.duration && <span className="opacity-60">• {item.duration.toFixed(2)}s</span>}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center text-[10px]" style={{ color: 'var(--df-text-muted)' }}>
                    No recent activity found.
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/query-history')} className="mt-6 w-full py-2 rounded-lg text-[10px] font-black uppercase transition-all" style={{ backgroundColor: 'var(--df-surface)', border: '1px solid var(--df-border)', color: 'var(--df-text-soft)' }}>
                View Full Logs
              </button>
            </div>
            
            {/* CTA Card */}
            <div className="rounded-xl p-4 text-white shadow-md" style={{ background: 'var(--df-gradient)' }}>
              <h4 className="text-xs font-bold mb-1">New to Warehouse?</h4>
              <p className="text-[10px] opacity-90 leading-relaxed mb-3">Explore our professional documentation to master data management.</p>
              <button className="w-full py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5">
                Read Documentation <FiArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
