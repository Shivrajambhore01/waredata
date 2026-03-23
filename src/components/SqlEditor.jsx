import React from 'react';
import Editor from '@monaco-editor/react';
import { FiPlay, FiChevronsRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const SqlEditor = ({ value, onChange, onExecute, onExecuteAll, onFormat, onSave, saveMsg }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col overflow-hidden flex-1 rounded-xl" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-card-border)', boxShadow: 'var(--df-shadow-sm)' }}>
      <div className="flex flex-1 relative min-h-[400px]">
        {/* Left Execution Bar */}
        <div className="w-14 flex flex-col items-center py-4 gap-6" style={{ backgroundColor: 'var(--df-surface)', borderRight: '1px solid var(--df-border)' }}>
          <button
            onClick={onExecute}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all transform hover:scale-110 active:scale-95 group"
            style={{ backgroundColor: 'var(--df-card-bg)', color: 'var(--df-success)', border: '1px solid var(--df-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-success)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-card-bg)'; e.currentTarget.style.color = 'var(--df-success)'; }}
            title="Execute (Ctrl+Enter)"
          >
            <FiPlay size={18} className="fill-current" />
          </button>
          <button
            onClick={onExecuteAll}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all transform hover:scale-110 active:scale-95 group"
            style={{ backgroundColor: 'var(--df-card-bg)', color: 'var(--df-info)', border: '1px solid var(--df-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-info)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-card-bg)'; e.currentTarget.style.color = 'var(--df-info)'; }}
            title="Execute All (Ctrl+Shift+Enter)"
          >
            <FiChevronsRight size={20} className="fill-current" />
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <div className="absolute top-2 right-4 z-10 opacity-30 pointer-events-none">
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--df-text-muted)' }}>[ 1 ]</span>
          </div>
          
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme={isDark ? 'vs-dark' : 'light'}
            value={value}
            onChange={onChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              fontFamily: "ui-monospace, Consolas, 'Courier New', monospace",
              renderLineHighlight: 'all',
              suggestOnTriggerCharacters: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              lineDecorationsWidth: 10,
              folding: false,
              fixedOverflowWidgets: true,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider" style={{ backgroundColor: 'var(--df-surface)', borderTop: '1px solid var(--df-border)', color: 'var(--df-text-muted)' }}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--df-success)' }}></div>
            Ready
          </span>
          <span style={{ color: 'var(--df-border)' }}>|</span>
          <span>Tab: main_catalog.public</span>
        </div>
        <div className="flex items-center gap-4 italic opacity-70">
          <span>Ctrl+Enter: Run</span>
          <span>Ctrl+S: Save</span>
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;
