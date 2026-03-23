import React from 'react';
import { FiX, FiCheckSquare, FiSquare, FiTrash2, FiDatabase, FiFilter, FiActivity, FiLink, FiPlus, FiList } from 'react-icons/fi';

const JoinBuilder = ({ edge, availableNodes, updateEdgeData }) => {
  const data = edge.data || { joinType: 'LEFT', condition: '' };
  
  const handleTypeChange = (joinType) => updateEdgeData(edge.id, { joinType });
  const handleCondChange = (condition) => updateEdgeData(edge.id, { condition });
  
  const sourceNode = availableNodes.find(n => n.id === edge.source);
  const targetNode = availableNodes.find(n => n.id === edge.target);
  
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Join Type</label>
        <select className="df-input text-xs py-1.5" value={data.joinType} onChange={e => handleTypeChange(e.target.value)}>
          <option value="INNER">INNER JOIN</option>
          <option value="LEFT">LEFT JOIN</option>
          <option value="RIGHT">RIGHT JOIN</option>
          <option value="FULL OUTER">FULL OUTER JOIN</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">ON Condition</label>
        <textarea
          className="df-input w-full min-h-[80px] text-[11px] font-mono p-2 resize-none"
          placeholder={`${sourceNode?.data.name}.id = ${targetNode?.data.name}.fk_id`}
          value={data.condition}
          onChange={e => handleCondChange(e.target.value)}
        />
        <p className="text-[9px] text-[var(--df-text-muted)] mt-1 leading-relaxed">
          Define the primary key and foreign key relationship manually between <span className="font-mono text-[var(--df-accent)]">{sourceNode?.data.name || 'Source'}</span> and <span className="font-mono text-[var(--df-accent)]">{targetNode?.data.name || 'Target'}</span>.
        </p>
      </div>
    </div>
  );
};

