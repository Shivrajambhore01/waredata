import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiDatabase, FiSearch, FiChevronDown, FiChevronRight,
  FiLayers, FiTable, FiBox, FiLoader,
  FiFilter, FiEye, FiDownloadCloud, FiExternalLink, FiStar, FiInfo, FiUploadCloud, FiFile
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import MetadataDrawer from '../components/Catalog/MetadataDrawer';
import TablePreviewModal from '../components/Catalog/TablePreviewModal';
import VolumePanel from '../components/Catalog/VolumePanel';
import VolumeUploadModal from '../components/Catalog/VolumeUploadModal';
import TagBadge from '../components/shared/TagBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';
import { MOCK_DB } from '../data/warehouseMockData';

const Catalog = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [catalogs, setCatalogs] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [injectedTables, setInjectedTables] = useState(() => {
    try { return JSON.parse(localStorage.getItem('injectedTables') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('all');

  // New state for enhancements
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('catalog_favorites') || '[]'); } catch { return []; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTable, setDrawerTable] = useState(null);
  const [drawerSchema, setDrawerSchema] = useState(null);
  const [drawerCatalog, setDrawerCatalog] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTable, setPreviewTable] = useState(null);
  const [previewSchema, setPreviewSchema] = useState(null);
  const [previewCatalog, setPreviewCatalog] = useState(null);
  const [allTags, setAllTags] = useState({});
  const [volumeUploadOpen, setVolumeUploadOpen] = useState(false);
  const [volumeRefreshKey, setVolumeRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('catalog_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('injectedTables', JSON.stringify(injectedTables));
  }, [injectedTables]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Use mock data instead of backend
    setTimeout(() => {
      const cats = MOCK_DB.catalogs;
      setCatalogs(cats);
      if (cats.length > 0) {
        setExpandedItems([cats[0].id]);
      }
      // Load mock tags
      setAllTags(MOCK_DB.tags || {});
      setIsLoading(false);
    }, 300);
  }, []);

  // Fetch catalogs on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleExpand = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isTableInjected = useCallback((tableId) => {
    return injectedTables.some(t => t.tableId === tableId);
  }, [injectedTables]);

  const toggleFavorite = (tableId, e) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]
    );
  };

  // Flatten all tables for the main content list
  const allTables = [];
  catalogs.forEach(cat => {
    cat.schemas?.forEach(sch => {
      sch.tables?.forEach(tbl => {
        allTables.push({ catalog: cat, schema: sch, table: tbl });
      });
    });
  });

  // Filter
  const filteredTables = allTables.filter(({ table, schema, catalog }) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      table.name.toLowerCase().includes(q) ||
      schema.name.toLowerCase().includes(q) ||
      catalog.name.toLowerCase().includes(q)
    );
  });

  const handleOpenInWarehouse = (catalog, schema, table) => {
    navigate('/warehouse', { state: { selectTable: { catalog, schema, table } } });
  };

  const handleOpenDrawer = (catalog, schema, table, e) => {
    e?.stopPropagation();
    setDrawerCatalog(catalog);
    setDrawerSchema(schema);
    setDrawerTable(table);
    setDrawerOpen(true);
  };

  const handleOpenPreview = (catalog, schema, table, e) => {
    e?.stopPropagation();
    setPreviewCatalog(catalog);
    setPreviewSchema(schema);
    setPreviewTable(table);
    setPreviewOpen(true);
  };

  const handleInjectFromCatalog = (catalog, schema, table) => {
    setDrawerOpen(false);
    navigate('/warehouse', { state: { selectTable: { catalog, schema, table } } });
    toast.info(`Opening ${table.name} in Warehouse for injection...`);
  };

  return (
    <div className="flex h-full animate-fadeIn overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-bg-secondary)', color: 'var(--df-text)' }}>
      {/* ── LEFT: Catalog Tree Panel ── */}
      <div className="w-[240px] flex flex-col flex-shrink-0 overflow-hidden" style={{ borderRight: '1px solid var(--df-border)', backgroundColor: 'var(--df-sidebar-bg)' }}>
        {/* Header */}
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-card-bg)' }}>
          <FiBox size={20} style={{ color: 'var(--df-accent)' }} />
          <h2 className="font-bold text-lg tracking-tight" style={{ color: 'var(--df-strong)' }}>Catalog</h2>
        </div>

        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--df-text-muted)' }} size={13} />
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full text-[13px] df-input py-1.5 pr-3 rounded-md"
              style={{ paddingLeft: '28px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto p-2 df-scrollbar">
          {isLoading ? (
            <div className="p-3">
              <LoadingSkeleton count={5} height="24px" />
            </div>
          ) : (
            <div className="space-y-0.5">
              {catalogs.map(catalog => {
                const isExpanded = expandedItems.includes(catalog.id);
                return (
                  <div key={catalog.id} className="select-none">
                    <div
                      onClick={() => toggleExpand(catalog.id)}
                      className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-all"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div className="w-4 h-4 flex items-center justify-center" style={{ color: 'var(--df-text-muted)' }}>
                        {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      </div>
                      <FiDatabase size={18} style={{ color: 'var(--df-accent)' }} />
                      <span className="text-[15px] font-bold flex-1 truncate" style={{ color: 'var(--df-text-soft)' }}>{catalog.name}</span>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 pl-2" style={{ borderLeft: '1px solid var(--df-border)' }}>
                        {catalog.schemas.map(schema => {
                          const schemaId = `${catalog.id}-${schema.id}`;
                          const isSchemaExpanded = expandedItems.includes(schemaId);
                          return (
                            <div key={schema.id}>
                              <div
                                onClick={() => toggleExpand(schemaId)}
                                className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-all"
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center" style={{ color: 'var(--df-text-muted)' }}>
                                  {isSchemaExpanded ? <FiChevronDown size={13} /> : <FiChevronRight size={13} />}
                                </div>
                                <FiLayers size={14} style={{ color: 'var(--df-text-muted)' }} />
                                <span className="text-[12px] font-bold uppercase tracking-wider flex-1 truncate" style={{ color: 'var(--df-text-muted)' }}>{schema.name}</span>
                              </div>

                              {isSchemaExpanded && (
                                <div className="ml-5 mt-0.5 space-y-0.5 pl-2" style={{ borderLeft: '1px solid var(--df-border)' }}>
                                  {schema.tables.map(table => {
                                    const injected = isTableInjected(table.id);
                                    const isFav = favorites.includes(table.id);
                                    return (
                                      <div
                                        key={table.id}
                                        onClick={() => handleOpenInWarehouse(catalog, schema, table)}
                                        className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-[14px] transition-all"
                                        style={{ color: 'var(--df-text-soft)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        <FiTable size={14} style={{ color: injected ? 'var(--df-accent)' : 'var(--df-text-muted)' }} />
                                        <span className="truncate flex-1">{table.name}</span>
                                        {isFav && <FiStar size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--df-bg)' }}>
        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-bg)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
              <FiBox size={22} style={{ color: 'var(--df-accent)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--df-strong)' }}>Catalog</h1>
              <p className="text-xs" style={{ color: 'var(--df-text-muted)' }}>Browse and discover data sources</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Tables' },
              { id: 'not-injected', label: 'Not Injected' },
              { id: 'injected', label: 'Injected' },
              { id: 'favorites', label: '★ Favorites' },
              { id: 'volumes', label: '📁 Volumes' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--df-accent-soft)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--df-accent)' : 'var(--df-text-soft)',
                  border: activeTab === tab.id ? '1px solid var(--df-accent-soft)' : '1px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}

            {/* Upload Volume button */}
            <button
              onClick={() => setVolumeUploadOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ backgroundColor: 'var(--df-accent)', color: 'white' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <FiUploadCloud size={13} /> Upload Volume
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
          <div className="relative max-w-md">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--df-text-muted)' }} size={14} />
            <input
              type="text"
              placeholder="Filter tables..."
              className="w-full text-xs df-input py-2 pr-4 rounded-lg"
              style={{ paddingLeft: '36px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table list or Volume Panel */}
        <div className="flex-1 overflow-y-auto df-scrollbar">
          {activeTab === 'volumes' ? (
            <div className="p-6">
              <VolumePanel key={volumeRefreshKey} onConvertDone={() => { setVolumeRefreshKey(k => k + 1); fetchData(); }} />
            </div>
          ) : isLoading ? (
            <div className="p-6">
              <LoadingSkeleton count={8} height="48px" gap="8px" />
            </div>
          ) : (
            <table className="df-table w-full text-left">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}></th>
                  <th>Name</th>
                  <th>Schema</th>
                  <th>Rows</th>
                  <th>Size</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTables
                  .filter(({ table }) => {
                    if (activeTab === 'injected') return isTableInjected(table.id);
                    if (activeTab === 'not-injected') return !isTableInjected(table.id);
                    if (activeTab === 'favorites') return favorites.includes(table.id);
                    return true;
                  })
                  .map(({ catalog, schema, table }) => {
                    const injected = isTableInjected(table.id);
                    const isFav = favorites.includes(table.id);
                    const tableKey = `${schema.name}_${table.name}`;
                    const tableTags = allTags[tableKey] || [];
                    return (
                      <tr
                        key={table.id}
                        onClick={() => handleOpenDrawer(catalog, schema, table)}
                        className="cursor-pointer group"
                      >
                        {/* Favorite star */}
                        <td style={{ width: '36px', padding: '0 0 0 12px' }}>
                          <button
                            onClick={(e) => toggleFavorite(table.id, e)}
                            className="p-1 rounded transition-colors"
                            style={{ color: isFav ? '#F59E0B' : 'var(--df-text-muted)' }}
                          >
                            <FiStar size={14} className={isFav ? 'fill-amber-400' : ''} />
                          </button>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <FiTable size={14} style={{ color: injected ? 'var(--df-accent)' : 'var(--df-info)' }} />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold transition-colors" style={{ color: 'var(--df-strong)' }}>{table.name}</span>
                              <span className="text-[10px]" style={{ color: 'var(--df-text-muted)' }}>{catalog.name}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--df-text-soft)' }}>{schema.name}</td>
                        <td style={{ color: 'var(--df-text-soft)' }}>{table.rowCount?.toLocaleString() ?? '—'}</td>
                        <td style={{ color: 'var(--df-text-soft)' }}>{table.storageSize || 'N/A'}</td>
                        <td>
                          <div className="flex items-center gap-1 flex-wrap">
                            {tableTags.map(tag => (
                              <TagBadge key={tag} tag={tag} />
                            ))}
                          </div>
                        </td>
                        <td>
                          {injected ? (
                            <span className="px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider" style={{ backgroundColor: 'var(--df-accent-soft)', color: 'var(--df-accent)', border: '1px solid var(--df-accent-soft)' }}>Managed</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider" style={{ backgroundColor: 'var(--df-warning-soft, #FEF3C7)', color: 'var(--df-warning, #D97706)', border: '1px solid var(--df-warning-soft, #FDE68A)' }}>External</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleOpenPreview(catalog, schema, table, e)}
                              className="p-1.5 rounded-md transition-all" title="Preview Data"
                              style={{ color: 'var(--df-text-soft)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              onClick={(e) => handleOpenDrawer(catalog, schema, table, e)}
                              className="p-1.5 rounded-md transition-all" title="View Metadata"
                              style={{ color: 'var(--df-text-soft)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <FiInfo size={14} />
                            </button>
                            {!injected && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleInjectFromCatalog(catalog, schema, table); }}
                                className="p-1.5 rounded-md transition-all" title="Inject to Warehouse"
                                style={{ color: 'var(--df-text-soft)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <FiDownloadCloud size={14} />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenInWarehouse(catalog, schema, table); }}
                              className="p-1.5 rounded-md transition-all" title="Open in Warehouse"
                              style={{ color: 'var(--df-text-soft)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <FiExternalLink size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          {!isLoading && filteredTables.length === 0 && (
            <div className="py-16 text-center text-sm" style={{ color: 'var(--df-text-muted)' }}>
              No tables found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Metadata Drawer */}
      <MetadataDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        table={drawerTable}
        schema={drawerSchema}
        catalog={drawerCatalog}
        onInject={handleInjectFromCatalog}
        onOpenInWarehouse={handleOpenInWarehouse}
      />

      {/* Table Preview Modal */}
      <TablePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        table={previewTable}
        schema={previewSchema}
        catalog={previewCatalog}
      />

      {/* Volume Upload Modal */}
      <VolumeUploadModal
        isOpen={volumeUploadOpen}
        onClose={() => setVolumeUploadOpen(false)}
        onUploaded={() => { setVolumeRefreshKey(k => k + 1); setActiveTab('volumes'); }}
      />
    </div>
  );
};

export default Catalog;
