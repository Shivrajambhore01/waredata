import React, { useState, useMemo } from 'react';
import CatalogSelector from '../components/Schema/CatalogSelector';
import SchemaGraph from '../components/Schema/SchemaGraph';
import SchemaDetailPanel from '../components/Schema/SchemaDetailPanel';
import { MOCK_SCHEMA } from '../mock/schemaMockData';

const MiniSchemaBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden select-none z-0 flex items-center justify-center">
    <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="100" width="160" height="90" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="350" y="200" width="160" height="120" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="650" y="80" width="160" height="100" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="800" y="350" width="140" height="110" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="250" y="400" width="180" height="110" rx="8" stroke="currentColor" strokeWidth="2" />
      
      <path d="M210 145 H280 V260 H350" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
      <path d="M510 260 H580 V130 H650" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
      <path d="M430 320 V360 H340 V400" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
      <path d="M430 450 H650 V400 H800" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
      
      <pattern id="dotPatternSmall" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.4" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#dotPatternSmall)" />
    </svg>
  </div>
);

const FeatureCard = ({ title, description, icon, delay }) => (
  <div 
    className="df-card p-4 flex flex-col items-center text-center gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in-up bg-white/60 dark:bg-[#1A1C21]/60 backdrop-blur-sm z-10 relative border border-[var(--df-border)]/50"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-10 h-10 bg-[var(--df-accent-soft)] rounded-xl flex items-center justify-center text-[var(--df-accent)] shadow-sm">
      {React.cloneElement(icon, { width: 18, height: 18 })}
    </div>
    <div className="space-y-1">
      <h3 className="text-[13px] font-bold text-[var(--df-strong)] leading-tight">{title}</h3>
      <p className="text-[11px] text-[var(--df-text-muted)] leading-snug">{description}</p>
    </div>
  </div>
);

const SuggestionChip = ({ text }) => (
  <button className="px-3 py-1.5 rounded-full bg-[var(--df-bg-secondary)] border border-[var(--df-border)] text-[11px] font-semibold text-[var(--df-text-soft)] hover:border-[var(--df-accent)] hover:text-[var(--df-accent)] hover:bg-[var(--df-accent-soft)] transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm z-10 relative">
    {text}
  </button>
);

