import React, { createContext, useContext, useState, useCallback } from 'react';
// ─── Mock Dataset ────────────────────────────────────────────────────────────
// ─── Mock Dataset ────────────────────────────────────────────────────────────
const initialCatalogs = {
  sales_catalog: {
    regional_sales: {
      north_region: { 
        columns: ['id', 'sales', 'date', 'status'], 
        rows: [
          [1, 1200, '2024-01-05', 'completed'],
          [4, 2200, '2024-01-12', 'completed'],
          [8, 520, '2024-02-03', 'completed'],
        ] 
      },
      south_region: { 
        columns: ['id', 'sales', 'date', 'status'], 
        rows: [
          [2, 340.50, '2024-01-07', 'completed'],
          [5, 450.00, '2024-01-14', 'failed'],
          [10, 640.00, '2024-02-14', 'completed'],
        ] 
      },
      east_region: { 
        columns: ['id', 'sales', 'date', 'status'], 
        rows: [
          [3, 890.00, '2024-01-10', 'pending'],
          [6, 3100.00, '2024-01-15', 'completed'],
          [9, 1850.00, '2024-02-10', 'pending'],
        ] 
      },
      west_region: { 
        columns: ['id', 'sales', 'date', 'status'], 
        rows: [
          [7, 775.00, '2024-02-01', 'completed'],
        ] 
      },
    },
    customers: {
      customer_details: { 
        columns: ['customer_id', 'name', 'region', 'tier', 'signup_date'], 
        rows: [
          ['C001', 'Acme Corp', 'North America', 'Enterprise', '2022-03-15'],
          ['C002', 'Bright Solutions', 'Europe', 'Mid-Market', '2022-07-20'],
          ['C003', 'CloudBase Inc', 'Asia Pacific', 'Enterprise', '2021-11-01'],
        ] 
      },
      customer_feedback: { 
        columns: ['id', 'customer_id', 'feedback', 'rating'], 
        rows: [
          [1, 'C001', 'Great service!', 5],
          [2, 'C002', 'Good support.', 4],
        ] 
      },
      loyalty_program: { 
        columns: ['id', 'customer_id', 'points', 'level'], 
        rows: [
          [1, 'C001', 500, 'Gold'],
          [2, 'C002', 300, 'Silver'],
        ] 
      },
    },
    products: {
      product_catalog: { 
        columns: ['product_id', 'name', 'category', 'unit_price'], 
        rows: [
          ['P01', 'Analytics Pro', 'Software', 1200.00],
          ['P02', 'DataBridge Lite', 'Software', 890.00],
        ] 
      },
      pricing: { 
        columns: ['id', 'product_id', 'base_price', 'discount'], 
        rows: [
          [1, 'P01', 1200.00, 0.1],
          [2, 'P02', 890.00, 0],
        ] 
      },
      inventory: { 
        columns: ['id', 'product_id', 'quantity', 'warehouse_loc'], 
        rows: [
          [1, 'P01', 100, 'WH-NORTH'],
          [2, 'P02', 250, 'WH-EAST'],
        ] 
      },
    },
  },
  marketing_catalog: {
    campaigns: {
      ad_campaigns: { 
        columns: ['id', 'name', 'budget', 'platform'], 
        rows: [
          [1, 'Summer Sale', 5000, 'Google Ads'],
          [2, 'Winter Fest', 7000, 'Facebook Ads'],
        ] 
      },
      email_campaigns: { 
        columns: ['id', 'subject', 'sent_count', 'open_rate'], 
        rows: [
          [1, 'Newsletter March', 1000, 0.25],
          [2, 'Product Update', 1500, 0.35],
        ] 
      },
      social_media_campaigns: { 
        columns: ['id', 'platform', 'posts_count', 'engagement'], 
        rows: [
          [1, 'Instagram', 10, 2500],
          [2, 'X/Twitter', 25, 1200],
        ] 
      },
    },
    analytics: {
      campaign_performance: { 
        columns: ['id', 'campaign_id', 'roi', 'cpa'], 
        rows: [
          [1, 1, 2.5, 15.0],
          [2, 2, 3.1, 12.0],
        ] 
      },
      click_through_rates: { 
        columns: ['id', 'campaign_id', 'ctr', 'impressions'], 
        rows: [
          [1, 1, 0.05, 10000],
          [2, 2, 0.08, 15000],
        ] 
      },
      conversions: { 
        columns: ['id', 'campaign_id', 'count', 'value'], 
        rows: [
          [1, 1, 50, 2500],
          [2, 2, 120, 8400],
        ] 
      },
    },
    audience: {
      user_segments: { 
        columns: ['id', 'segment_name', 'criteria'], 
        rows: [
          [1, 'High LTV', 'Total spend > $5000'],
          [2, 'Churn Risk', 'No activity > 30 days'],
        ] 
      },
      demographics: { 
        columns: ['id', 'segment_id', 'age_range', 'top_region'], 
        rows: [
          [1, 1, '25-45', 'North America'],
          [2, 2, '18-24', 'Europe'],
        ] 
      },
      engagement_data: { 
        columns: ['id', 'user_id', 'last_session_duration', 'clicks'], 
        rows: [
          [1, 'U004', 450, 12],
          [2, 'U005', 120, 5],
        ] 
      },
    },
  },
  hr_catalog: {
    employees: {
      employee_details: { 
        columns: ['id', 'employee_name', 'role', 'department', 'join_date'], 
        rows: [
          [1, 'Sarah Chen', 'Lead Data Engineer', 'Data Science', '2021-03-15'],
          [2, 'Marco Russo', 'Product Designer', 'Design', '2022-07-22'],
        ] 
      },
      attendance: { 
        columns: ['id', 'employee_id', 'date', 'status'], 
        rows: [
          [1, 1, '2024-03-18', 'Present'],
          [2, 2, '2024-03-18', 'Leave'],
        ] 
      },
      payroll: { 
        columns: ['id', 'employee_id', 'salary', 'bonus'], 
        rows: [
          [1, 1, 145000, 12000],
          [2, 2, 110000, 8000],
        ] 
      },
    },
    recruitment: {
      candidates: { 
        columns: ['id', 'name', 'position', 'source', 'status'], 
        rows: [
          [1, 'Alice Smith', 'Data Engineer', 'LinkedIn', 'Interviewing'],
          [2, 'Bob Jones', 'Frontend Developer', 'Referral', 'Under Review'],
        ] 
      },
      interviews: { 
        columns: ['id', 'candidate_id', 'interviewer_id', 'date', 'score'], 
        rows: [
          [1, 1, 1, '2024-03-20', 4.5],
        ] 
      },
      job_openings: { 
        columns: ['id', 'title', 'location', 'posted_at'], 
        rows: [
          [1, 'DevOps Lead', 'Remote', '2024-03-10'],
          [2, 'Product Manager', 'New York', '2024-03-12'],
        ] 
      },
    },
    performance: {
      reviews: { 
        columns: ['id', 'employee_id', 'cycle', 'rating_score', 'comments'], 
        rows: [
          [1, 1, '2023-Q4', 4.8, 'Exceptional performance in warehouse migration.'],
        ] 
      },
      ratings: { 
        columns: ['id', 'employee_id', 'current_rating', 'tenure_months'], 
        rows: [
          [1, 1, 'High Performer', 36],
          [2, 2, 'Strong Performer', 20],
        ] 
      },
      promotions: { 
        columns: ['id', 'employee_id', 'from_role', 'to_role', 'effective_date'], 
        rows: [
          [1, 1, 'Senior Data Engineer', 'Lead Data Engineer', '2023-01-01'],
        ] 
      },
    },
  },
};

