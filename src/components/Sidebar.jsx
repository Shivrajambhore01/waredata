import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiChevronLeft,
} from 'react-icons/fi';

/* ─── Custom SVG Icons (Increased Size & Weight for Clarity) ─── */
const IconWorkspace = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFiles = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
  </svg>
);
const IconSqlEditor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
  </svg>
);
const IconSavedQueries = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconSchema = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
);
const IconQueryBuilder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconCatalog = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconWarehouse = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const SECTIONS = [
  {
    id: 'workspace',
    label: 'Workspace',
    color: '#4ade80',
    items: [
      { id: 'workspace-home', label: 'Home', icon: IconWorkspace, to: '/workspace' },
    ],
  },
  {
    id: 'sql',
    label: 'SQL',
    color: '#fb923c',
    items: [
      { id: 'sql-editor', label: 'SQL Editor', icon: IconSqlEditor, to: '/sql-editor' },
      { id: 'saved-queries', label: 'Saved Queries', icon: IconSavedQueries, to: '/saved-queries' },
      { id: 'query-history', label: 'Query History', icon: IconHistory, to: '/query-history' },
    ],
  },
  {
    id: 'visualization',
    label: 'Visualization',
    color: '#60a5fa',
    items: [
      { id: 'schema-preview', label: 'Schema Preview', icon: IconSchema, to: '/schema-preview' },
      { id: 'query-builder', label: 'Query Builder', icon: IconQueryBuilder, to: '/query-builder' },
      // { id: 'charts',         label: 'Charts',         icon: IconBarChart,     to: null },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    color: '#d97706',
    items: [
      { id: 'catalog-main', label: 'Catalog', icon: IconCatalog, to: '/catalog' },
    ],
  },
  {
    id: 'warehouse',
    label: 'Warehouse',
    color: '#a855f7',
    items: [
      { id: 'warehouse-main', label: 'Warehouse', icon: IconWarehouse, to: '/warehouse' },
    ],
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpandedSidebar = isOpen || isHovered;

  return (
    <aside
      style={{
        width: isExpandedSidebar ? '220px' : '72px',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: 'var(--df-sidebar-bg)',
        borderRight: '1px solid var(--df-border)',
        boxShadow: isExpandedSidebar ? '10px 0 30px rgba(0,0,0,0.1)' : 'none',
        zIndex: 100,
      }}
      className="relative h-full flex flex-col flex-shrink-0 transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 flex flex-col min-h-0 pt-4"> {/* Reduced top padding from pt-10 to pt-4 */}
        <nav className="flex-1 px-3 overflow-y-auto overflow-x-hidden space-y-4 df-scrollbar"> {/* Reduced space-y-8 to space-y-4 */}
          {SECTIONS.map(({ id, label, color, items }) => (
            <div key={id} className="space-y-1"> {/* Reduced space-y-2 to space-y-1 */}
              {/* Section heading */}
              <div
                className="px-4 mb-2 flex items-center h-4 overflow-hidden transition-all duration-300"
                style={{
                  opacity: isExpandedSidebar ? 0.9 : 0,
                  transform: isExpandedSidebar ? 'translateX(0)' : 'translateX(-20px)',
                  height: isExpandedSidebar ? 'auto' : '0'
                }}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap" style={{ color }}>
                  {label}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-0.5 px-0.5"> {/* Reduced space-y-1.5 to space-y-0.5 */}
                {items.map(({ id: itemId, label: itemLabel, icon: ItemIcon, to }) => {
                  const content = (isActive) => (
                    <div className={`flex items-center w-full ${isExpandedSidebar ? 'justify-start px-3' : 'justify-center'}`}>
                      <span
                        className="flex-shrink-0 transition-all duration-300 transform group-hover:scale-110"
                        style={{
                          color: isActive ? color : 'var(--df-text-soft)',
                          filter: isActive ? `drop-shadow(0 0 8px ${color}44)` : 'none'
                        }}
                      >
                        <ItemIcon />
                      </span>
                      {isExpandedSidebar && (
                        <span
                          className="text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ml-3"
                          style={{
                            opacity: 1,
                            maxWidth: '160px',
                            color: isActive ? 'var(--df-strong)' : 'var(--df-text-soft)',
                            letterSpacing: '0.1px'
                          }}
                        >
                          {itemLabel}
                        </span>
                      )}
                    </div>
                  );

                  const commonClasses = `flex items-center h-10 rounded-xl cursor-pointer transition-all duration-300 group relative`; // Reduced height from h-12 to h-10

                  const activeStyle = {
                    backgroundColor: isExpandedSidebar ? 'rgba(255,149,0,0.06)' : 'transparent',
                    border: isExpandedSidebar ? '1px solid rgba(255,149,0,0.1)' : 'none',
                  };

                  if (to) {
                    return (
                      <NavLink
                        key={itemId}
                        to={to}
                        className={({ isActive }) => `${commonClasses} ${isActive ? 'active-link' : 'hover:bg-[var(--df-sidebar-hover)]'}`}
                        style={({ isActive }) => isActive ? activeStyle : {}}
                        title={!isExpandedSidebar ? itemLabel : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div
                                className="absolute left-0 w-1 h-5 rounded-r-full transition-all duration-300"
                                style={{
                                  backgroundColor: color,
                                  boxShadow: `0 0 10px ${color}`
                                }}
                              />
                            )}
                            {content(isActive)}
                          </>
                        )}
                      </NavLink>
                    );
                  }

                  return (
                    <div
                      key={itemId}
                      className={`${commonClasses} hover:bg-[var(--df-sidebar-hover)]`}
                      title={!isExpandedSidebar ? itemLabel : undefined}
                    >
                      {content(false)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Fixed bottom version badge (Keeping it simple and compact) */}
      <div className="p-4 mt-auto border-t border-[var(--df-border)] bg-[var(--df-sidebar-bg)] flex justify-center">
        <div className={`flex items-center gap-3 h-5 transition-all duration-300 ${isExpandedSidebar ? 'w-full px-2' : 'justify-center'}`}>
          <div className="flex-shrink-0 relative group">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_var(--df-success)]" style={{ backgroundColor: 'var(--df-success)' }}></div>
            {!isExpandedSidebar && (
              <div className="absolute left-1/2 -top-10 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                v2.0 RADIANT
              </div>
            )}
          </div>
          {isExpandedSidebar && (
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300"
              style={{ color: 'var(--df-text-muted)' }}
            >
              v2.0 RADIANT
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;