import React, { useState } from 'react';
import { 
  FiDatabase, FiChevronLeft, FiStar, FiChevronDown, FiChevronRight, 
  FiLayers, FiMoreVertical, FiTable, FiBox, FiArchive, FiGrid, FiTrash2
} from 'react-icons/fi';

const Sidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  favoriteTables, 
  handleTableClick, 
  catalogs, 
  selectedTable, 
  favorites, 
  toggleFavorite,
  injectedTables,
  handleBackToDashboard,
  removeInjectedTable
}) => {
  const [warehouseExpanded, setWarehouseExpanded] = useState(true);

  // Build warehouse tree from injected tables grouped by schema
  const warehouseBySchema = {};
  (injectedTables || []).forEach(t => {
    const schema = t.schemaName || 'default';
    if (!warehouseBySchema[schema]) warehouseBySchema[schema] = [];
    warehouseBySchema[schema].push(t);
  });

  // Find the full table object from catalogs for a warehouse table click
  const findFullTable = (schemaName, tableName) => {
    for (const cat of catalogs) {
      for (const sch of (cat.schemas || [])) {
        if (sch.name === schemaName) {
          const tbl = sch.tables?.find(t => t.name === tableName);
          if (tbl) return { catalog: cat, schema: sch, table: tbl };
        }
      }
    }
    return null;
  };


  return (
    <div 
      style={{ width: isSidebarOpen ? '220px' : '0px', backgroundColor: 'var(--df-sidebar-bg)', borderRight: isSidebarOpen ? '1px solid var(--df-border)' : 'none' }}
      className="flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 h-[61px] flex items-center justify-between sticky top-0 z-20" style={{ backgroundColor: 'var(--df-card-bg)', borderBottom: '1px solid var(--df-border)' }}>
        <div className="flex items-center gap-2">
          <FiDatabase style={{ color: 'var(--df-accent)' }} size={20} />
          <h2 className="font-bold text-lg tracking-tight" style={{ color: 'var(--df-strong)' }}>Explorer</h2>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'var(--df-text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <FiChevronLeft size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 df-scrollbar">

        {/* ═══════════════════════════════════════════════════
            SECTION: DASHBOARD
           ═══════════════════════════════════════════════════ */}
        <button
          onClick={handleBackToDashboard}
          className="w-full flex items-center gap-2 px-2 py-2 mb-2 rounded-md transition-colors"
          style={{
            backgroundColor: !selectedTable ? 'var(--df-sidebar-active)' : 'transparent',
            color: !selectedTable ? 'var(--df-accent)' : 'var(--df-text-soft)',
          }}
          onMouseEnter={(e) => { if (selectedTable) e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
          onMouseLeave={(e) => { if (selectedTable) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <FiGrid size={18} style={{ color: !selectedTable ? 'var(--df-accent)' : 'var(--df-text-muted)' }} />
          <span className="text-[15px] font-bold flex-1 text-left">Dashboard</span>
        </button>

        {/* ═══════════════════════════════════════════════════
            SECTION: WAREHOUSE (Silver / Managed)
           ═══════════════════════════════════════════════════ */}
        <div className="mb-1">
          <button
            onClick={() => setWarehouseExpanded(!warehouseExpanded)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {warehouseExpanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
            </div>
            <FiArchive size={18} style={{ color: 'var(--df-accent)' }} />
            <span className="text-[15px] font-bold flex-1 text-left" style={{ color: 'var(--df-text-soft)' }}>Warehouse</span>
          </button>

          {warehouseExpanded && (
            <div className="mt-0.5 ml-2">
              {(injectedTables || []).length === 0 ? (
                <div className="px-4 py-3 text-[10px] italic" style={{ color: 'var(--df-text-muted)' }}>
                  No tables injected yet. Visit the Catalog page to inject data.
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Favorites in warehouse */}
                  {favoriteTables.filter(ft => (injectedTables || []).some(it => it.tableId === ft.table.id)).length > 0 && (
                    <div className="mb-2 pb-1" style={{ borderBottom: '1px solid var(--df-border)' }}>
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>
                        <FiStar size={12} /> Favorites
                      </div>
                      {favoriteTables.filter(ft => (injectedTables || []).some(it => it.tableId === ft.table.id)).map(({ catalog, schema, table }) => (
                        <div
                          key={`wh-fav-${table.id}`}
                          onClick={() => { handleTableClick(catalog, schema, table); }}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[14px] transition-all"
                          style={{ color: 'var(--df-text-soft)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <FiStar size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                          <span className="truncate">{table.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Injected tables grouped by schema */}
                  {Object.entries(warehouseBySchema).map(([schemaName, tables]) => (
                    <div key={schemaName}>
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>
                        <FiLayers size={12} /> {schemaName}
                      </div>
                      {tables.map(t => {
                        const match = findFullTable(t.schemaName, t.tableName);
                        const isSelected = selectedTable?.id === t.tableId;
                        return (
                          <div
                            key={t.tableId}
                            onClick={() => {
                              if (match) {
                                handleTableClick(match.catalog, match.schema, match.table);
                              }
                            }}
                            className={`group flex items-center gap-1.5 px-2 py-1.5 ml-2 rounded-md cursor-pointer text-[14px] transition-all duration-200 ${isSelected ? 'font-medium' : ''}`}
                            style={{
                              backgroundColor: isSelected ? 'var(--df-sidebar-active)' : 'transparent',
                              color: isSelected ? 'var(--df-accent)' : 'var(--df-text-soft)',
                            }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <FiTable size={11} style={{ color: isSelected ? 'var(--df-accent)' : 'var(--df-text-muted)' }} />
                            <span className="truncate flex-1">{t.tableName}</span>
                            
                            {/* Hover Action: Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Remove ${t.tableName} from warehouse?`)) {
                                  removeInjectedTable(t.tableId);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all hover:bg-red-100 text-red-500"
                              title="Delete Injection"
                            >
                              <FiTrash2 size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
