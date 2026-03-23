import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiBarChart2, FiTrendingUp, FiDownload, FiTrash2, FiMoreVertical, FiFileText } from 'react-icons/fi';
import { generateJSON, downloadAsFile } from '../../data/warehouseMockData';
import { useToast } from '../../context/ToastContext';

const TableActionsMenu = ({ selectedSchema, selectedTable, handleRunQuery, handleExportCSV, removeInjectedTable, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toast = useToast();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExportJSON = () => {
    if (!selectedSchema || !selectedTable) return;
    const json = generateJSON(selectedTable.sampleData);
    downloadAsFile(json, `${selectedTable.name}.json`, 'application/json');
    toast.success(`Exporting ${selectedTable.name}.json (Mock)`);
    setIsOpen(false);
  };

  const handleProfileData = () => {
    if (navigate && selectedSchema && selectedTable) {
      navigate('/sql-editor', {
        state: {
          prefillQuery: `-- Profile: ${selectedTable.name}\nSELECT\n  COUNT(*) AS total_rows,\n  COUNT(DISTINCT *) AS distinct_rows\nFROM ${selectedSchema.name}.${selectedTable.name};`
        }
      });
    }
    setIsOpen(false);
  };

  const handleGenerateStats = () => {
    if (fetchTableStats && selectedSchema && selectedTable) {
      fetchTableStats(selectedSchema.name, selectedTable.name);
    }
    setIsOpen(false);
  };

  const handleDeleteInjection = () => {
    if (removeInjectedTable && selectedTable) {
      removeInjectedTable(selectedTable.id);
      toast.success(`Removed ${selectedTable.name} from warehouse`);
    }
    setIsOpen(false);
  };

  const actions = [
    { icon: FiPlay, label: 'Run Query', onClick: () => { handleRunQuery?.(); setIsOpen(false); }, color: 'var(--df-accent)' },
    { icon: FiBarChart2, label: 'Profile Data', onClick: handleProfileData },
    { icon: FiTrendingUp, label: 'Generate Stats', onClick: handleGenerateStats },
    { divider: true },
    { icon: FiDownload, label: 'Export CSV', onClick: () => { handleExportCSV?.(); setIsOpen(false); } },
    { icon: FiFileText, label: 'Export JSON', onClick: handleExportJSON },
    { divider: true },
    { icon: FiTrash2, label: 'Delete Injection', onClick: handleDeleteInjection, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all"
        style={{ color: 'var(--df-text-soft)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-48 rounded-xl py-1.5 z-50 overflow-hidden animate-fadeIn"
          style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)', boxShadow: 'var(--df-shadow-lg)' }}
        >
          {actions.map((action, i) => {
            if (action.divider) {
              return <div key={i} className="my-1" style={{ borderTop: '1px solid var(--df-border)' }} />;
            }
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={action.onClick}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors"
                style={{ color: action.danger ? 'var(--df-danger, #DC2626)' : (action.color || 'var(--df-text-soft)') }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = action.danger ? 'var(--df-danger-soft, #FEE2E2)' : 'var(--df-accent-soft)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Icon size={13} />
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableActionsMenu;
