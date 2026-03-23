import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiFolder, FiFileText, FiDatabase, FiBook } from 'react-icons/fi';

const CreateDropdown = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = (type) => {
    setIsOpen(false);
    onCreate(type);
  };

  const btnStyle = { backgroundColor: 'var(--df-accent)', color: '#fff' };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg flex items-center space-x-2 transition-transform hover:scale-[1.02] text-[13px] font-bold"
        style={btnStyle}
      >
        <span>Create</span>
        <FiPlus />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-10 py-1 animate-fadeIn" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}>
          <DropdownItem icon={<FiBook className="w-4 h-4 text-[#fb923c]" />} label="Notebook" onClick={() => handleCreate('notebook')} />
          <DropdownItem icon={<FiFolder className="w-4 h-4 text-[#60a5fa]" />} label="Folder" onClick={() => handleCreate('folder')} />
          <DropdownItem icon={<FiFileText className="w-4 h-4 text-[#9ca3af]" />} label="File" onClick={() => handleCreate('file')} />
          <DropdownItem icon={<FiDatabase className="w-4 h-4 text-[#c084fc]" />} label="Query" onClick={() => handleCreate('query')} />
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className="w-full text-left px-4 py-2 flex items-center space-x-3 text-[13px] transition-colors"
    style={{ color: 'var(--df-text-soft)' }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; e.currentTarget.style.color = 'var(--df-strong)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--df-text-soft)'; }}
  >
    {icon} <span>{label}</span>
  </button>
);

export default CreateDropdown;
