import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from '@xyflow/react';

const CardinalityEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const { cardinality = 'N:1', label = '' } = data || {};
  const [sourceVal, targetVal] = cardinality.split(':');
  
  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          strokeWidth: 2.5,
          stroke: 'var(--df-text-soft)',
          transition: 'stroke 0.3s ease'
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceX + (sourcePosition === 'right' ? 22 : -22)}px,${sourceY}px)`,
            fontSize: 10,
            fontWeight: 900,
            color: 'var(--df-accent)',
            background: 'var(--df-card-bg)',
            padding: '1px 3px',
            borderRadius: '4px',
            border: '1px solid var(--df-border)',
            pointerEvents: 'none',
            zIndex: 10
          }}
          className="shadow-sm"
        >
          {sourceVal}
        </div>

        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX + (targetPosition === 'left' ? -22 : 22)}px,${targetY}px)`,
            fontSize: 10,
            fontWeight: 900,
            color: 'var(--df-accent)',
            background: 'var(--df-card-bg)',
            padding: '1px 3px',
            borderRadius: '4px',
            border: '1px solid var(--df-border)',
            pointerEvents: 'none',
            zIndex: 10
          }}
          className="shadow-sm"
        >
          {targetVal}
        </div>

        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--df-strong)',
            background: 'var(--df-bg)',
            padding: '3px 8px',
            borderRadius: '8px',
            border: '1px solid var(--df-border)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            zIndex: 20
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CardinalityEdge;
