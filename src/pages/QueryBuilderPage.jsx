import React, { useState, useCallback, useEffect } from 'react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { FiLayout, FiMaximize, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import QuerySidebar from '../components/QueryBuilder/QuerySidebar';
import QueryCanvas from '../components/QueryBuilder/QueryCanvas';
import QueryRightPanel from '../components/QueryBuilder/QueryRightPanel';
import QueryBottomPanel from '../components/QueryBuilder/QueryBottomPanel';
import SchemaGraph from '../components/Schema/SchemaGraph';
import { useData } from '../context/DataContext';

const QueryBuilderPage = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  
  const [schemaPreviewMode, setSchemaPreviewMode] = useState(false);
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState(null);
  const [activeBottomTab, setActiveBottomTab] = useState('sql');
  
  // AI Guidance Toast System
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    // Auto hide after 4 seconds
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const { executeQuery } = useData();

  const handleNodeClick = (node) => {
    setSelectedEdgeId(null);
    setSelectedNodeId(node.id);
  };

  const handleEdgeClick = (edge) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(edge.id);
  };

  const updateNodeData = (id, newData) => {
    setNodes(nds => nds.map(n => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, ...newData } };
      }
      return n;
    }));
  };

  const updateEdgeData = (id, newData) => {
    setEdges(eds => eds.map(e => {
      if (e.id === id) {
        return { ...e, data: { ...e.data, ...newData } };
      }
      return e;
    }));
  };

  const handleDeleteNode = useCallback((id) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
    showToast('Node removed from pipeline.', 'info');
  }, [showToast]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const activeNode = nodes.find(n => n.id === selectedNodeId);
  const activeEdge = edges.find(e => e.id === selectedEdgeId);

  const generatedSQL = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return "-- Drag tables onto the canvas to begin";
    
    const targetNodeIds = new Set(edges.map(e => e.target));
    let baseNode = nodes.find(n => !targetNodeIds.has(n.id));
    if (!baseNode) baseNode = nodes[0];

    let selectedCols = [];
    nodes.filter(n => n.type === 'queryTableNode').forEach(n => {
      const cols = n.data.selectedColumns || ['*'];
      if (cols.includes('*')) {
        selectedCols.push(`${n.data.name}.*`);
      } else {
        cols.forEach(c => selectedCols.push(`${n.data.name}.${c}`));
      }
    });
    
    const sorts = nodes.filter(n => n.type === 'sortNode' && n.data.condition);
    const limit = 100;

    if (nodes.length === 1 && selectedCols.length === 1 && selectedCols[0].endsWith('.*')) {
      selectedCols = ['*'];
    }

    const aggregates = nodes.filter(n => n.type === 'aggregateNode' && n.data.condition);
    if (aggregates.length > 0) {
      aggregates.forEach(a => {
        selectedCols.push(a.data.condition);
      });
    }

    let sql = `SELECT \n  ${selectedCols.join(',\n  ')}\nFROM ${baseNode.data.name}`;

    const joinedNodes = new Set([baseNode.id]);
    let edgesToProcess = [...edges];
    let keepProcessing = true;
    
    while(keepProcessing && edgesToProcess.length > 0) {
      keepProcessing = false;
      for (let i = edgesToProcess.length - 1; i >= 0; i--) {
        const edge = edgesToProcess[i];
        if (joinedNodes.has(edge.source)) {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode && !joinedNodes.has(targetNode.id)) {
            if (targetNode.type === 'queryTableNode') {
              const joinType = edge.data?.joinType || 'LEFT';
              const formattedJoinType = joinType.includes('JOIN') ? joinType : `${joinType} JOIN`;
              const sourceTable = nodes.find(n => n.id === edge.source && n.type === 'queryTableNode') || baseNode;
              const defaultCond = `${sourceTable.data.name}.id = ${targetNode.data.name}.${sourceTable.data.name.replace(/s$/, '')}_id`;
              const condition = edge.data?.condition || defaultCond;
              sql += `\n${formattedJoinType} ${targetNode.data.name} \n  ON ${condition}`;
            }
            joinedNodes.add(targetNode.id);
            edgesToProcess.splice(i, 1);
            keepProcessing = true;
          }
        }
      }
    }

    const filters = nodes.filter(n => n.type === 'filterNode' && n.data.condition);
    if (filters.length > 0) {
      sql += `\nWHERE ${filters.map(f => `(${f.data.condition})`).join('\n  AND ')}`;
    }

    if (aggregates.length > 0) {
      const groupByCols = selectedCols.filter(c => !c.includes('(') && !c.endsWith('.*') && c !== '*');
      if (groupByCols.length > 0) {
        sql += `\nGROUP BY ${groupByCols.join(', ')}`;
      }
    }

    if (sorts.length > 0) {
      sql += `\nORDER BY ${sorts.map(s => s.data.condition).join(', ')}`;
    }

    sql += `\nLIMIT ${limit};`;
    return sql;
  }, [nodes, edges]);

  const queryExplanation = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return "Add tables to see an explanation.";
    const targetNodeIds = new Set(edges.map(e => e.target));
    let baseNode = nodes.find(n => !targetNodeIds.has(n.id)) || nodes[0];
    let parts = [`Starting with the ${baseNode.data.name} table.`];
    
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target) {
        parts.push(`Performing a ${edge.data?.joinType || 'LEFT'} JOIN with ${target.data.name} using the link: ${edge.data?.condition || 'default relationship'}.`);
      }
    });
    
    const filters = nodes.filter(n => n.type === 'filterNode' && n.data.condition);
    if (filters.length > 0) {
      parts.push(`Filtering the data where: ${filters.map(f => f.data.condition).join(' AND ')}.`);
    }
    
    const aggregates = nodes.filter(n => n.type === 'aggregateNode' && n.data.condition);
    if (aggregates.length > 0) {
      parts.push(`Calculating the following metrics: ${aggregates.map(a => a.data.condition).join(', ')}.`);
      const groupByCols = nodes.flatMap(n => n.data.selectedColumns || []).filter(c => c !== '*');
      if (groupByCols.length > 0) {
        parts.push(`Resulting data will be grouped by: ${groupByCols.join(', ')}.`);
      }
    }
    
    const sorts = nodes.filter(n => n.type === 'sortNode' && n.data.condition);
    if (sorts.length > 0) {
      parts.push(`Sorting results by: ${sorts.map(s => s.data.condition).join(', ')}.`);
    }
    
    parts.push(`Returning the top 100 rows.`);
    return parts.join(' ');
  }, [nodes, edges]);

  const handleRun = async () => {
    // Pipeline Execution Guards
    if (nodes.length === 0) {
      showToast('Pipeline is empty. Drag a table to start.', 'error');
      return;
    }

    if (nodes.length > 1) {
      const allNodeIds = new Set(nodes.map(n => n.id));
      const connectedNodeIds = new Set();
      edges.forEach(e => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });

      const isolatedNodes = [...allNodeIds].filter(id => !connectedNodeIds.has(id));
      if (isolatedNodes.length > 0) {
        showToast('Pipeline incomplete. Connect all tables and transformations.', 'error');
        return;
      }
    }

    setIsExecuting(true);
    setActiveBottomTab('results');
    
    try {
      const res = await executeQuery(generatedSQL);
      setResults(res);
      showToast('Pipeline executed successfully.', 'success');
    } catch (e) {
       console.error(e);
       showToast('Execution failed.', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--df-bg)] overflow-hidden font-sans">
      {/* Top Professional Toolbar */}
      <div className="h-12 border-b border-[var(--df-border)] bg-[var(--df-card-bg)] flex items-center justify-between px-4 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[var(--df-accent-soft)] text-[var(--df-accent)] text-[10px] font-bold tracking-widest uppercase">Visual Query</span>
            <span className="text-[14px] font-bold text-[var(--df-strong)]">Untitled_Pipeline_1</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[var(--df-bg-secondary)] p-1 rounded-lg border border-[var(--df-border)]">
          <button 
            onClick={() => setSchemaPreviewMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${!schemaPreviewMode ? 'bg-[var(--df-accent)] text-white shadow-sm' : 'text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
          >
            <FiLayout size={12} />
            PIPELINE BUILDER
          </button>
          <button 
            onClick={() => setSchemaPreviewMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${schemaPreviewMode ? 'bg-[var(--df-accent)] text-white shadow-sm' : 'text-[var(--df-text-muted)] hover:text-[var(--df-text-soft)]'}`}
          >
            <FiMaximize size={12} />
            SCHEMA PREVIEW
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {schemaPreviewMode ? (
          <div className="w-full h-full bg-[var(--df-bg-secondary)] relative">
            <div className="absolute top-4 left-4 z-10 bg-[var(--df-card-bg)]/80 backdrop-blur border border-[var(--df-accent)]/30 p-3 rounded-xl shadow-lg max-w-sm">
               <h3 className="text-sm font-bold text-[var(--df-accent)] mb-1">Schema Preview Mode</h3>
               <p className="text-[11px] text-[var(--df-text-soft)] leading-relaxed">
                 Explore the full entity-relationship diagram below. Click tables to see columns. Use this to understand relationships before returning to the Pipeline Builder.
               </p>
            </div>
            <SchemaGraph 
              onTableClick={() => {}} 
              highlightDataFlow={true} 
            />
          </div>
        ) : (
          <>
            {/* Left Sidebar */}
            <QuerySidebar 
              selectedCatalog={selectedCatalog} 
              setSelectedCatalog={setSelectedCatalog}
              selectedDatabase={selectedDatabase}
              setSelectedDatabase={setSelectedDatabase}
            />

            {/* Center Canvas & Bottom Panel */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--df-bg-secondary)] relative z-0">
              {/* Intelligent Toast Notification Overlay */}
              {toast && (
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-xl border ${
                  toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' :
                  toast.type === 'error' ? 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
                  'bg-blue-50 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                }`}>
                  {toast.type === 'success' && <FiCheckCircle size={16} />}
                  {toast.type === 'error' && <FiAlertCircle size={16} />}
                  {toast.type === 'info' && <FiInfo size={16} />}
                  <span className="text-xs font-bold font-sans tracking-wide">{toast.message}</span>
                </div>
              )}

              <div className="flex-1 relative">
                <QueryCanvas 
                  nodesExt={nodes}
                  edgesExt={edges}
                  setNodesExt={setNodes}
                  setEdgesExt={setEdges}
                  onNodeClick={handleNodeClick}
                  onEdgeClick={handleEdgeClick}
                  onNodesChangeExt={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onShowToast={showToast}
                />
              </div>

              {/* Bottom Panel (Fixed height) */}
              <div className="h-[30vh] shrink-0 transition-all z-20">
                <QueryBottomPanel 
                  nodes={nodes}
                  edges={edges}
                  isExecuting={isExecuting}
                  onRun={handleRun}
                  results={results}
                  activeTab={activeBottomTab}
                  setActiveTab={setActiveBottomTab}
                  onShowToast={showToast}
                  generatedSQL={generatedSQL}
                  queryExplanation={queryExplanation}
                />
              </div>
            </div>

            {/* Right Properties Panel */}
            {(selectedNodeId && activeNode) || (selectedEdgeId && activeEdge) ? (
              <QueryRightPanel 
                selectedNode={activeNode}
                selectedEdge={activeEdge}
                availableNodes={nodes.filter(n => n.type === 'queryTableNode')}
                updateNodeData={updateNodeData}
                updateEdgeData={updateEdgeData}
                onClose={() => {
                  setSelectedNodeId(null);
                  setSelectedEdgeId(null);
                }}
                onDeleteNode={handleDeleteNode}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default QueryBuilderPage;
