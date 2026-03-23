import React, { useState } from 'react';
import { 
  FiRefreshCw, 
  FiMoreVertical, 
  FiCheckCircle, 
  FiChevronDown,
  FiFilter
} from 'react-icons/fi';

const dummyQueries = [
  { id: 1, query: "SELECT * FROM sqlday_lake.bloomfilter.test_table LIMIT 100", startedAt: "2024-01-18 19:03:31", duration: "744 ms", user: "adrian.chodkowski@hotmail.com", status: "success", barWidth: "15%" },
  { id: 2, query: "SELECT * FROM sqlday_lake.bloomfilter.test_table LIMIT 1000", startedAt: "2024-01-18 19:03:18", duration: "8.58 s", user: "adrian.chodkowski@hotmail.com", status: "success", barWidth: "60%" },
  { id: 3, query: "-- show tables in `hive_metastore`.`default`;", startedAt: "2024-01-18 19:03:16", duration: "6.29 s", user: "adrian.chodkowski@hotmail.com", status: "success", barWidth: "45%" },
  { id: 4, query: "show databases in `hive_metastore`;", startedAt: "2024-01-18 19:03:16", duration: "6.36 s", user: "adrian.chodkowski@hotmail.com", status: "success", barWidth: "46%" }
];

const QueryHistoryPage = () => {
  const [queries] = useState(dummyQueries);

  return (
    <div className="flex flex-col h-full p-10 pb-20" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--df-bg-secondary)', color: 'var(--df-text)' }}>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5">
        <div className="df-page-header" style={{ marginBottom: 0 }}>
          <h1>Query History</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="df-btn df-btn-ghost rounded-xl">
            <FiMoreVertical size={18} />
          </button>
          <button className="df-btn df-btn-secondary text-sm">
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 text-sm">
        <FilterDropdown label="User" />
        <FilterDropdown label="Last 14 days" icon={<FiFilter size={12}/>} />
        <FilterDropdown label="Duration" />
        <FilterDropdown label="Status" />
        <FilterDropdown label="Statement" />
        <FilterDropdown label="Statement ID" />
        <span className="df-badge df-badge-accent ml-2">{queries.length} queries</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="df-card overflow-hidden">
          <table className="df-table">
            <thead>
              <tr>
                <th style={{ width: '450px' }}>Query</th>
                <th>Started at <span className="text-[10px]">▼</span></th>
                <th>Duration</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q.id} className="cursor-pointer">
                  <td className="font-mono text-[13px] flex items-center gap-3 w-[450px]" style={{ color: 'var(--df-accent)' }}>
                    <FiCheckCircle className="flex-shrink-0" size={16} style={{ color: 'var(--df-success)' }} title="Success" />
                    <span className="truncate" title={q.query}>{q.query}</span>
                  </td>
                  <td style={{ color: 'var(--df-text-soft)' }}>{q.startedAt}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="df-duration-bar">
                        <div className="df-duration-bar-fill" style={{ width: q.barWidth }}></div>
                      </div>
                      <span style={{ color: 'var(--df-text-soft)' }}>{q.duration}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--df-text-soft)' }}>{q.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, icon }) => (
  <button className="df-filter-pill">
    {icon}
    <span>{label}</span>
    <FiChevronDown size={14} style={{ color: 'var(--df-text-muted)' }} />
  </button>
);

export default QueryHistoryPage;
