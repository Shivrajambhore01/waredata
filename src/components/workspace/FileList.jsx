import React, { useState } from 'react';
import { FiFolder, FiBook, FiFileText, FiDatabase, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';

const FileItem = ({ item, isSelected, onSelect, onOpen, onRename, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = () => {
    switch(item.type) {
      case 'folder': return <FiFolder className="text-[#60a5fa] w-5 h-5 mr-3" />;
      case 'notebook': return <FiBook className="text-[#fb923c] w-5 h-5 mr-3" />;
      case 'query': return <FiDatabase className="text-[#c084fc] w-5 h-5 mr-3" />;
      case 'file':
      default: return <FiFileText className="text-[#9ca3af] w-5 h-5 mr-3" />;
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    action();
  }

  // Double click vs single click styles
  const itemStyle = {
    borderBottom: '1px solid var(--df-border)',
    backgroundColor: isSelected ? 'var(--df-surface)' : 'transparent',
  };

  return (
    <div 
      className="flex items-center justify-between p-3.5 cursor-pointer group transition-colors select-none"
      style={itemStyle}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
      onClick={() => onSelect(item)}
      onDoubleClick={() => onOpen(item)}
    >
      <div className="flex items-center flex-1">
        {getIcon()}
        <span className="text-[13px] font-medium transition-colors" style={{ color: 'var(--df-strong)' }}>{item.name}</span>
      </div>
      <div className="relative">
        <button 
          className={`p-1.5 rounded-lg transition-all ${isSelected || isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          style={{ color: 'var(--df-text-soft)', backgroundColor: isMenuOpen ? 'var(--df-accent-soft)' : 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isMenuOpen ? 'var(--df-accent-soft)' : 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); onSelect(item); }}
        >
          <FiMoreVertical size={16} />
        </button>
        {isMenuOpen && (
          <div 
            className="absolute right-0 mt-1 w-36 rounded-xl shadow-lg z-20 py-1"
            style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button 
              onClick={(e) => handleActionClick(e, onRename)} 
              className="w-full text-left px-4 py-2 flex items-center space-x-2 text-[13px] transition-colors"
              style={{ color: 'var(--df-text-soft)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; e.currentTarget.style.color = 'var(--df-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
            >
              <FiEdit2 size={14} /> <span>Rename</span>
            </button>
            <button 
              onClick={(e) => handleActionClick(e, onDelete)} 
              className="w-full text-left px-4 py-2 flex items-center space-x-2 text-[13px] transition-colors"
              style={{ color: 'var(--df-danger)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-danger-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <FiTrash2 size={14} /> <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FileList = ({ items, currentFolderId, onOpen, onRename, onDelete }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);

  const children = items.filter(i => i.parentId === currentFolderId);

  const sortedChildren = [...children].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  if (sortedChildren.length === 0) {
    return (
      <div className="text-center py-10 text-[13px] rounded-xl border mt-2" style={{ backgroundColor: 'var(--df-card-bg)', borderColor: 'var(--df-border)', color: 'var(--df-text-muted)' }}>
        This folder is empty. Create a new item to get started.
      </div>
    );
  }

  // Prevent deselection when clicking within the list unless explicitly clicking empty space
  // We'll keep it simple: clicking a row selects it. Double clicking opens.
  return (
    <div className="rounded-xl overflow-hidden mt-2 border" style={{ backgroundColor: 'var(--df-card-bg)', borderColor: 'var(--df-border)' }}>
      <div className="flex items-center px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] border-b" style={{ backgroundColor: 'var(--df-surface)', borderColor: 'var(--df-border)', color: 'var(--df-text-muted)' }}>
        <span className="flex-1">Name</span>
      </div>
      <div className="flex-1 overflow-y-auto w-full" onClick={() => setSelectedItemId(null)}>
        {sortedChildren.map(item => (
          <FileItem 
            key={item.id} 
            item={item} 
            isSelected={selectedItemId === item.id}
            onSelect={(selectedItem) => setSelectedItemId(selectedItem.id)}
            onOpen={onOpen}
            onRename={() => onRename(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
