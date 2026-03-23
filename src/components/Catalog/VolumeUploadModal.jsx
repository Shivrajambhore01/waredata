import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiFile, FiLoader, FiCheck } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const ACCEPTED_TYPES = ['.csv', '.json', '.tsv', '.txt', '.parquet'];

const VolumeUploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload with mock data
    setTimeout(() => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const mockResult = {
        id: `vol_${Date.now()}`,
        filename: file.name,
        file_type: ext,
        size_display: `${(file.size / 1024).toFixed(1)} KB`,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      };
      setUploadDone(true);
      toast.success(`Uploaded ${file.name} successfully`);
      setTimeout(() => {
        onUploaded?.(mockResult);
        setFile(null);
        setUploadDone(false);
        setIsUploading(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  const resetAndClose = () => {
    setFile(null);
    setIsUploading(false);
    setUploadDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--df-card-bg)', border: '1px solid var(--df-border)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--df-border)' }}>
          <div className="flex items-center gap-2">
            <FiUploadCloud size={18} style={{ color: 'var(--df-accent)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--df-strong)' }}>Upload Volume</h3>
          </div>
          <button onClick={resetAndClose} className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--df-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--df-surface)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FiX size={18} />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <div
            className="rounded-xl p-8 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${isDragging ? 'var(--df-accent)' : 'var(--df-border)'}`,
              backgroundColor: isDragging ? 'var(--df-accent-soft)' : 'var(--df-bg-secondary)',
            }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }}
            />
            {uploadDone ? (
              <div className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--df-success-soft, #D1FAE5)' }}>
                  <FiCheck size={24} style={{ color: 'var(--df-success, #059669)' }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--df-success, #059669)' }}>Upload Complete!</p>
              </div>
            ) : file ? (
              <div className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--df-accent-soft)' }}>
                  <FiFile size={24} style={{ color: 'var(--df-accent)' }} />
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--df-strong)' }}>{file.name}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--df-text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[10px] font-bold uppercase" style={{ color: 'var(--df-text-muted)' }}>
                  Change file
                </button>
              </div>
            ) : (
              <>
                <FiUploadCloud size={32} className="mx-auto mb-3" style={{ color: isDragging ? 'var(--df-accent)' : 'var(--df-text-muted)' }} />
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--df-strong)' }}>
                  Drag & drop a file here
                </p>
                <p className="text-xs" style={{ color: 'var(--df-text-muted)' }}>
                  or click to browse. Supports CSV, JSON, TSV, Parquet
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--df-border)', backgroundColor: 'var(--df-bg-secondary)' }}>
          <button onClick={resetAndClose} className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors" style={{ color: 'var(--df-text-soft)', border: '1px solid var(--df-border)' }}>
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading || uploadDone}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--df-accent)', color: 'white' }}
          >
            {isUploading ? <><FiLoader size={12} className="animate-spin" /> Uploading...</> : <>Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolumeUploadModal;
