import React from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumbs = ({ currentFolderId, items, onNavigate }) => {
  const path = [];
  let curr = items.find(i => i.id === currentFolderId);
  while (curr) {
    path.unshift(curr);
    curr = items.find(i => i.id === curr.parentId);
  }

  return (
    <div className="flex items-center space-x-2 text-[13px] mb-4 px-1" style={{ color: 'var(--df-text-soft)' }}>
      <button 
        onClick={() => onNavigate(null)} 
        className="flex items-center transition-colors hover:opacity-80"
        style={{ color: 'var(--df-accent)' }}
      >
        <FiHome className="mr-1.5" size={14} /> Workspace
      </button>
      {path.map((folder, idx) => (
        <React.Fragment key={folder.id}>
          <FiChevronRight size={14} style={{ color: 'var(--df-text-muted)' }} />
          <button 
            onClick={() => onNavigate(folder.id)}
            className={`transition-colors ${idx === path.length - 1 ? 'font-bold' : 'hover:opacity-80'}`}
            style={{ color: idx === path.length - 1 ? 'var(--df-strong)' : 'var(--df-accent)' }}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