const SchemaExplorerPage = () => {
  const [viewState, setViewState] = useState('selection'); // 'selection' or 'explorer'
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightDataFlow, setHighlightDataFlow] = useState(false);

  const filteredTables = useMemo(() => {
    return MOCK_SCHEMA.tables.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelection = (config) => {
    setSelectedConfig(config);
    setViewState('explorer');
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  if (viewState === 'selection') {
    return (
      <div className="h-full relative overflow-hidden bg-[var(--df-bg)] flex flex-col items-center justify-center p-4">
        <MiniSchemaBackground />
        
        {/* Main Content Wrapper - Controlled max height to avoid scroll */}
        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-5">
          
          {/* Header */}
          <div className="text-center animate-fade-in -mt-2">
            <h1 className="text-3xl font-black text-[var(--df-strong)] tracking-tight mb-1">Schema Preview</h1>
            <p className="text-[var(--df-text-soft)] text-sm">Select your data source to begin visualization.</p>
          </div>

          {/* Central Card */}
          <div className="w-full max-w-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CatalogSelector onSelect={handleSelection} />
          </div>

          {/* Insight Text */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-[var(--df-text-muted)] text-[11px] font-medium tracking-wide">
              No schema selected yet. Choose a catalog and database to explore table relationships, structure, and data flow.
            </p>
          </div>

          {/* Features Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in px-2" style={{ animationDelay: '300ms' }}>
            <FeatureCard 
              delay={400}
              title="Visualize Relationships"
              description="See how tables connect using primary and foreign keys."
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 19h6M18 8v11M14.5 5.5l-8.5 12" /></svg>}
            />
            <FeatureCard 
              delay={500}
              title="Understand Data Flow"
              description="Identify fact and dimension tables and their pipeline."
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>}
            />
            <FeatureCard 
              delay={600}
              title="Interactive Exploration"
              description="Drag, zoom, and explore schema visually."
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v8"/></svg>}
            />
          </div>

          {/* Suggested Exploration */}
          <div className="text-center animate-fade-in pt-1" style={{ animationDelay: '700ms' }}>
            <h4 className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-widest mb-2.5">Suggested Exploration</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <SuggestionChip text="Explore Orders Pipeline" />
              <SuggestionChip text="View Most Connected Tables" />
              <SuggestionChip text="Analyze Sales Schema" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--df-bg)] overflow-hidden">
      {/* Top Controls Bar - ULTRA DENSE (h-9) */}
      <div className="h-9 border-b border-[var(--df-border)] px-3 flex items-center justify-between bg-[var(--df-card-bg)] shadow-sm z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setViewState('selection'); setSelectedTable(null); }}
            className="p-1 hover:bg-[var(--df-bg-secondary)] rounded text-[var(--df-text-soft)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[var(--df-strong)] uppercase tracking-tight">
                {MOCK_SCHEMA.catalogs.find(c => c.id === selectedConfig.catalogId)?.name}
              </span>
              <span className="text-[var(--df-text-muted)] text-[10px]">/</span>
              <span className="text-[11px] font-medium text-[var(--df-text-soft)]">
                {selectedConfig.databaseId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--df-bg-secondary)] p-0.5 rounded-lg border border-[var(--df-border)]">
            <button
              onClick={() => setHighlightDataFlow(!highlightDataFlow)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${highlightDataFlow ? 'bg-[var(--df-accent)] text-white shadow-sm' : 'text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L2 22" /><path d="M2 2l20 20" /></svg>
              Highlight Flow
            </button>
          </div>
          <button className="df-btn df-btn-secondary !py-0.5 !px-2.5 !text-[10px]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Export Image
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Table Sidebar - ULTRA DENSE (w-48) */}
        <div className="w-48 border-r border-[var(--df-border)] bg-[var(--df-card-bg)] flex flex-col z-40">
          <div className="p-2 border-b border-[var(--df-border)] bg-[var(--df-bg-secondary)]">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--df-text-muted)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search tables..."
                className="df-input !pl-8 !py-1 !text-[11px] !rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto df-scrollbar p-1 space-y-0.5">
            {filteredTables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 group flex items-center justify-between ${selectedTable?.id === table.id ? 'bg-[var(--df-accent-soft)] border-l-2 border-[var(--df-accent)]' : 'hover:bg-[var(--df-bg-secondary)]'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${selectedTable?.id === table.id ? 'bg-[var(--df-accent)] text-white' : (table.type === 'FACT' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40')}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-[var(--df-strong)] truncate leading-tight">{table.name}</div>
                    <div className="text-[8px] text-[var(--df-text-muted)] font-black uppercase tracking-tighter">{table.type}</div>
                  </div>
                </div>
                {selectedTable?.id === table.id && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--df-accent)] shrink-0"><path d="m9 18 6-6-6-6" /></svg>
                )}
              </button>
            ))}
            {filteredTables.length === 0 && (
              <div className="p-4 text-center text-[var(--df-text-muted)] text-[10px]">No tables</div>
            )}
          </div>
        </div>

        {/* Center Graph Canvas */}
        <div className="flex-1 relative bg-[var(--df-bg-secondary)]">
          <SchemaGraph
            onTableClick={handleTableClick}
            highlightDataFlow={highlightDataFlow}
          />
        </div>
      </div>

      {/* Details Side Panel */}
      <SchemaDetailPanel
        table={selectedTable}
        isOpen={!!selectedTable}
        onClose={() => setSelectedTable(null)}
      />
    </div>
  );
};

export default SchemaExplorerPage;
