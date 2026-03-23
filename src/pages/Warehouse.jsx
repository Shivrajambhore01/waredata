import React from 'react';
import { FiDatabase, FiLoader, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { useWarehouseLogic } from '../hooks/useWarehouseLogic';

import Sidebar from '../components/Warehouse/Sidebar';
import Dashboard from '../components/Warehouse/Dashboard';
import TableHeader from '../components/Warehouse/TableHeader';
import TableInfo from '../components/Warehouse/TableInfo';
import TableControls from '../components/Warehouse/TableControls';
import TableDataGrid from '../components/Warehouse/TableDataGrid';
import InjectPreview from '../components/Warehouse/InjectPreview';
import ComputeStatusBar from '../components/Warehouse/ComputeStatusBar';
import TableActionsMenu from '../components/Warehouse/TableActionsMenu';
import StatsModal from '../components/Warehouse/StatsModal';

const Warehouse = () => {
  const {
    catalogs, recentActivity, stats, expandedItems, navigate,
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
    handleExportJSON, fetchTableStats, tableStats, isStatsModalOpen, setIsStatsModalOpen, isLoadingStats
  } = useWarehouseLogic();

  const tableIsInjected = selectedTable ? isTableInjected(selectedTable.id) : false;

  return (
    <div className="flex h-full animate-fadeIn relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-bg-secondary)', color: 'var(--df-text)' }}>
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        favoriteTables={favoriteTables}
        handleTableClick={handleTableClick}
        catalogs={catalogs}
        selectedTable={selectedTable}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        injectedTables={injectedTables}
        handleBackToDashboard={handleBackToDashboard}
        removeInjectedTable={removeInjectedTable}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--df-bg)' }}>
        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-card-bg)' }}>
          <div className="flex-1">
            <ComputeStatusBar />
          </div>
          {selectedTable && tableIsInjected && (
            <div className="pr-4 border-b h-full flex items-center" style={{ borderBottom: '1px solid var(--df-border)' }}>
              <TableActionsMenu
                selectedSchema={selectedSchema}
                selectedTable={selectedTable}
                handleRunQuery={handleRunQuery}
                handleExportCSV={handleExportCSV}
                removeInjectedTable={removeInjectedTable}
                navigate={navigate}
                fetchTableStats={fetchTableStats}
              />
            </div>
          )}
        </div>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-1 rounded-r-md shadow-sm transition-all"
            style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', borderLeft: 'none', color: 'var(--df-text-muted)' }}
            title="Open Sidebar"
          >
            <FiChevronRight size={18} />
          </button>
        )}

        {!selectedTable ? (
          <Dashboard 
            stats={stats}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            navigate={navigate}
            recentActivity={recentActivity}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            recentActivityHistory={recentActivityHistory}
            favorites={favorites}
            favoriteTables={favoriteTables}
            handleTableClick={handleTableClick}
            toggleFavorite={toggleFavorite}
            handleRunQuery={handleRunQuery}
            injectedTables={injectedTables}
            catalogs={catalogs}
          />
        ) : !tableIsInjected ? (
          /* ── Inject Preview — table from Catalog, NOT yet injected ── */
          <InjectPreview
            selectedCatalog={selectedCatalog}
            selectedSchema={selectedSchema}
            selectedTable={selectedTable}
            injectTable={injectTable}
            handleBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <>
            <TableHeader 
              selectedCatalog={selectedCatalog}
              selectedSchema={selectedSchema}
              selectedTable={selectedTable}
              viewMode={viewMode}
              setViewMode={setViewMode}
              handleRunQuery={handleRunQuery}
              handleRefresh={handleRefresh}
              handleExportCSV={handleExportCSV}
              isLoading={isLoading}
            />

            <div className="flex-1 overflow-auto p-6 space-y-6 custom-scrollbar df-scrollbar relative" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
              {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ backgroundColor: 'var(--df-bg)', opacity: 0.7 }}>
                  <div className="flex items-center gap-3" style={{ color: 'var(--df-accent)' }}>
                    <FiLoader size={24} className="animate-spin" />
                    <span className="text-sm font-medium">Loading data...</span>
                  </div>
                </div>
              )}

              <TableInfo 
                selectedTable={selectedTable}
                selectedSchema={selectedSchema}
                selectedCatalog={selectedCatalog}
                showMetadata={showMetadata}
                setShowMetadata={setShowMetadata}
                handleCopyPath={handleCopyPath}
              />

              {viewMode === 'data' && (
                <TableControls 
                  rowLimit={rowLimit}
                  setRowLimit={setRowLimit}
                  showColumnPicker={showColumnPicker}
                  setShowColumnPicker={setShowColumnPicker}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  handleRefresh={handleRefresh}
                  dataSearchQuery={dataSearchQuery}
                  setDataSearchQuery={setDataSearchQuery}
                  handleExportJSON={handleExportJSON}
                />
              )}

              <TableDataGrid 
                viewMode={viewMode}
                selectedTable={selectedTable}
                showColumnPicker={showColumnPicker}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                visibleColumns={visibleColumns}
                handleSort={handleSort}
                sortConfig={sortConfig}
                showFilters={showFilters}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                processedData={processedData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalFilteredRows={totalFilteredRows}
                paginatedData={paginatedData}
              />
            </div>
          </>
        )}

        {contextMenu && (
          <div 
            className="fixed z-50 rounded-lg py-1 w-44 animate-fadeIn"
            style={{ top: contextMenu.y, left: contextMenu.x, backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}
          >
            <button
              onClick={() => handleCopyName(contextMenu.name)}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--df-text-soft)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
            >
              Copy {contextMenu.type === 'schema' ? 'Schema' : 'Table'} Name
            </button>
            <button
              onClick={() => { setContextMenu(null); navigate('/sql-editor', { state: { prefillQuery: 'CREATE TABLE schema_name.table_name (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  created_at TIMESTAMP DEFAULT NOW()\n);' } }); }} 
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--df-text-soft)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
            >
              Create Table
            </button>
            <div style={{ height: '1px', backgroundColor: 'var(--df-border)', margin: '4px 8px' }} />
            <button
              onClick={() => setContextMenu(null)}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--df-danger)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-danger-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Close Menu
            </button>
          </div>
        )}

        <StatsModal 
          isOpen={isStatsModalOpen} 
          onClose={() => setIsStatsModalOpen(false)} 
          stats={tableStats} 
          isLoading={isLoadingStats}
          tableName={selectedTable?.name}
        />
      </div>
    </div>
  );
};

export default Warehouse;