const FilterBuilder = ({ node, availableNodes, updateNodeData }) => {
  const state = node.data.filterState || { 
    conditions: [{ id: Date.now(), logic: '', tableId: '', column: '', operator: '=', value: '' }] 
  };

  const updateConditions = (newConditions) => {
    let condArray = [];
    newConditions.forEach((c, index) => {
      if (c.tableId && c.column && c.value) {
        const tableNode = availableNodes.find(n => n.id === c.tableId);
        const tableName = tableNode ? tableNode.data.name : '';
        const isString = isNaN(c.value) && !['true','false'].includes(c.value.toLowerCase());
        const formattedVal = isString ? `'${c.value}'` : c.value;
        const logicStr = (index > 0 && c.logic) ? ` ${c.logic} ` : '';
        condArray.push(`${logicStr}${tableName}.${c.column} ${c.operator} ${formattedVal}`);
      }
    });
    
    const cond = condArray.join('');
    updateNodeData(node.id, { filterState: { conditions: newConditions }, condition: cond });
  };

  const handleChange = (id, key, val) => {
    const nextConds = state.conditions.map(c => {
      if (c.id === id) {
        const updated = { ...c, [key]: val };
        if (key === 'tableId') updated.column = '';
        return updated;
      }
      return c;
    });
    updateConditions(nextConds);
  };

  const addCondition = () => {
    updateConditions([...state.conditions, { id: Date.now(), logic: 'AND', tableId: '', column: '', operator: '=', value: '' }]);
  };

  const removeCondition = (id) => {
    if (state.conditions.length === 1) return;
    const nextConds = state.conditions.filter(c => c.id !== id);
    if (nextConds.length > 0) nextConds[0].logic = '';
    updateConditions(nextConds);
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="space-y-4">
        {state.conditions.map((c, idx) => {
          const selectedTableNode = availableNodes.find(n => n.id === c.tableId);
          return (
            <div key={c.id} className="p-3 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded relative group animate-fade-in-up">
              {idx > 0 && (
                <div className="absolute -top-3 left-3 bg-[var(--df-card-bg)] border border-[var(--df-border)] rounded py-0.5 px-2 z-10">
                  <select className="bg-transparent text-[9px] font-black outline-none text-[var(--df-accent)] cursor-pointer" value={c.logic} onChange={e => handleChange(c.id, 'logic', e.target.value)}>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
              {state.conditions.length > 1 && (
                <button onClick={() => removeCondition(c.id)} className="absolute -top-2 -right-2 text-[var(--df-text-muted)] hover:text-red-500 bg-[var(--df-card-bg)] border border-[var(--df-border)] rounded-full p-0.5 transition-colors opacity-0 group-hover:opacity-100 shadow-sm z-10" title="Remove Rule">
                  <FiX size={12} />
                </button>
              )}
              
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Source Table</label>
                  <select className="df-input text-xs py-1.5" value={c.tableId} onChange={e => handleChange(c.id, 'tableId', e.target.value)}>
                    <option value="">-- Select Table --</option>
                    {availableNodes.map(n => <option key={n.id} value={n.id}>{n.data.name}</option>)}
                  </select>
                </div>
                
                {c.tableId && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Column</label>
                    <select className="df-input text-xs py-1.5" value={c.column} onChange={e => handleChange(c.id, 'column', e.target.value)}>
                      <option value="">-- Select Column --</option>
                      {selectedTableNode?.data.columns?.map(col => <option key={col.name} value={col.name}>{col.name} ({col.type})</option>)}
                    </select>
                  </div>
                )}

                {c.column && (
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-1/3">
                      <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Op</label>
                      <select className="df-input text-xs py-1.5 px-1" value={c.operator} onChange={e => handleChange(c.id, 'operator', e.target.value)}>
                        <option value="=">=</option>
                        <option value="!=">!=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                        <option value="LIKE">LIKE</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Value</label>
                      <input type="text" className="df-input text-xs py-1.5" placeholder="Value" value={c.value} onChange={e => handleChange(c.id, 'value', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addCondition} className="flex items-center justify-center gap-1.5 w-full py-2 border border-dashed border-[var(--df-border)] rounded text-[10px] font-bold text-[var(--df-text-muted)] hover:text-[var(--df-text)] hover:bg-[var(--df-bg-secondary)] transition-colors mt-2">
        <FiPlus size={12} /> ADD RULE
      </button>

      <div className="p-2 mt-2 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded text-[10px] font-mono whitespace-pre-wrap text-[var(--df-text-soft)]">
        <span className="text-[var(--df-text-muted)] select-none block mb-1">Preview: </span>
        {node.data.condition || <span className="italic opacity-50">Incomplete logic...</span>}
      </div>
    </div>
  );
};

const AggregateBuilder = ({ node, availableNodes, updateNodeData }) => {
  const state = node.data.aggState || { 
    metrics: [{ id: Date.now(), tableId: '', column: '', func: 'COUNT' }]
  };

  const updateMetrics = (newMetrics) => {
    let condArray = [];
    newMetrics.forEach(m => {
      if (m.tableId && m.column) {
        const tableNode = availableNodes.find(n => n.id === m.tableId);
        const tableName = tableNode ? tableNode.data.name : '';
        const safeCol = m.column === '*' ? '*' : `${tableName}.${m.column}`;
        condArray.push(`${m.func}(${safeCol}) AS ${m.func.toLowerCase()}_metric_${m.id.toString().slice(-4)}`);
      }
    });
    
    const cond = condArray.join(', ');
    updateNodeData(node.id, { aggState: { metrics: newMetrics }, condition: cond });
  };

  const handleChange = (id, key, val) => {
    const nextMetrics = state.metrics.map(m => {
      if (m.id === id) {
        const updated = { ...m, [key]: val };
        if (key === 'tableId') updated.column = '';
        return updated;
      }
      return m;
    });
    updateMetrics(nextMetrics);
  };

  const addMetric = () => {
    updateMetrics([...state.metrics, { id: Date.now(), tableId: '', column: '', func: 'COUNT' }]);
  };

  const removeMetric = (id) => {
    if (state.metrics.length === 1) return;
    const nextMetrics = state.metrics.filter(m => m.id !== id);
    updateMetrics(nextMetrics);
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="space-y-4">
        {state.metrics.map((m, idx) => {
          const selectedTableNode = availableNodes.find(n => n.id === m.tableId);
          return (
            <div key={m.id} className="p-3 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded relative group animate-fade-in-up">
              <div className="absolute -top-3 left-3 bg-[var(--df-card-bg)] border border-[var(--df-border)] rounded py-0.5 px-2 z-10">
                <span className="text-[9px] font-black tracking-widest text-[var(--df-accent)]">METRIC {idx + 1}</span>
              </div>
              {state.metrics.length > 1 && (
                <button onClick={() => removeMetric(m.id)} className="absolute -top-2 -right-2 text-[var(--df-text-muted)] hover:text-red-500 bg-[var(--df-card-bg)] border border-[var(--df-border)] rounded-full p-0.5 transition-colors opacity-0 group-hover:opacity-100 shadow-sm z-10" title="Remove Metric">
                  <FiX size={12} />
                </button>
              )}
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Source Table</label>
                  <select className="df-input text-xs py-1.5" value={m.tableId} onChange={e => handleChange(m.id, 'tableId', e.target.value)}>
                    <option value="">-- Select Table --</option>
                    {availableNodes.map(n => <option key={n.id} value={n.id}>{n.data.name}</option>)}
                  </select>
                </div>
                
                {m.tableId && (
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Function</label>
                      <select className="df-input text-xs py-1.5" value={m.func} onChange={e => handleChange(m.id, 'func', e.target.value)}>
                        <option value="COUNT">COUNT</option>
                        <option value="SUM">SUM</option>
                        <option value="AVG">AVG</option>
                        <option value="MIN">MIN</option>
                        <option value="MAX">MAX</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Column</label>
                      <select className="df-input text-xs py-1.5" value={m.column} onChange={e => handleChange(m.id, 'column', e.target.value)}>
                        <option value="">-- Select --</option>
                        {m.func === 'COUNT' && <option value="*">* (All)</option>}
                        {selectedTableNode?.data.columns?.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addMetric} className="flex items-center justify-center gap-1.5 w-full py-2 border border-[var(--df-border)] rounded text-[10px] font-bold text-[var(--df-text-muted)] hover:text-[var(--df-text)] hover:bg-[var(--df-bg-secondary)] transition-colors mt-2">
        <FiPlus size={12} /> ADD METRIC
      </button>

      <div className="p-2 mt-2 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded text-[10px] font-mono whitespace-pre-wrap text-[var(--df-text-soft)]">
        <span className="text-[var(--df-text-muted)] select-none block mb-1">Generated SQL Selects: </span>
        {node.data.condition || <span className="italic opacity-50">Incomplete...</span>}
      </div>
    </div>
  );
};

const SortBuilder = ({ node, availableNodes, updateNodeData }) => {
  const state = node.data.sortState || { tableId: '', column: '', direction: 'ASC' };

  const handleChange = (key, val) => {
    const nextState = { ...state, [key]: val };
    if (key === 'tableId') nextState.column = '';
    
    let cond = '';
    if (nextState.tableId && nextState.column) {
      const tableNode = availableNodes.find(n => n.id === nextState.tableId);
      const tableName = tableNode ? tableNode.data.name : '';
      cond = `${tableName}.${nextState.column} ${nextState.direction}`;
    }
    
    updateNodeData(node.id, { sortState: nextState, condition: cond });
  };

  const selectedTableNode = availableNodes.find(n => n.id === state.tableId);

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Source Table</label>
        <select className="df-input text-xs py-1.5" value={state.tableId} onChange={e => handleChange('tableId', e.target.value)}>
          <option value="">-- Select Table --</option>
          {availableNodes.map(n => <option key={n.id} value={n.id}>{n.data.name}</option>)}
        </select>
      </div>

       {state.tableId && (
        <div className="flex gap-2 animate-fade-in-up">
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Column</label>
            <select className="df-input text-xs py-1.5" value={state.column} onChange={e => handleChange('column', e.target.value)}>
              <option value="">-- Select --</option>
              {selectedTableNode?.data.columns?.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-[9px] font-bold text-[var(--df-text-muted)] uppercase tracking-wider">Direction</label>
            <select className="df-input text-xs py-1.5" value={state.direction} onChange={e => handleChange('direction', e.target.value)}>
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>
       )}

       {state.column && (
         <div className="p-2 mt-2 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded text-[10px] font-mono whitespace-pre-wrap text-[var(--df-text-soft)]">
            <span className="text-[var(--df-text-muted)] select-none">Preview: </span>
            {node.data.condition || <span className="italic opacity-50">Incomplete...</span>}
          </div>
       )}
    </div>
  );
};

const QueryRightPanel = ({ selectedNode, selectedEdge, availableNodes = [], onClose, updateNodeData, updateEdgeData, onDeleteNode }) => {
  if (!selectedNode && !selectedEdge) return null;

  // We are dealing with an Edge
  if (selectedEdge) {
    const sourceNode = availableNodes.find(n => n.id === selectedEdge.source);
    const targetNode = availableNodes.find(n => n.id === selectedEdge.target);
    const edgeName = `${sourceNode?.data.name || 'Unknown'} → ${targetNode?.data.name || 'Unknown'}`;

    return (
      <div className="w-64 border-l border-[var(--df-border)] bg-[var(--df-card-bg)] flex flex-col h-full z-40 transform transition-transform">
        <div className="p-3 border-b border-[var(--df-border)] flex items-center justify-between bg-[var(--df-bg-secondary)]/30">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12px] font-bold text-[var(--df-strong)] truncate">{edgeName}</span>
            <span className="text-[9px] font-black uppercase text-[var(--df-text-muted)] tracking-widest">JOIN CONFIGURATION</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--df-border)] rounded transition-colors text-[var(--df-text-muted)]" title="Close Panel">
              <FiX size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4 df-scrollbar">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--df-border)]/50">
              <FiLink className="text-[var(--df-text-muted)]" size={14} />
              <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider">
                {sourceNode?.type === 'queryTableNode' && targetNode?.type === 'queryTableNode' ? 'Configure Join' : 'Pipeline Flow'}
              </label>
            </div>
            {sourceNode?.type === 'queryTableNode' && targetNode?.type === 'queryTableNode' ? (
              <JoinBuilder edge={selectedEdge} availableNodes={availableNodes} updateEdgeData={updateEdgeData} />
            ) : (
              <div className="p-4 bg-[var(--df-bg-secondary)] border border-[var(--df-border)] rounded-xl flex flex-col items-center justify-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                  <FiActivity size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[var(--df-strong)]">Functional Flow Active</h4>
                  <p className="text-[10px] text-[var(--df-text-muted)] mt-1">
                    This link represents data flowing from <span className="text-[var(--df-accent)] font-semibold">{sourceNode?.data.name}</span> into the <span className="text-[var(--df-accent)] font-semibold">{targetNode?.data.name}</span> transformation. No join configuration required.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // We are dealing with a Node
  const nodeType = selectedNode.type;
  const { name, type, columns, selectedColumns = ['*'] } = selectedNode.data;

  const isAllSelected = selectedColumns.includes('*');

  const toggleColumn = (colName) => {
    let newSelected = [...selectedColumns];
    
    if (isAllSelected) {
      newSelected = columns.map(c => c.name).filter(c => c !== colName);
    } else {
      if (newSelected.includes(colName)) {
        newSelected = newSelected.filter(c => c !== colName);
      } else {
        newSelected.push(colName);
      }
    }
    
    if (newSelected.length === columns.length || newSelected.length === 0) {
      newSelected = ['*'];
    }
    
    updateNodeData(selectedNode.id, { selectedColumns: newSelected });
  };

  const selectAll = () => {
    updateNodeData(selectedNode.id, { selectedColumns: ['*'] });
  };

  return (
    <div className="w-64 border-l border-[var(--df-border)] bg-[var(--df-card-bg)] flex flex-col h-full z-40 transform transition-transform">
      <div className="p-3 border-b border-[var(--df-border)] flex items-center justify-between bg-[var(--df-bg-secondary)]/30">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[12px] font-bold text-[var(--df-strong)] truncate">{name}</span>
          <span className="text-[9px] font-black uppercase text-[var(--df-text-muted)] tracking-widest">{type} NODE</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onDeleteNode(selectedNode.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors" title="Delete Node">
            <FiTrash2 size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--df-border)] rounded transition-colors text-[var(--df-text-muted)]" title="Close Panel">
            <FiX size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 df-scrollbar">
        {nodeType === 'queryTableNode' ? (
         <div>
            <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider mb-2 block">Columns to Select</label>
            <div className="space-y-px">
              <button 
                onClick={selectAll}
                className="w-full flex flex-col items-start gap-1 p-2 hover:bg-[var(--df-bg-secondary)] rounded transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isAllSelected ? <FiCheckSquare size={14} className="text-[var(--df-accent)] shrink-0" /> : <FiSquare size={14} className="text-[var(--df-text-muted)] shrink-0" />}
                  <span className={`text-[11px] ${isAllSelected ? 'text-[var(--df-strong)] font-semibold' : 'text-[var(--df-text-soft)]'}`}>Select All (*)</span>
                </div>
              </button>

              <div className="h-px bg-[var(--df-border)]/50 my-1 mx-2" />

              {columns?.map(col => {
                const isSelected = isAllSelected || selectedColumns.includes(col.name);
                return (
                  <button 
                    key={col.name} 
                    onClick={() => toggleColumn(col.name)}
                    className="w-full flex items-center justify-between p-2 hover:bg-[var(--df-bg-secondary)] rounded transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isSelected ? <FiCheckSquare size={14} className="text-[var(--df-accent)] shrink-0" /> : <FiSquare size={14} className="text-[var(--df-text-muted)] shrink-0" />}
                      <span className={`text-[11px] truncate ${isSelected ? 'text-[var(--df-text)] font-medium' : 'text-[var(--df-text-soft)]'}`}>{col.name}</span>
                    </div>
                    <span className="text-[9px] text-[var(--df-text-muted)] uppercase font-[JetBrains_Mono] ml-2 shrink-0">{col.type}</span>
                  </button>
                );
              })}
            </div>
         </div>
        ) : nodeType === 'filterNode' ? (
         <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--df-border)]/50">
              <FiFilter className="text-[var(--df-text-muted)]" size={14} />
              <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider">Configure Filter</label>
            </div>
            <FilterBuilder node={selectedNode} availableNodes={availableNodes} updateNodeData={updateNodeData} />
         </div>
        ) : nodeType === 'aggregateNode' ? (
         <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--df-border)]/50">
              <FiActivity className="text-[var(--df-text-muted)]" size={14} />
              <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider">Configure Aggregation</label>
            </div>
            <AggregateBuilder node={selectedNode} availableNodes={availableNodes} updateNodeData={updateNodeData} />
         </div>
        ) : nodeType === 'sortNode' ? (
         <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--df-border)]/50">
              <FiList className="text-[var(--df-text-muted)]" size={14} />
              <label className="text-[10px] font-black uppercase text-[var(--df-text-muted)] tracking-wider">Configure Sorting</label>
            </div>
            <SortBuilder node={selectedNode} availableNodes={availableNodes} updateNodeData={updateNodeData} />
         </div>
        ) : null}
      </div>
    </div>
  );
};

export default QueryRightPanel;
