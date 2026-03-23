import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FiChevronDown, FiChevronRight, FiArchive, FiTable, FiColumns, FiSearch, FiPlay
} from 'react-icons/fi';

const SchemaBrowser = ({ onTablePreview }) => {
  const { catalogs } = useData();
  const [expanded, setExpanded] = useState({ 'sales_catalog': true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full select-none" style={{ backgroundColor: 'var(--df-card-bg)' }}>
      <div className="p-4" style={{ borderBottom: '1px solid var(--df-border)' }}>
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--df-text-muted)' }}>Schema Browser</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--df-text-muted)' }} />
          <input
            type="text"
            placeholder="Filter..."
            className="w-full df-input py-2 pr-3 text-sm rounded-lg"
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 df-scrollbar">
        {Object.entries(catalogs).map(([catalogName, schemas]) => (
          <div key={catalogName} className="mb-2">
            <div 
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors"
              onClick={() => toggleExpand(catalogName)}
              style={{ color: 'var(--df-strong)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {expanded[catalogName] ? <FiChevronDown size={14} style={{ color: 'var(--df-text-muted)' }} /> : <FiChevronRight size={14} style={{ color: 'var(--df-text-muted)' }} />}
              <FiArchive size={15} style={{ color: 'var(--df-accent)' }} />
              <span className="text-[13px] font-bold tracking-tight uppercase" style={{ color: 'var(--df-strong)' }}>{catalogName}</span>
            </div>

            {expanded[catalogName] && (
              <div className="ml-3.5 pl-2.5 mt-1" style={{ borderLeft: '1px solid var(--df-border)' }}>
                {Object.entries(schemas).map(([schemaName, tables]) => (
                  <div key={`${catalogName}-${schemaName}`} className="mb-1">
                    <div 
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors"
                      onClick={() => toggleExpand(`${catalogName}-${schemaName}`)}
                      style={{ color: 'var(--df-text)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {expanded[`${catalogName}-${schemaName}`] ? <FiChevronDown size={14} style={{ color: 'var(--df-text-muted)' }} /> : <FiChevronRight size={14} style={{ color: 'var(--df-text-muted)' }} />}
                      <span className="text-[14px] font-medium" style={{ color: 'var(--df-text)' }}>{schemaName}</span>
                    </div>

                    {expanded[`${catalogName}-${schemaName}`] && (
                      <div className="ml-3.5 pl-2.5 mt-1" style={{ borderLeft: '1px solid var(--df-border)' }}>
                        {Object.entries(tables)
                          .filter(([tableName]) => tableName.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(([tableName, tableData]) => (
                            <TableItem 
                              key={tableName} 
                              name={tableName} 
                              columns={tableData.columns} 
                              onPreview={() => {
                                if (onTablePreview) onTablePreview(tableName);
                              }}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TableItem = ({ name, columns, onPreview }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', name);
  };

  return (
    <div className="mb-0.5" draggable onDragStart={handleDragStart} title="Drag to editor">
      <div 
        className="flex items-center justify-between p-1.5 rounded-lg group transition-colors"
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiChevronDown size={12} style={{ color: 'var(--df-text-muted)' }} /> : <FiChevronRight size={12} style={{ color: 'var(--df-text-muted)' }} />}
          <FiTable size={14} style={{ color: 'var(--df-text)' }} />
          <span className="text-[14px] font-medium" style={{ color: 'var(--df-text-soft)' }}>{name}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          className="p-1.5 px-2 flex items-center gap-1 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/10"
          style={{ color: 'var(--df-text-soft)' }}
          title="Preview Data"
        >
          <FiPlay size={10} className="fill-current" />
        </button>
      </div>
      
      {isOpen && (
        <div className="ml-3.5 pl-2.5 mt-0.5" style={{ borderLeft: '1px solid var(--df-border)' }}>
          {columns.map(col => (
            <div key={col} className="flex items-center gap-2 p-1.5 rounded-md cursor-default group transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <FiColumns size={12} style={{ color: 'var(--df-text-muted)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'var(--df-text-soft)' }}>{col}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaBrowser;
