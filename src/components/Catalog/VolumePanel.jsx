import React, { useState, useEffect } from 'react';
import { FiFile, FiDownload, FiRefreshCw, FiTrash2, FiLoader, FiCheck } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import { MOCK_DB } from '../../data/warehouseMockData';

const VolumePanel = ({ onConvertDone }) => {
  const [volumeList, setVolumeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [converting, setConverting] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Load mock volumes
    setTimeout(() => {
      setVolumeList(MOCK_DB.volumes || []);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleDownload = (vol) => {
    // Create a mock file download
    const content = `Mock content for ${vol.filename}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = vol.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.info(`Downloading ${vol.filename}...`);
  };

  const handleConvert = async (vol) => {
    setConverting(vol.id);
    // Simulate conversion delay
    setTimeout(() => {
      setVolumeList(prev => prev.map(v =>
        v.id === vol.id ? { ...v, status: 'converted' } : v
      ));
      toast.success(`Converted ${vol.filename} to table`);
      setConverting(null);
      onConvertDone?.();
    }, 1500);
  };

  const handleDelete = (vol) => {
    setVolumeList(prev => prev.filter(v => v.id !== vol.id));
    toast.success(`Deleted ${vol.filename}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton count={3} height="60px" gap="8px" />
      </div>
    );
  }

  if (volumeList.length === 0) {
    return (
      <div className="py-12 text-center">
        <FiFile size={28} className="mx-auto mb-3" style={{ color: 'var(--df-text-muted)' }} />
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--df-strong)' }}>No Volumes</p>
        <p className="text-xs" style={{ color: 'var(--df-text-muted)' }}>Upload a file to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {volumeList.map(vol => (
        <div
          key={vol.id}
          className="flex items-center gap-3 p-3 rounded-xl transition-colors"
          style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}
        >
          {/* Icon */}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
            <FiFile size={16} style={{ color: 'var(--df-accent)' }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: 'var(--df-strong)' }}>{vol.filename}</div>
            <div className="flex items-center gap-2 text-[10px] mt-0.5" style={{ color: 'var(--df-text-muted)' }}>
              <span>{vol.file_type}</span>
              <span>•</span>
              <span>{vol.size_display}</span>
              {vol.status === 'converted' && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5" style={{ color: 'var(--df-success, #059669)' }}>
                    <FiCheck size={9} /> Converted
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => handleDownload(vol)} className="p-1.5 rounded-md transition-all" title="Download"
              style={{ color: 'var(--df-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-accent)'; e.currentTarget.style.backgroundColor = 'var(--df-accent-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <FiDownload size={13} />
            </button>
            {vol.file_type === 'CSV' && vol.status !== 'converted' && (
              <button
                onClick={() => handleConvert(vol)}
                disabled={converting === vol.id}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--df-accent-soft)', color: 'var(--df-accent)' }}
                title="Convert to Table"
              >
                {converting === vol.id ? <FiLoader size={10} className="animate-spin" /> : <FiRefreshCw size={10} />}
                Convert
              </button>
            )}
            <button onClick={() => handleDelete(vol)} className="p-1.5 rounded-md transition-all" title="Delete"
              style={{ color: 'var(--df-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-danger, #DC2626)'; e.currentTarget.style.backgroundColor = 'var(--df-danger-soft, #FEE2E2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VolumePanel;
