import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '../../context/ThemeContext';
import TableNode from './TableNode';
import { MOCK_SCHEMA } from '../../mock/schemaMockData';
import CardinalityEdge from './CardinalityEdge';

const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  cardinalityEdge: CardinalityEdge,
};

const SchemaGraph = ({ onTableClick, highlightDataFlow }) => {
  const { isDark } = useTheme();

  // 1. Prepare Initial Nodes with manual positions for a nice layout
  const initialNodes = useMemo(() => {
    const layout = {
      users: { x: 0, y: 0 },
      employees: { x: 300, y: 0 },
      categories: { x: -300, y: 0 },
      products: { x: -300, y: 250 },
      stores: { x: 300, y: 250 },
      customer_reviews: { x: 0, y: 250 },
      orders: { x: 0, y: 550 },
      order_items: { x: -300, y: 550 },
      inventory: { x: 300, y: 550 },
      sales_targets: { x: 600, y: 550 },
    };

    return MOCK_SCHEMA.tables.map((table) => ({
      id: table.id,
      type: 'tableNode',
      position: layout[table.id] || { x: 0, y: 0 },
      data: { 
        name: table.name, 
        type: table.type, 
        columns: table.columns 
      },
    }));
  }, []);

  // 2. Prepare Initial Edges from relationships
  const initialEdges = useMemo(() => {
    return MOCK_SCHEMA.relationships.map((rel, idx) => {
      const [sourceTable] = rel.from.split('.');
      const [targetTable] = rel.to.split('.');
      
      const isFactToDim = MOCK_SCHEMA.tables.find(t => t.id === sourceTable)?.type === 'FACT';
      const edgeColor = highlightDataFlow ? (isFactToDim ? 'var(--df-accent)' : 'var(--df-info)') : (isDark ? 'var(--df-text-soft)' : '#777');

      return {
        id: `e-${idx}`,
        source: sourceTable,
        target: targetTable,
        type: 'cardinalityEdge',
        data: {
          label: rel.from.split('.')[1] + ' → ' + rel.to.split('.')[1],
          cardinality: rel.cardinality || 'N:1'
        },
        animated: highlightDataFlow && isFactToDim,
        style: { 
          stroke: edgeColor,
          strokeWidth: 2.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 20,
          height: 20
        },
      };
    });
  }, [highlightDataFlow, isDark]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_, node) => {
    const tableData = MOCK_SCHEMA.tables.find(t => t.id === node.id);
    onTableClick(tableData);
  };

  return (
    <div className="w-full h-full bg-[var(--df-bg)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        colorMode={isDark ? 'dark' : 'light'}
      >
        <Controls showInteractive={false} className="!bg-[var(--df-card-bg)] !border-[var(--df-border)] !shadow-lg scale-90" />
        <Background 
          color={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 
          gap={40} 
          size={1} 
        />
      </ReactFlow>
    </div>
  );
};

export default SchemaGraph;
