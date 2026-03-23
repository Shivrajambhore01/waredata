import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DB, generateCSV, generateJSON, downloadAsFile } from '../data/warehouseMockData';

export const useWarehouseLogic = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────
  const [catalogs, setCatalogs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [viewMode, setViewMode] = useState('data');
  const [showMetadata, setShowMetadata] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [recentActivityHistory, setRecentActivityHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentActivityHistory') || '[]'); } catch { return []; }
  });
  const [dashboardActivity, setDashboardActivity] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('catalog_favorites') || '[]'); } catch { return []; }
  });
  const [sortConfig, setSortConfig] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [rowLimit, setRowLimit] = useState(10);
  const [dataSearchQuery, setDataSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [tableStats, setTableStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const ROWS_PER_PAGE = 25;

  // ── Layered Architecture State ──────────────────────────────
  const [viewContext, setViewContext] = useState('catalog');
  const [sidebarSection, setSidebarSection] = useState('catalog');

  // ── Data Injection State ────────────────────────────────────
  const [injectedTables, setInjectedTables] = useState(() => {
    try { return JSON.parse(localStorage.getItem('injectedTables') || '[]'); } catch { return []; }
  });

  // ── Persist to LocalStorage ─────────────────────────────────
  useEffect(() => {
    localStorage.setItem('injectedTables', JSON.stringify(injectedTables));
  }, [injectedTables]);

  useEffect(() => {
    localStorage.setItem('catalog_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recentActivityHistory', JSON.stringify(recentActivityHistory));
  }, [recentActivityHistory]);

  // ── Load mock catalogs on mount ─────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    // Simulate async load
    setTimeout(() => {
      const data = MOCK_DB.catalogs;
      setCatalogs(data);
      if (data.length > 0) {
        const firstCat = data[0];
        const expandIds = [firstCat.id];
        if (firstCat.schemas?.length > 0) {
          expandIds.push(`${firstCat.id}-${firstCat.schemas[0].id}`);
        }
        setExpandedItems(expandIds);
      }
      // Build recent activity from the first few tables found
      setRecentActivity(MOCK_DB.recentActivity);
      
      // Initialize recentActivityHistory with MOCK_DB if empty
      setRecentActivityHistory(prev => prev.length === 0 ? MOCK_DB.dashboardActivity : prev);
      
      setIsLoading(false);
    }, 300);
  }, []);

  const isTableInjected = useCallback((tableId) => {
    return injectedTables.some(t => t.tableId === tableId || t.id === tableId);
  }, [injectedTables]);

  const injectTable = useCallback((catalog, schema, table) => {
    const tableId = table.id;
    const newEntry = {
      id: tableId,
      tableId,
      tableName: table.name,
      schemaName: schema.name,
      catalogName: catalog.name,
      rowCount: table.rowCount || 0,
      columnCount: table.columns?.length || 0,
      storageSize: table.storageSize || 'N/A',
      injected_at: new Date().toISOString(),
    };
    setInjectedTables(prev => {
      if (prev.some(t => t.tableId === tableId)) return prev;
      return [...prev, newEntry];
    });
    // Auto-switch to warehouse view after injection
    setViewContext('warehouse');
    setSidebarSection('warehouse');
    // Add to activity
    setRecentActivityHistory(prev => [
      { id: Date.now(), type: 'table', detail: `Table ${table.name} injected to warehouse`, timestamp: new Date().toISOString(), duration: 0.34 },
      ...prev
    ]);
  }, []);

  const removeInjectedTable = useCallback((tableId) => {
    setInjectedTables(prev => prev.filter(t => t.tableId !== tableId));
  }, []);

  // ── Derived stats (based on injected tables only) ──────────
  const stats = useMemo(() => {
    const totalTables = injectedTables.length;
    const totalColumns = injectedTables.reduce((sum, t) => sum + (t.columnCount || 0), 0);
    const totalRows = injectedTables.reduce((sum, t) => sum + (t.rowCount || 0), 0);
    const uniqueCatalogs = new Set(injectedTables.map(t => t.catalogName));
    const uniqueSchemas = new Set(injectedTables.map(t => t.schemaName));
    return {
      totalCatalogs: uniqueCatalogs.size,
      totalSchemas: uniqueSchemas.size,
      totalTables,
      totalColumns,
      totalRows: totalRows.toLocaleString(),
      storageUsed: totalTables === 0 ? '0 B' : injectedTables.map(t => t.storageSize).join(' + '),
      computeStatus: 'Active'
    };
  }, [injectedTables]);

  // ── Reset column state when table changes ───────────────────
  useEffect(() => {
    setSortConfig(null);
    setColumnFilters({});
    setHiddenColumns([]);
    setDataSearchQuery('');
    setShowFilters(false);
    setShowColumnPicker(false);
    setCurrentPage(1);
  }, [selectedTable?.id]);

  // ── Handlers ────────────────────────────────────────────────
  const toggleExpansion = (id, e) => {
    e?.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTableClick = (catalog, schema, table) => {
    setIsLoading(true);
    setSelectedCatalog(catalog);
    setSelectedSchema(schema);
    setSelectedTable(table);
    // Set view context based on injection status
    const tableId = `${schema.name}_${table.name}`;
    if (injectedTables.some(t => t.tableId === tableId || t.tableId === table.id)) {
      setViewContext('warehouse');
    } else {
      setViewContext('catalog');
    }
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleBackToDashboard = () => {
    setSelectedTable(null);
    setSelectedSchema(null);
    setSelectedCatalog(null);
    setViewContext('catalog');
  };

  const toggleFavorite = (tableId, e) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]
    );
  };

  const handleRunQuery = () => {
    if (!selectedCatalog || !selectedSchema || !selectedTable) return;
    const query = `SELECT * FROM ${selectedSchema.name}.${selectedTable.name};`;
    navigate('/sql-editor', { state: { prefillQuery: query } });
  };

  const handleRefresh = () => {
    if (!selectedTable) return;
    setIsLoading(true);
    // Mock refresh — data is already local
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleExportCSV = () => {
    if (!selectedTable || !selectedSchema) return;
    const csv = generateCSV(selectedTable.columns, selectedTable.sampleData);
    downloadAsFile(csv, `${selectedTable.name}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    if (!selectedTable || !selectedSchema) return;
    const json = generateJSON(selectedTable.sampleData);
    downloadAsFile(json, `${selectedTable.name}.json`, 'application/json');
  };

  const fetchTableStats = useCallback((schema, table) => {
    setIsLoadingStats(true);
    setTableStats(null);
    setIsStatsModalOpen(true);

    // Generate stats locally from the catalog data
    setTimeout(() => {
      // Find the table in catalogs
      let foundTable = null;
      for (const cat of catalogs) {
        for (const sch of (cat.schemas || [])) {
          if (sch.name === schema) {
            foundTable = sch.tables?.find(t => t.name === table);
            if (foundTable) break;
          }
        }
        if (foundTable) break;
      }

      if (foundTable && foundTable.sampleData) {
        const columns = foundTable.columns || [];
        const data = foundTable.sampleData;
        const columnStats = columns.map(col => {
          const values = data.map(row => row[col.name]).filter(v => v != null);
          const numericValues = values.map(Number).filter(v => !isNaN(v));
          return {
            column: col.name,
            type: col.type,
            non_null: values.length,
            null_count: data.length - values.length,
            distinct: new Set(values.map(String)).size,
            min: numericValues.length > 0 ? Math.min(...numericValues) : null,
            max: numericValues.length > 0 ? Math.max(...numericValues) : null,
            avg: numericValues.length > 0 ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2) : null,
          };
        });
        setTableStats({
          table_name: foundTable.name,
          row_count: foundTable.rowCount || data.length,
          column_count: columns.length,
          storage_size: foundTable.storageSize || 'N/A',
          columns: columnStats
        });
      }
      setIsLoadingStats(false);
    }, 500);
  }, [catalogs]);

  const handleSort = (colName) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== colName) return { key: colName, direction: 'asc' };
      if (prev.direction === 'asc') return { key: colName, direction: 'desc' };
      return null;
    });
  };

  const handleContextMenu = (e, type, name) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ type, name, x: e.clientX, y: e.clientY });
  };

  const handleCopyName = (name) => {
    navigator.clipboard.writeText(name).catch(() => {});
    setContextMenu(null);
  };

  const handleCopyPath = () => {
    if (!selectedCatalog || !selectedSchema || !selectedTable) return;
    const path = `${selectedCatalog.name}.${selectedSchema.name}.${selectedTable.name}`;
    navigator.clipboard.writeText(path).catch(() => {});
  };

  // ── Derived Data ──────────────────────────────────────────
  const processedData = useMemo(() => {
    if (!selectedTable || !selectedTable.sampleData) return [];
    let data = [...selectedTable.sampleData];
    if (dataSearchQuery) {
      const q = dataSearchQuery.toLowerCase();
      data = data.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }
    Object.entries(columnFilters).forEach(([col, val]) => {
      if (val) {
        const v = val.toLowerCase();
        data = data.filter(row => String(row[col] ?? '').toLowerCase().includes(v));
      }
    });
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? '';
        const bVal = b[sortConfig.key] ?? '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [selectedTable, dataSearchQuery, columnFilters, sortConfig]);

  // Paginated data
  const totalFilteredRows = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredRows / ROWS_PER_PAGE));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return processedData.slice(start, start + ROWS_PER_PAGE);
  }, [processedData, currentPage]);

  const visibleColumns = useMemo(() => {
    if (!selectedTable) return [];
    return selectedTable.columns.filter(c => !hiddenColumns.includes(c.name));
  }, [selectedTable, hiddenColumns]);

  const favoriteTables = useMemo(() => {
    const result = [];
    catalogs.forEach(cat => {
      cat.schemas?.forEach(sch => {
        sch.tables?.forEach(tbl => {
          if (favorites.includes(tbl.id)) {
            result.push({ catalog: cat, schema: sch, table: tbl });
          }
        });
      });
    });
    return result;
  }, [catalogs, favorites]);

  return {
    catalogs, recentActivity, stats, expandedItems, setExpandedItems, navigate,
    selectedCatalog, selectedSchema, selectedTable,
    viewMode, setViewMode, showMetadata, setShowMetadata,
    isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery,
    favorites, sortConfig, columnFilters, setColumnFilters,
    hiddenColumns, setHiddenColumns, showColumnPicker, setShowColumnPicker,
    showFilters, setShowFilters, rowLimit, setRowLimit,
    dataSearchQuery, setDataSearchQuery, isLoading, contextMenu, setContextMenu,
    searchCategory, setSearchCategory, recentActivityHistory,
    toggleExpansion, handleTableClick, handleBackToDashboard, toggleFavorite, handleRunQuery,
    handleRefresh, handleExportCSV, handleSort, handleContextMenu,
    handleCopyName, handleCopyPath, processedData, visibleColumns, favoriteTables,
    // Data Injection
    injectedTables, injectTable, removeInjectedTable, isTableInjected,
    // Layered Architecture
    viewContext, setViewContext, sidebarSection, setSidebarSection,
    // Pagination
    currentPage, setCurrentPage, totalPages, totalFilteredRows, paginatedData,
    // Export JSON & Stats
    handleExportJSON, fetchTableStats, tableStats, isStatsModalOpen, setIsStatsModalOpen, isLoadingStats,
  };
};
