import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '../../context/ThemeContext';
import QueryTableNode from './QueryTableNode';
import QueryTransformNode from './QueryTransformNode';
import { FiMinimize2 } from 'react-icons/fi';
import { MOCK_SCHEMA } from '../../mock/schemaMockData';

const nodeTypes = {
  queryTableNode: QueryTableNode,
  filterNode: QueryTransformNode,
  aggregateNode: QueryTransformNode,
  sortNode: QueryTransformNode,
};

// Unique ID generator for nodes
let idCounter = 0;
const getId = () => `node_${idCounter++}`;

const QueryCanvas = ({ onNodeClick, onEdgeClick, onNodesChangeExt, onEdgesChange, nodesExt, edgesExt, setNodesExt, setEdgesExt, onShowToast }) => {
  const { isDark } = useTheme();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => {
      onNodesChangeExt(changes);
    },
    [onNodesChangeExt]
  );

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodesExt.find(n => n.id === params.source);
      const targetNode = nodesExt.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;
      
      const isTableToTable = sourceNode.type === 'queryTableNode' && targetNode.type === 'queryTableNode';
      let validJoin = null;
      let isValidFlow = true;

      if (isTableToTable) {
        // Check MOCK_SCHEMA relationships for SQL Joins
        validJoin = MOCK_SCHEMA.relationships.find(r => 
          (r.from.startsWith(sourceNode.data.id + '.') && r.to.startsWith(targetNode.data.id + '.')) ||
          (r.from.startsWith(targetNode.data.id + '.') && r.to.startsWith(sourceNode.data.id + '.'))
        );
        
        if (!validJoin) {
          if (onShowToast) onShowToast(`Warning: No defined relationship between ${sourceNode.data.name} and ${targetNode.data.name}. This will create a Cross Join.`, 'info');
          isValidFlow = false;
        } else {
          if (onShowToast) onShowToast(`Valid join created: ${validJoin.from.split('.')[1]} → ${validJoin.to.split('.')[1]}`, 'success');
        }
      } else {
        // Transformations or other node types are always valid flows
        if (onShowToast) onShowToast(`${sourceNode.data.name} connected to ${targetNode.data.name} pipeline.`, 'success');
      }

      const edgeColor = isValidFlow ? 'var(--df-accent)' : '#ef4444';

      setEdgesExt((eds) => 
        addEdge(
          { 
            ...params, 
            animated: isValidFlow,
            style: { stroke: edgeColor, strokeWidth: 3, cursor: 'pointer' },
            markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
            data: { 
              joinType: 'LEFT', 
              condition: validJoin ? `${validJoin.from} = ${validJoin.to}` : '',
              isValid: isValidFlow
            }
          }, 
          eds
        )
      );
    },
    [nodesExt, setEdgesExt, onShowToast]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const tableDataStr = event.dataTransfer.getData('tableData');

      if (typeof type === 'undefined' || !type || !tableDataStr) {
        return;
      }

      const tableData = JSON.parse(tableDataStr);

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { ...tableData, selectedColumns: ['*'] }, // initialize with all columns
      };

      let autoEdge = null;
      if (type === 'queryTableNode') {
        const existingTableNodes = nodesExt.filter(n => n.type === 'queryTableNode');
        
        for (const existing of existingTableNodes) {
           const validJoin = MOCK_SCHEMA.relationships.find(r => 
             (r.from.startsWith(existing.data.name + '.') && r.to.startsWith(tableData.name + '.')) ||
             (r.from.startsWith(tableData.name + '.') && r.to.startsWith(existing.data.name + '.'))
           );
           
           // In Mock Schema, from/to are formatted as "table.col"
           // Actually, let's use exact data.id like we did in onConnect
           const exactValidJoin = MOCK_SCHEMA.relationships.find(r => 
             (r.from.startsWith(existing.data.id + '.') && r.to.startsWith(tableData.id + '.')) ||
             (r.from.startsWith(tableData.id + '.') && r.to.startsWith(existing.data.id + '.'))
           );

           if (exactValidJoin) {
             autoEdge = {
               id: `e-${existing.id}-${newNode.id}`,
               source: existing.id,
               target: newNode.id,
               animated: true,
               style: { stroke: 'var(--df-accent)', strokeWidth: 3, cursor: 'pointer' },
               markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--df-accent)' },
              data: { 
                joinType: 'LEFT', 
                condition: `${exactValidJoin.from} = ${exactValidJoin.to}`,
                isValid: true
              }
            };
             
             if (onShowToast) {
                onShowToast(`Auto-joined ${tableData.name} with ${existing.data.name} via ${exactValidJoin.from.split('.')[1]}`, 'success');
             }
             break; // just join to the first matching one for MVP
           }
        }
      }

      setNodesExt((nds) => nds.concat(newNode));
      if (autoEdge) {
         setEdgesExt((eds) => eds.concat(autoEdge));
      }
    },
    [reactFlowInstance, setNodesExt, setEdgesExt, nodesExt, onShowToast]
  );

  const handleNodeClick = (_, node) => {
    if (onNodeClick) onNodeClick(node);
  };

  const handleEdgeClick = (_, edge) => {
    if (onEdgeClick) onEdgeClick(edge);
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesExt}
        edges={edgesExt}
        onNodesChange={onNodesChangeExt}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode={isDark ? 'dark' : 'light'}
        className="bg-[var(--df-bg-secondary)]"
      >
        <Background 
          color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
          gap={20} 
          size={1} 
          variant="dots"
        />
        <Controls showInteractive={false} className="!bg-[var(--df-card-bg)] !border-[var(--df-border)] !shadow-lg scale-90" />
        
        {/* Intelligent Guidance Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-300">
           <div className="bg-[var(--df-accent-soft)] text-[var(--df-accent)] px-4 py-2 rounded-full font-bold text-[11px] shadow-sm flex items-center gap-2 border border-[var(--df-accent)]/20 shadow-[0_4px_12px_var(--df-accent-soft)] animate-fade-in-up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <span>
                {nodesExt.length === 0 ? "Guidance: Drag a table from the sidebar to begin." :
                 nodesExt.length === 1 ? "Guidance: Drag another related table or a Filter node to build your pipeline." :
                 edgesExt.length === 0 ? "Guidance: Connect your tables by dragging between the blue handles." :
                 "Guidance: Great! Configure columns in the right panel or click 'Run Pipeline'."}
              </span>
           </div>
        </div>

        {/* Floating Palette for Transformation Nodes */}
        <Panel position="top-right" className="m-4">
           <div className="bg-[var(--df-card-bg)]/90 backdrop-blur-sm border border-[var(--df-border)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 flex flex-col gap-2 w-32 select-none">
             <div className="text-[9px] font-black uppercase text-[var(--df-text-muted)] tracking-widest px-1">Transforms</div>
             <div 
                draggable 
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', 'filterNode');
                  e.dataTransfer.setData('tableData', JSON.stringify({ name: 'Filter', condition: '' }));
                  e.dataTransfer.effectAllowed = 'move';
                }} 
                className="p-2 bg-[var(--df-bg-secondary)] hover:bg-[var(--df-border)] rounded-lg text-[11px] font-bold text-[var(--df-strong)] border border-dashed border-[var(--df-border)] cursor-grab active:cursor-grabbing text-center transition-colors"
                title="Drag to add a Filter (WHERE) node"
             >
               Filter Node
             </div>
             <div 
                draggable 
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', 'aggregateNode');
                  e.dataTransfer.setData('tableData', JSON.stringify({ name: 'Aggregate', condition: '' }));
                  e.dataTransfer.effectAllowed = 'move';
                }} 
                className="p-2 bg-[var(--df-bg-secondary)] hover:bg-[var(--df-border)] rounded-lg text-[11px] font-bold text-[var(--df-strong)] border border-dashed border-[var(--df-border)] cursor-grab active:cursor-grabbing text-center transition-colors"
                title="Drag to add an Aggregate (GROUP BY) node"
             >
               Aggregate Node
             </div>
             <div 
                draggable 
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', 'sortNode');
                  e.dataTransfer.setData('tableData', JSON.stringify({ name: 'Sort', condition: '' }));
                  e.dataTransfer.effectAllowed = 'move';
                }} 
                className="p-2 bg-[var(--df-bg-secondary)] hover:bg-[var(--df-border)] rounded-lg text-[11px] font-bold text-[var(--df-strong)] border border-dashed border-[var(--df-border)] cursor-grab active:cursor-grabbing text-center transition-colors"
                title="Drag to add a Sort (ORDER BY) node"
             >
               Sort Node
             </div>
           </div>
        </Panel>

        {nodesExt.length === 0 && (
          <Panel position="center" className="pointer-events-none text-center opacity-40 select-none">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--df-border)] rounded-2xl p-8 bg-[var(--df-card-bg)]/50 backdrop-blur-sm">
              <FiMinimize2 size={48} className="mb-4 text-[var(--df-text-muted)]" />
              <h3 className="text-lg font-bold text-[var(--df-strong)] mb-1">Visual Query Canvas</h3>
              <p className="text-sm font-medium text-[var(--df-text-muted)] max-w-[250px]">
                Drag and drop tables from the left sidebar to start building your data pipeline.
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default QueryCanvas;
