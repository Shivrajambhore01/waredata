import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FiGrid, FiCheckCircle } from 'react-icons/fi';

const QueryTableNode = ({ data, selected }) => {
  const { name, type, columns } = data;
  const isFact = type === 'FACT';

  return (
    <div className={`df-card min-w-[160px] transition-all duration-300 border-2 ${selected ? 'border-[var(--df-accent)] shadow-[0_0_20px_var(--df-accent-soft)] scale-105' : 'border-[rgba(0,0,0,0.15)] dark:border-[#333] hover:border-[var(--df-text-soft)] shadow-md'} rounded-xl bg-[var(--df-card-bg)]`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-[var(--df-info)] border-2 border-[var(--df-bg)]" />
      
      <div className={`px-3 py-2 rounded-t-lg border-b border-[var(--df-border)] flex items-center justify-between ${isFact ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
        <div className="flex items-center gap-2">
          <FiGrid size={14} className={isFact ? 'text-orange-500' : 'text-blue-500'} />
          <span className="font-bold text-[var(--df-strong)] text-xs truncate max-w-[100px]">{name}</span>
        </div>
        {selected && <FiCheckCircle size={14} className="text-[var(--df-accent)]" />}
      </div>

      <div className="px-3 py-1.5 flex flex-col gap-1">
        <span className="text-[9px] text-[var(--df-text-muted)] font-black uppercase tracking-widest">{type} TABLE</span>
        <div className="flex items-center gap-1.5">
           <span className="text-[10px] font-mono text-[var(--df-text-soft)] bg-[var(--df-bg-secondary)] px-1 rounded">{columns?.length || 0} cols</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-[var(--df-info)] border-2 border-[var(--df-bg)]" />
    </div>
  );
};

export default memo(QueryTableNode);
