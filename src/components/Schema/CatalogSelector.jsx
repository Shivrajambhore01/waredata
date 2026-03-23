import React, { useState } from 'react';
import { MOCK_SCHEMA } from '../../mock/schemaMockData';

const CatalogSelector = ({ onSelect }) => {
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    if (!selectedCatalog || !selectedDatabase) return;
    setLoading(true);
    // Simulate loading for smooth transition
    setTimeout(() => {
      onSelect({ catalogId: selectedCatalog, databaseId: selectedDatabase });
      setLoading(false);
    }, 1200);
  };

  const databases = selectedCatalog ? MOCK_SCHEMA.databases[selectedCatalog] || [] : [];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto df-page-enter">
      <div className="df-card p-6 w-full space-y-6 text-center border-dashed border-2">
        <div className="space-y-2">
          <div className="w-14 h-14 bg-[var(--df-accent-soft)] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[var(--df-accent)] shadow-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--df-strong)]">Explore Your Schema</h2>
          <p className="text-[var(--df-text-soft)] text-[11px] max-w-[300px] mx-auto">Select a catalog and database to visualize table relationships and data flow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <label className="df-label">Select Catalog</label>
            <div className="relative">
              <select
                className="df-select pr-10"
                value={selectedCatalog}
                onChange={(e) => {
                  setSelectedCatalog(e.target.value);
                  setSelectedDatabase('');
                }}
              >
                <option value="" disabled>Choose a catalog...</option>
                {MOCK_SCHEMA.catalogs.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--df-text-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="df-label">Select Database</label>
            <div className="relative">
              <select
                className="df-select pr-10"
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                disabled={!selectedCatalog}
              >
                <option value="" disabled>Choose a database...</option>
                {databases.map(db => (
                  <option key={db.id} value={db.id}>{db.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--df-text-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`df-btn df-btn-primary w-full h-11 text-sm font-bold shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_-4px_var(--df-accent)] active:scale-95 ${loading ? 'opacity-80' : ''}`}
          onClick={handleLoad}
          disabled={!selectedCatalog || !selectedDatabase || loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Metadata...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Visualize Schema
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CatalogSelector;
