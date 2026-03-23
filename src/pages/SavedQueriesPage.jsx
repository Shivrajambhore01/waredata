import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FiBookmark, FiTrash2, FiExternalLink, FiClock } from 'react-icons/fi';

const SavedQueriesPage = () => {
  const { savedQueries, deleteQuery, setSharedQuery } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = savedQueries.filter(q =>
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    q.sql.toLowerCase().includes(search.toLowerCase())
  );

  const openInEditor = (query) => {
    setSharedQuery(query.sql);
    navigate('/sql-editor');
  };

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString(); }
    catch { return iso; }
  };

  return (
    <div className="flex flex-col gap-6 p-10 pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="df-page-header">
        <h1>Saved Queries</h1>
        <p>Access and manage your saved SQL queries</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search saved queries..."
        className="df-input"
        style={{ maxWidth: '420px' }}
      />

      {filtered.length === 0 ? (
        <div className="df-card df-empty-state">
          <div className="df-empty-state-icon">
            <FiBookmark size={26} />
          </div>
          <h3>{savedQueries.length === 0 ? 'No saved queries yet' : 'No matching queries'}</h3>
          <p>{savedQueries.length === 0 ? 'Save a query from the SQL Editor to see it here.' : 'Try a different search term.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(query => (
            <div key={query.id} className="df-card df-card-interactive" style={{ padding: '20px 24px' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--df-accent-soft)' }}>
                      <FiBookmark size={14} style={{ color: 'var(--df-accent)' }} />
                    </div>
                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--df-strong)' }}>{query.name}</span>
                  </div>
                  <pre className="df-code" style={{ padding: '12px 16px', fontSize: '0.8rem', lineHeight: '1.6', maxHeight: '80px', overflow: 'hidden' }}>
                    {query.sql}
                  </pre>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                  <button onClick={() => openInEditor(query)} className="df-btn df-btn-ghost text-xs" title="Open in SQL Editor">
                    <FiExternalLink size={13} /> Open
                  </button>
                  <button onClick={() => deleteQuery(query.id)} className="df-btn df-btn-ghost text-xs" title="Delete query"
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--df-danger)'; e.currentTarget.style.backgroundColor = 'var(--df-danger-soft)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--df-text-soft)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs mt-3" style={{ color: 'var(--df-text-muted)' }}>
                <FiClock size={11} />
                <span>{formatDate(query.savedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedQueriesPage;
