import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiPlay } from 'react-icons/fi';

const NotebookEditor = ({ notebook, onBack, onSave }) => {
  const [content, setContent] = useState(notebook.content || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(notebook.content || '');
  }, [notebook.id]);

  const handleSave = () => {
    setIsSaving(true);
    onSave(notebook.id, content);
    setTimeout(() => setIsSaving(false), 500); 
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden min-h-[500px] border mt-2" style={{ backgroundColor: 'var(--df-card-bg)', borderColor: 'var(--df-border)' }}>
      {/* Editor Header */}
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
            <span className="text-[9px] px-1.5 py-0.5 rounded mr-2 uppercase tracking-wider font-bold" style={{ backgroundColor: 'var(--df-accent-soft)', color: 'var(--df-accent)' }}>Notebook</span>
            {notebook.name}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSave} 
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
            style={{ backgroundColor: 'var(--df-surface)', borderColor: 'var(--df-border)', color: 'var(--df-strong)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-sidebar-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
          >
            {isSaving ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin mr-1" style={{ borderColor: 'var(--df-text-muted)', borderTopColor: 'transparent' }}></span> : <FiSave />}
            <span>{isSaving ? 'Saved' : 'Save'}</span>
          </button>
          <button 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-white shadow-sm"
            style={{ backgroundImage: 'var(--df-gradient)' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <FiPlay />
            <span>Run All</span>
          </button>
        </div>
      </div>
      
      {/* Editor Body */}
      <div className="flex-1 p-0 flex flex-col" style={{ backgroundColor: 'var(--df-bg-secondary)' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-4 font-mono text-[13px] resize-none focus:outline-none transition-colors"
          style={{ backgroundColor: 'transparent', color: 'var(--df-text)', border: 'none' }}
          placeholder="-- Write your SQL or Python code here..."
          spellCheck="false"
        />
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold flex justify-between border-t" style={{ backgroundColor: 'var(--df-surface)', borderColor: 'var(--df-border)', color: 'var(--df-text-muted)' }}>
          <span>Language: SQL / Python</span>
          <span>{content.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}

export default NotebookEditor;