const flattenCatalogs = (catalogs) => {
  const flat = {};
  Object.values(catalogs).forEach(schemaMap => {
    Object.values(schemaMap).forEach(tableMap => {
      Object.entries(tableMap).forEach(([tableName, tableData]) => {
        flat[tableName] = tableData;
      });
    });
  });
  return flat;
};

const initialTables = flattenCatalogs(initialCatalogs);

// ─── Simple Mock SQL Engine ───────────────────────────────────────────────────
const runMockQuery = (sql, tables) => {
  try {
    const normalized = sql.trim().toLowerCase();

    // Match: SELECT <cols|*> FROM <table> [WHERE <col> = '<val>'] [LIMIT <n>]
    const fromMatch = normalized.match(/from\s+(\w+)/);
    if (!fromMatch) return { error: 'No FROM clause found.' };

    const tableName = fromMatch[1];
    const tableData = tables[tableName];
    if (!tableData) return { error: `Table "${tableName}" not found. Available tables: ${Object.keys(tables).join(', ')}` };

    let { columns, rows } = tableData;

    // SELECT specific columns
    const selectMatch = normalized.match(/select\s+([\s\S]+?)\s+from/);
    let selectedCols = columns;
    if (selectMatch && selectMatch[1].trim() !== '*') {
      const requestedCols = selectMatch[1].split(',').map(c => c.trim().replace(/.*\.\s*/, ''));
      const validCols = requestedCols.filter(c => columns.map(col => col.toLowerCase()).includes(c.toLowerCase()));
      if (validCols.length > 0) {
        const colIdxs = validCols.map(c => columns.findIndex(col => col.toLowerCase() === c.toLowerCase()));
        selectedCols = validCols;
        rows = rows.map(r => colIdxs.map(i => r[i]));
      }
    } else {
      // All columns — rows as-is
    }

    // WHERE simple equality
    const whereMatch = normalized.match(/where\s+(\w+)\s*=\s*'([^']+)'/);
    if (whereMatch) {
      const colName = whereMatch[1];
      const colVal = whereMatch[2];
      const colIdx = selectedCols.findIndex(c => c.toLowerCase() === colName.toLowerCase());
      if (colIdx >= 0) {
        rows = rows.filter(r => String(r[colIdx]).toLowerCase() === colVal.toLowerCase());
      }
    }

    // LIMIT
    const limitMatch = normalized.match(/limit\s+(\d+)/);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1], 10));
    }

    return { columns: selectedCols, rows };
  } catch {
    return { error: 'Failed to parse query.' };
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

const loadSavedQueries = () => {
  try {
    const raw = localStorage.getItem('dataforge_saved_queries');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const DataProvider = ({ children }) => {
  const [catalogs] = useState(initialCatalogs);
  const [mockTables, setMockTables] = useState(initialTables);
  const [savedQueries, setSavedQueries] = useState(loadSavedQueries);
  const [queryResults, setQueryResults] = useState(null); // null | { columns, rows } | { error }
  // For sharing a query from Saved Queries → SQL Editor
  const [sharedQuery, setSharedQuery] = useState(null);

  const executeQuery = useCallback((sql) => {
    const result = runMockQuery(sql, mockTables);
    setQueryResults(result);
    return result;
  }, [mockTables]);

  const saveQuery = useCallback((name, sql) => {
    setSavedQueries(prev => {
      const next = [
        ...prev,
        { id: Date.now(), name: name || `Query ${prev.length + 1}`, sql, savedAt: new Date().toISOString() },
      ];
      localStorage.setItem('dataforge_saved_queries', JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteQuery = useCallback((id) => {
    setSavedQueries(prev => {
      const next = prev.filter(q => q.id !== id);
      localStorage.setItem('dataforge_saved_queries', JSON.stringify(next));
      return next;
    });
  }, []);

  const injectRow = useCallback((tableName, rowValues) => {
    setMockTables(prev => {
      const table = prev[tableName];
      if (!table) return prev;
      return {
        ...prev,
        [tableName]: {
          ...table,
          rows: [...table.rows, rowValues],
        },
      };
    });
  }, []);

  return (
    <DataContext.Provider value={{
      catalogs,
      mockTables,
      savedQueries,
      queryResults,
      setQueryResults,
      sharedQuery,
      setSharedQuery,
      executeQuery,
      saveQuery,
      deleteQuery,
      injectRow,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
