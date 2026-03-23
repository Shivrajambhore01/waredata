import React, { useState } from 'react';
import { FiDatabase, FiTable, FiSearch, FiChevronDown, FiChevronRight, FiGrid } from 'react-icons/fi';
import { MOCK_SCHEMA } from '../../mock/schemaMockData';

const QuerySidebar = ({ selectedCatalog, setSelectedCatalog, selectedDatabase, setSelectedDatabase }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTables, setExpandedTables] = useState(new Set());

  const databases = selectedCatalog ? MOCK_SCHEMA.databases[selectedCatalog] || [] : [];
  
  const filteredTables = MOCK_SCHEMA.tables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTable = (id) => {
    setExpandedTables(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onDragStart = (event, nodeType, tableData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('tableData', JSON.stringify(tableData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-[var(--df-border)] bg-[var(--df-card-bg)] flex flex-col h-full z-40 select-none">
      {/* Source Selection */}
      <div className="p-3 border-b border-[var(--df-border)] space-y-3 bg-[var(--df-bg-secondary)]/30">
        <div>
          <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider mb-1 block">Catalog</label>
          <div className="relative">
            <select 
              className="df-select !py-1.5 !text-[11px] !rounded-md pr-8"
              value={selectedCatalog}
              onChange={(e) => { setSelectedCatalog(e.target.value); setSelectedDatabase(''); }}
            >
              <option value="" disabled>Select Catalog...</option>
              {MOCK_SCHEMA.catalogs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--df-text-muted)] pointer-events-none" size={12} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider mb-1 block">Database</label>
          <div className="relative">
            <select 
              className="df-select !py-1.5 !text-[11px] !rounded-md pr-8"
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              disabled={!selectedCatalog}
            >
              <option value="" disabled>Select Database...</option>
              {databases.map(db => <option key={db.id} value={db.id}>{db.name}</option>)}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--df-text-muted)] pointer-events-none" size={12} />
          </div>
        </div>
      </div>

      <div className="p-2 border-b border-[var(--df-border)]">
        <div className="relative">
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--df-text-muted)]" size={12} />
          <input 
            type="text" 
            placeholder="Search tables..." 
            className="df-input !pl-8 !py-1.5 !text-[11px] !rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto df-scrollbar p-2 space-y-px">
        <div className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider mb-2 px-1 flex items-center justify-between mt-1">
          <span>Available Tables</span>
          <span className="bg-[var(--df-bg-secondary)] px-1.5 py-0.5 rounded text-[9px]">{filteredTables.length}</span>
        </div>
        
        {selectedDatabase ? filteredTables.map(table => (
          <div key={table.id} className="group">
            <div 
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[var(--df-bg-secondary)] cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'queryTableNode', table)}
              onClick={() => toggleTable(table.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <FiGrid size={12} className={table.type === 'FACT' ? 'text-orange-500' : 'text-blue-500'} />
                <span className="text-[11px] font-bold text-[var(--df-strong)] truncate select-none">{table.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-[var(--df-text-muted)] uppercase tracking-tighter hidden group-hover:block px-1 py-0.5 border border-[var(--df-border)] rounded bg-[var(--df-card-bg)]">Drag</div>
                {expandedTables.has(table.id) ? (
                  <FiChevronDown size={12} className="text-[var(--df-text-muted)]" />
                ) : (
                  <FiChevronRight size={12} className="text-[var(--df-text-muted)]" />
                )}
              </div>
            </div>
            
            {expandedTables.has(table.id) && (
              <div className="ml-5 mt-0.5 mb-1.5 pb-1 border-l border-[var(--df-border)]/50 space-y-0.5 pl-2">
                {table.columns.map((col, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 px-1.5 hover:bg-[var(--df-bg-secondary)] rounded group/col transition-colors">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {col.isPK && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" title="Primary Key" />}
                      {col.isFK && !col.isPK && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Foreign Key" />}
                      {!col.isPK && !col.isFK && <div className="w-1.5 h-1.5 rounded-full border border-current opacity-30" />}
                      <span className="text-[var(--df-text-soft)] group-hover/col:text-[var(--df-strong)] truncate max-w-[90px]">{col.name}</span>
                    </div>
                    <span className="text-[9px] text-[var(--df-text-muted)] uppercase font-[JetBrains_Mono]">{col.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="p-4 text-center mt-4">
            <p className="text-[11px] text-[var(--df-text-muted)] leading-relaxed">Please select a database<br/>to browse tables.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuerySidebar;
