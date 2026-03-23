import React, { useState, useEffect } from 'react';
import { FiX, FiLayers, FiActivity, FiDatabase, FiTag, FiCopy, FiExternalLink, FiDownloadCloud, FiGitBranch } from 'react-icons/fi';
import TagBadge from '../shared/TagBadge';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import { MOCK_DB } from '../../data/warehouseMockData';

const AVAILABLE_TAGS = ['bronze', 'silver', 'gold'];

const MetadataDrawer = ({ isOpen, onClose, table, schema, catalog, onInject, onOpenInWarehouse }) => {
  const [activeTab, setActiveTab] = useState('columns');
  const [tableTags, setTableTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  useEffect(() => {
    if (!isOpen || !table || !schema) return;
    setActiveTab('columns');
    setIsLoadingTags(true);
    // Load tags from mock data
    setTimeout(() => {
      const key = `${schema.name}_${table.name}`;
      setTableTags(MOCK_DB.tags[key] || []);
      setIsLoadingTags(false);
    }, 200);
  }, [isOpen, table?.id]);

  const handleAddTag = (tag) => {
    setTableTags(prev => prev.includes(tag) ? prev : [...prev, tag]);
    setShowTagMenu(false);
  };

  const handleRemoveTag = (tag) => {
    setTableTags(prev => prev.filter(t => t !== tag));
  };

  const handleCopyPath = () => {
    if (catalog && schema && table) {
      navigator.clipboard.writeText(`${catalog.name}.${schema.name}.${table.name}`).catch(() => {});
    }
  };

  if (!isOpen || !table) return null;

  const tabs = [
    { id: 'columns', label: 'Columns' },
    { id: 'stats', label: 'Statistics' },
    { id: 'lineage', label: 'Lineage' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: '420px',
          backgroundColor: 'var(--df-card-bg)',
          borderLeft: '1px solid var(--df-border)',
          boxShadow: 'var(--df-shadow-lg)',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--df-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
              <FiLayers size={18} style={{ color: 'var(--df-accent)' }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate" style={{ color: 'var(--df-strong)' }}>{table.name}</h3>
              <p className="text-[10px] truncate" style={{ color: 'var(--df-text-muted)' }}>
                {catalog?.name}.{schema?.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--df-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FiX size={18} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="px-5 py-3 grid grid-cols-3 gap-3" style={{ borderBottom: '1px solid var(--df-border)' }}>
          {[
            { label: 'Rows', value: table.rowCount?.toLocaleString() ?? '—', icon: <FiActivity size={12} style={{ color: 'var(--df-info, #3B82F6)' }} /> },
            { label: 'Columns', value: table.columns?.length ?? '—', icon: <FiLayers size={12} style={{ color: 'var(--df-accent)' }} /> },
            { label: 'Size', value: table.storageSize || 'N/A', icon: <FiDatabase size={12} style={{ color: 'var(--df-success, #059669)' }} /> },
          ].map((s, i) => (
            <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
              <div className="flex items-center justify-center mb-1">{s.icon}</div>
              <div className="text-sm font-bold" style={{ color: 'var(--df-strong)' }}>{s.value}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="px-5 py-3 flex items-center gap-2 flex-wrap" style={{ borderBottom: '1px solid var(--df-border)' }}>
          <FiTag size={12} style={{ color: 'var(--df-text-muted)' }} />
          {isLoadingTags ? (
            <LoadingSkeleton width="80px" height="18px" borderRadius="9999px" />
          ) : (
            <>
              {tableTags.map(tag => (
                <TagBadge key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowTagMenu(!showTagMenu)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                  style={{ color: 'var(--df-text-muted)', border: '1px dashed var(--df-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--df-accent)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--df-border)'; e.currentTarget.style.color = 'var(--df-text-muted)'; }}
                >
                  + Add Tag
                </button>
                {showTagMenu && (
                  <div className="absolute top-full left-0 mt-1 py-1 rounded-lg z-10 animate-fadeIn" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)', minWidth: '100px' }}>
                    {AVAILABLE_TAGS.filter(t => !tableTags.includes(t)).map(tag => (
                      <button key={tag} onClick={() => handleAddTag(tag)}
                        className="w-full text-left px-3 py-1.5 text-[11px] font-bold capitalize transition-colors"
                        style={{ color: 'var(--df-text-soft)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        {tag}
                      </button>
                    ))}
                    {AVAILABLE_TAGS.filter(t => !tableTags.includes(t)).length === 0 && (
                      <div className="px-3 py-2 text-[10px]" style={{ color: 'var(--df-text-muted)' }}>All tags applied</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 flex items-center gap-1" style={{ borderBottom: '1px solid var(--df-border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-2 text-xs font-bold transition-all"
              style={{
                color: activeTab === tab.id ? 'var(--df-accent)' : 'var(--df-text-soft)',
                borderBottom: activeTab === tab.id ? '2px solid var(--df-accent)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto df-scrollbar p-5">
          {activeTab === 'columns' && (
            <div className="space-y-1">
              {table.columns?.map((col, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-bg-secondary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--df-strong)' }}>{col.name}</div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--df-text-muted)' }}>{col.type}</div>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--df-surface)', color: 'var(--df-text-muted)' }}>
                    {col.type?.includes('NOT NULL') ? 'REQUIRED' : 'NULLABLE'}
                  </span>
                </div>
              )) ?? <div className="text-xs" style={{ color: 'var(--df-text-muted)' }}>No column data available.</div>}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <p className="text-xs" style={{ color: 'var(--df-text-soft)' }}>
                {table.description || `Table ${table.name} in ${schema?.name} schema.`}
              </p>
              <div className="space-y-2">
                {[
                  ['Table Type', 'BASE TABLE'],
                  ['Encoding', 'UTF-8'],
                  ['Row Count', table.rowCount?.toLocaleString() ?? '—'],
                  ['Storage Size', table.storageSize || 'N/A'],
                  ['Column Count', table.columns?.length ?? '—'],
                  ['Full Path', `${catalog?.name}.${schema?.name}.${table.name}`],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid var(--df-border)' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--df-text-muted)' }}>{label}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--df-strong)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lineage' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--df-surface)' }}>
                <FiGitBranch size={24} style={{ color: 'var(--df-text-muted)' }} />
              </div>
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--df-strong)' }}>Table Lineage</h4>
              <p className="text-xs max-w-[240px]" style={{ color: 'var(--df-text-muted)' }}>
                Data lineage tracking will be available in a future release. This will show upstream and downstream dependencies.
              </p>
              <span className="mt-3 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--df-accent-soft)', color: 'var(--df-accent)' }}>
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
          <button onClick={handleCopyPath} className="df-btn df-btn-ghost text-xs flex-1 py-2">
            <FiCopy size={13} /> Copy Path
          </button>
          {onInject && (
            <button onClick={() => onInject(catalog, schema, table)} className="df-btn df-btn-primary text-xs flex-1 py-2">
              <FiDownloadCloud size={13} /> Inject
            </button>
          )}
          {onOpenInWarehouse && (
            <button onClick={() => onOpenInWarehouse(catalog, schema, table)} className="df-btn df-btn-primary text-xs flex-1 py-2">
              <FiExternalLink size={13} /> Open in Warehouse
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.8; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default MetadataDrawer;
