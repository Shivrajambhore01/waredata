import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FiFilter, FiActivity, FiArrowRightCircle } from 'react-icons/fi';

const QueryTransformNode = ({ data, selected, type }) => {
  const isFilter = type === 'filterNode';
  const label = isFilter ? 'Filter' : 'Aggregate';
  const Icon = isFilter ? FiFilter : FiActivity;
  const colorClass = isFilter ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600';

  return (
    <div className={`df-card min-w-[140px] transition-all duration-300 border-2 ${selected ? 'border-[var(--df-accent)] shadow-[0_0_20px_var(--df-accent-soft)] scale-105' : 'border-[rgba(0,0,0,0.15)] dark:border-[#333] hover:border-[var(--df-text-soft)] shadow-md'} rounded-xl bg-[var(--df-card-bg)]`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-[var(--df-info)] border-2 border-[var(--df-bg)]" />
      
      <div className={`px-3 py-2 rounded-t-lg border-b border-[var(--df-border)] flex items-center gap-2 ${colorClass}`}>
        <Icon size={14} />
        <span className="font-bold text-xs">{label}</span>
      </div>

      <div className="px-3 py-2 flex flex-col gap-1 items-center justify-center min-h-[40px]">
        {data.condition ? (
          <span className="text-[10px] text-[var(--df-strong)] font-mono text-center truncate w-full">{data.condition}</span>
        ) : (
          <span className="text-[9px] text-[var(--df-text-muted)] italic">Configure in panel &rarr;</span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-[var(--df-info)] border-2 border-[var(--df-bg)]" />
    </div>
  );
};

export default memo(QueryTransformNode);
