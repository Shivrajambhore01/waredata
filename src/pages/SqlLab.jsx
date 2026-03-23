import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { useQueryTabs } from '../hooks/useQueryTabs';
import QueryTabs from '../components/QueryTabs';
import SqlEditor from '../components/SqlEditor';
import ResultsPanel from '../components/ResultsPanel';
import SchemaBrowser from '../components/SchemaBrowser';
import { FiDatabase, FiCommand, FiSave, FiSidebar, FiShare2, FiMoreVertical, FiBook, FiChevronDown } from 'react-icons/fi';

const CatalogSelector = ({ catalogs, selectedContext, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--df-sidebar-hover)]"
        style={{ color: 'var(--df-text)', border: '1px solid transparent' }}
      >
        <FiBook size={14} style={{ color: 'var(--df-text-muted)' }} />
        <span className="text-[13px] font-bold">{selectedContext.catalog}</span>
        <span className="font-black" style={{ color: 'var(--df-text-muted)' }}>.</span>
        <FiDatabase size={14} style={{ color: 'var(--df-text-muted)' }} />
        <span className="text-[13px] font-bold">{selectedContext.schema}</span>
        <FiChevronDown size={14} style={{ color: 'var(--df-text-muted)' }} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-1 w-64 rounded-xl py-2 z-30 shadow-lg border" style={{ backgroundColor: 'var(--df-card-bg)', borderColor: 'var(--df-border)' }}>
            <div className="px-4 py-2 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--df-text-muted)' }}>Select Catalog . Schema</div>
            {catalogs && Object.entries(catalogs).map(([catName, schemas]) => (
               <div key={catName}>
                 <div className="px-4 py-1.5 text-xs font-bold" style={{ color: 'var(--df-text)' }}>{catName}</div>
                 {Object.keys(schemas).map(schName => (
                   <button 
                     key={schName} 
                     className="w-full text-left px-8 py-1.5 text-[13px] transition-colors hover:bg-[var(--df-sidebar-hover)]" 
                     style={{ color: 'var(--df-text-soft)' }}
                     onClick={() => { onSelect({ catalog: catName, schema: schName }); setIsOpen(false); }}
                   >
                     {schName}
                   </button>
                 ))}
               </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SqlLab = () => {
  const { tabs, activeTabId, setActiveTabId, addTab, removeTab, updateTabContent, updateTabResults } = useQueryTabs();
  const { executeQuery, saveQuery, sharedQuery, setSharedQuery, catalogs } = useData();
  const [saveMsg, setSaveMsg] = useState('');
  
  const defaultCat = catalogs && Object.keys(catalogs)[0] ? Object.keys(catalogs)[0] : 'workspace';
  const defaultSch = catalogs && Object.keys(catalogs)[0] ? Object.keys(catalogs[defaultCat])[0] : 'default';
  const [selectedContext, setSelectedContext] = useState({ catalog: defaultCat, schema: defaultSch });

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editorHeightPercent, setEditorHeightPercent] = useState(50);
  const [isAutoHeight, setIsAutoHeight] = useState(true);
  const [isResizingV, setIsResizingV] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingV) return;
      setIsAutoHeight(false);
      const container = document.getElementById('editor-results-container');
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;
      const newPercent = (relativeY / containerRect.height) * 100;
      if (newPercent > 15 && newPercent < 85) setEditorHeightPercent(newPercent);
    };
    const handleMouseUp = () => setIsResizingV(false);
    if (isResizingV) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [isResizingV]);

  useEffect(() => {
    if (sharedQuery && activeTabId) { updateTabContent(activeTabId, sharedQuery); setSharedQuery(null); }
  }, [sharedQuery, activeTabId, updateTabContent, setSharedQuery]);

  const runQueryOnTab = async (tabId, sqlContent) => {
    if (!sqlContent) return;
    updateTabResults(tabId, { results: null, status: 'running', executionTime: null });
    const start = performance.now();
    try {
      // Simulate network wait for Databricks feel
      await new Promise(r => setTimeout(r, 600)); 
      const result = await executeQuery(sqlContent);
      const end = performance.now();
      const timeSec = ((end - start) / 1000).toFixed(2) + 's';
      
      if (result.error) {
        updateTabResults(tabId, { results: result, status: 'error', executionTime: timeSec });
      } else {
        updateTabResults(tabId, { results: result, status: 'success', executionTime: timeSec });
      }
    } catch (e) {
      updateTabResults(tabId, { results: { error: e.message }, status: 'error', executionTime: '0.00s' });
    }
  };

  const handleExecute = () => { if (activeTab?.content) runQueryOnTab(activeTabId, activeTab.content); };
  const handleExecuteAll = handleExecute;

  const handleTablePreview = async (tableName) => {
    const sql = `SELECT * \nFROM ${tableName}\nLIMIT 10`;
    const newId = addTab(sql); 
    if (newId) {
      runQueryOnTab(newId, sql);
    }
  };

  const handleSave = () => {
    if (!activeTab?.content) return;
    const name = prompt('Query name:', activeTab.name) || activeTab.name;
    saveQuery(name, activeTab.content);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handleFormat = () => {
    if (!activeTab?.content) return;
    const keywords = ['select', 'from', 'where', 'group by', 'order by', 'limit', 'inner join', 'left join', 'on', 'and', 'or', 'as', 'count', 'sum', 'distinct', 'having'];
    let formatted = activeTab.content;
    keywords.forEach(kw => { formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw.toUpperCase()); });
    updateTabContent(activeTabId, formatted);
  };

  return (
    <div className={`flex flex-col h-full ${isResizingV ? 'cursor-row-resize select-none' : ''}`} style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-bg-secondary)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-1.5 z-10" style={{ borderBottom: '1px solid var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-xl transition-all"
            style={{
              backgroundColor: isSidebarOpen ? 'var(--df-accent-soft)' : 'transparent',
              color: isSidebarOpen ? 'var(--df-accent)' : 'var(--df-text-soft)',
            }}
          >
            <FiSidebar size={18} />
          </button>
          
          <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--df-border)' }}></div>
          
          <CatalogSelector 
            catalogs={catalogs} 
            selectedContext={selectedContext} 
            onSelect={setSelectedContext} 
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleFormat} className="df-btn df-btn-ghost text-xs"><FiCommand size={14} /> Format</button>
          <button onClick={() => {}} className="df-btn df-btn-ghost text-xs" style={{ color: 'var(--df-info)' }}><FiShare2 size={14} /> Share</button>
          <button onClick={handleSave} className="df-btn df-btn-ghost text-xs" style={{ color: 'var(--df-accent)' }}><FiSave size={14} /> Save*</button>
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-1.5 rounded-xl transition-all"
              style={{ backgroundColor: isMoreMenuOpen ? 'var(--df-accent-soft)' : 'transparent', color: isMoreMenuOpen ? 'var(--df-accent)' : 'var(--df-text-soft)' }}
            >
              <FiMoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div
          style={{ width: isSidebarOpen ? 260 : 0, borderRight: isSidebarOpen ? '1px solid var(--df-border)' : 'none', backgroundColor: 'var(--df-card-bg)' }}
          className="transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden"
        >
          <div style={{ width: 260, height: '100%' }}><SchemaBrowser onTablePreview={handleTablePreview} /></div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
          <div className="px-4" style={{ backgroundColor: 'var(--df-surface)', borderBottom: '1px solid var(--df-border)' }}>
            <QueryTabs tabs={tabs} activeTabId={activeTabId} onTabChange={setActiveTabId} onTabAdd={() => addTab()} onTabClose={removeTab} />
          </div>

          <div id="editor-results-container" className="flex-1 flex flex-col pt-4 px-4 gap-0 overflow-hidden" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
            <div className="flex flex-col h-full overflow-hidden">
              <div style={{ height: activeTab ? `${editorHeightPercent}%` : '50%' }} className="min-h-[150px] flex flex-col transition-all duration-300">
                {activeTab ? (
                  <SqlEditor value={activeTab.content} onChange={(v) => updateTabContent(activeTab.id, v)} onExecute={handleExecute} onExecuteAll={handleExecuteAll} onFormat={handleFormat} onSave={handleSave} saveMsg={saveMsg} />
                ) : (
                  <div className="flex-1 df-card flex flex-col items-center justify-center relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110" style={{ background: 'var(--df-accent-soft)' }}></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 transition-transform duration-700 group-hover:scale-110" style={{ background: 'var(--df-accent-soft)' }}></div>
                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                      <div className="df-empty-state-icon" style={{ marginBottom: '16px' }}><FiDatabase size={28} /></div>
                      <h3 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'var(--df-strong)' }}>Ready to query?</h3>
                      <p className="text-sm mb-6 max-w-[240px]" style={{ color: 'var(--df-text-soft)' }}>Create a new SQL workspace to start exploring your data.</p>
                      <button onClick={() => addTab()} className="df-btn df-btn-primary text-sm">+ New Query</button>
                    </div>
                  </div>
                )}
              </div>

              <div
                onMouseDown={() => activeTab && setIsResizingV(true)}
                className={`h-4 ${activeTab ? 'cursor-row-resize' : 'cursor-default'} flex items-center justify-center group relative z-20 transition-all duration-300 rounded-full`}
              >
                <div className={`w-12 h-1 rounded-full transition-colors ${!activeTab ? 'opacity-50' : 'group-hover:bg-[var(--df-accent)]'}`} style={{ backgroundColor: 'var(--df-border)' }}></div>
              </div>

              <div className="flex-1 df-card overflow-hidden min-h-[150px] transition-all duration-300 shadow-sm border" style={{ borderColor: 'var(--df-border)' }}>
                {activeTab ? <ResultsPanel activeTab={activeTab} /> : (
                  <div className="h-full flex flex-col items-center justify-center text-sm space-y-2 opacity-60" style={{ backgroundColor: 'var(--df-surface)', color: 'var(--df-text-muted)' }}>
                    <FiCommand size={24} />
                    <span className="font-semibold tracking-wide uppercase text-[10px]">Results Terminal</span>
                    <span className="text-xs">No active operation</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlLab;