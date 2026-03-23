import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import Breadcrumbs from '../components/workspace/Breadcrumbs';
import CreateDropdown from '../components/workspace/CreateDropdown';
import FileList from '../components/workspace/FileList';
import NotebookEditor from '../components/workspace/NotebookEditor';

const DEFAULT_ITEMS = [
  { id: 'root-users', name: 'Users', type: 'folder', parentId: null },
  { id: 'root-shared', name: 'Shared', type: 'folder', parentId: null },
  { id: 'user-folder', name: 'user@dataforge.io', type: 'folder', parentId: 'root-users' },
  { id: 'nb-example', name: 'Example Notebook', type: 'notebook', parentId: 'user-folder', content: '-- Example SQL query\nSELECT * FROM customers LIMIT 10;' }
];

const FilePreview = ({ file, onBack }) => (
  <div className="flex flex-col h-full rounded-xl overflow-hidden min-h-[500px] border mt-2" style={{ backgroundColor: 'var(--df-card-bg)', borderColor: 'var(--df-border)' }}>
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'var(--df-surface)', borderColor: 'var(--df-border)' }}>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onBack} 
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--df-text-soft)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; e.currentTarget.style.color = 'var(--df-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
        >
          <FiArrowLeft size={16} />
        </button>
        <h2 className="text-[13px] font-semibold flex items-center" style={{ color: 'var(--df-strong)' }}>
          <span className="text-[9px] px-1.5 py-0.5 rounded mr-2 uppercase tracking-wider font-bold" style={{ backgroundColor: 'var(--df-surface)', color: 'var(--df-text-soft)', border: '1px solid var(--df-border)' }}>File</span>
          {file.name}
        </h2>
      </div>
    </div>
    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
      <FiFileText size={48} style={{ color: 'var(--df-text-muted)', marginBottom: '16px' }} />
      <h3 className="text-lg font-semibold" style={{ color: 'var(--df-strong)' }}>{file.name}</h3>
      <p className="text-sm mt-2" style={{ color: 'var(--df-text-soft)' }}>Preview is not available for this file type.</p>
    </div>
  </div>
);

const WorkspacePage = () => {
  const [items, setItems] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('databricks_workspace_items_v2');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
        // Find default user folder to open initially if we are at root
        const parsed = JSON.parse(saved);
        if (!currentFolderId) {
          const uFolder = parsed.find(i => i.id === 'user-folder');
          if (uFolder) setCurrentFolderId(uFolder.id);
        }
      } catch (e) {
        setItems(DEFAULT_ITEMS);
        setCurrentFolderId('user-folder');
      }
    } else {
      setItems(DEFAULT_ITEMS);
      localStorage.setItem('databricks_workspace_items_v2', JSON.stringify(DEFAULT_ITEMS));
      setCurrentFolderId('user-folder');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('databricks_workspace_items_v2', JSON.stringify(newItems));
  };

  const handleNavigate = (folderId) => {
    setCurrentFolderId(folderId);
    setActiveItem(null);
  };

  const handleOpen = (item) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
    } else if (item.type === 'notebook' || item.type === 'query' || item.type === 'file') {
      setActiveItem(item);
    }
  };

  const handleCreate = (type) => {
    const name = prompt(`Enter name for new ${type}:`, `New ${type}`);
    if (!name) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name,
      type,
      parentId: currentFolderId,
      content: ''
    };

    saveItems([...items, newItem]);
  };

  const handleRename = (item) => {
    const newName = prompt(`Enter new name for ${item.type}:`, item.name);
    if (!newName || newName === item.name) return;

    const newItems = items.map(i => i.id === item.id ? { ...i, name: newName } : i);
    saveItems(newItems);
    if (activeItem && activeItem.id === item.id) {
      setActiveItem({ ...activeItem, name: newName });
    }
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    // recursive delete helper
    const getIdsToDelete = (parentId) => {
      let ids = [];
      const children = items.filter(i => i.parentId === parentId);
      children.forEach(child => {
        ids.push(child.id);
        if (child.type === 'folder') {
          ids = [...ids, ...getIdsToDelete(child.id)];
        }
      });
      return ids;
    };

    const idsToDelete = new Set([item.id, ...getIdsToDelete(item.id)]);
    const newItems = items.filter(i => !idsToDelete.has(i.id));
    
    saveItems(newItems);
    
    if (activeItem && idsToDelete.has(activeItem.id)) {
      setActiveItem(null);
    }
  };

  const handleSaveContent = (id, content) => {
    const newItems = items.map(i => i.id === id ? { ...i, content } : i);
    saveItems(newItems);
    if (activeItem && activeItem.id === id) {
      setActiveItem({ ...activeItem, content });
    }
  };

  return (
    <div className="flex flex-col h-full w-full pt-8 px-10 pb-4 transition-colors duration-300" style={{ backgroundColor: 'var(--df-bg-secondary)', fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight transition-colors duration-300" style={{ color: 'var(--df-strong)' }}>Workspace</h1>
        {!activeItem && <CreateDropdown onCreate={handleCreate} />}
      </div>
      
      {/* 
        Breadcrumbs now ALWAYS accessible, even in Notebook view. 
        When in a notebook, it shows the path of its parent folder.
      */}
      <Breadcrumbs 
        currentFolderId={activeItem ? activeItem.parentId : currentFolderId} 
        items={items} 
        onNavigate={handleNavigate} 
      />

      <div className="flex-1 overflow-hidden mt-2">
        {activeItem ? (
          activeItem.type === 'file' ? (
            <FilePreview file={activeItem} onBack={() => setActiveItem(null)} />
          ) : (
            <NotebookEditor 
              notebook={activeItem} 
              onBack={() => setActiveItem(null)} 
              onSave={handleSaveContent} 
            />
          )
        ) : (
          <FileList 
            items={items} 
            currentFolderId={currentFolderId} 
            onOpen={handleOpen}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
