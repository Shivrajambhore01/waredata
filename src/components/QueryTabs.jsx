import React from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

const QueryTabs = ({ tabs, activeTabId, onTabChange, onTabAdd, onTabClose }) => {
  return (
    <div className="flex items-center overflow-x-auto select-none scrollbar-hide py-0.5" style={{ backgroundColor: 'var(--df-surface)' }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="group flex items-center gap-3 px-4 py-1.5 min-w-[120px] max-w-[200px] cursor-pointer transition-colors"
            style={{
              backgroundColor: isActive ? 'var(--df-panel)' : 'transparent',
              color: isActive ? 'var(--df-strong)' : 'var(--df-text-soft)',
              fontWeight: isActive ? 500 : 400,
            }}
          >
            <span className="text-sm truncate flex-1 pt-0.5">
              {tab.name}
            </span>
            <button
              onClick={(e) => onTabClose(e, tab.id)}
              className={`p-0.5 rounded-sm transition-all ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ color: 'var(--df-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-muted)'; }}
            >
              <FiX size={14} />
            </button>
          </div>
        );
      })}
      
      <button 
        onClick={onTabAdd}
        className="mx-2 p-1.5 rounded-sm transition-colors"
        style={{ color: 'var(--df-text-soft)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        title="New Query"
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
};

export default QueryTabs;
