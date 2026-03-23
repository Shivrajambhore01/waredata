/**
 * Comprehensive Mock Data for Catalog & Warehouse
 * Replaces all backend PostgreSQL data.
 */

// ── Catalog Tree ─────────────────────────────────────────────
export const MOCK_DB = {
  catalogs: [
    {
      id: 'sales_catalog',
      name: 'sales_catalog',
      description: 'Core business data including sales, customers, and product inventory.',
      schemas: [
        {
          id: 'regional_sales',
          name: 'regional_sales',
          description: 'Sales data partitioned by geographical regions.',
          owner: 'sales_admin',
          size: '2.4 GB',
          tables: [
            {
              id: 'north_region',
              name: 'north_region',
              rowCount: 12450,
              storageSize: '1.2 GB',
              description: 'Sales transactions for the Northern territory.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'sales', type: 'DECIMAL' },
                { name: 'date', type: 'DATE' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, sales: 1200, date: '2024-01-05', status: 'completed' },
                { id: 4, sales: 2200, date: '2024-01-12', status: 'completed' },
                { id: 8, sales: 520, date: '2024-02-03', status: 'completed' },
                { id: 12, sales: 3400, date: '2024-02-18', status: 'pending' },
                { id: 15, sales: 890, date: '2024-03-01', status: 'completed' },
              ]
            },
            {
              id: 'south_region',
              name: 'south_region',
              rowCount: 8520,
              storageSize: '890 MB',
              description: 'Sales transactions for the Southern territory.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'sales', type: 'DECIMAL' },
                { name: 'date', type: 'DATE' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 2, sales: 340.50, date: '2024-01-07', status: 'completed' },
                { id: 5, sales: 450.00, date: '2024-01-14', status: 'failed' },
                { id: 10, sales: 640.00, date: '2024-02-14', status: 'completed' },
              ]
            },
            {
              id: 'east_region',
              name: 'east_region',
              rowCount: 6340,
              storageSize: '680 MB',
              description: 'Sales transactions for the Eastern territory.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'sales', type: 'DECIMAL' },
                { name: 'date', type: 'DATE' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 3, sales: 890.00, date: '2024-01-10', status: 'pending' },
                { id: 6, sales: 3100.00, date: '2024-01-15', status: 'completed' },
                { id: 9, sales: 1850.00, date: '2024-02-10', status: 'pending' },
              ]
            },
            {
              id: 'west_region',
              name: 'west_region',
              rowCount: 4200,
              storageSize: '450 MB',
              description: 'Sales transactions for the Western territory.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'sales', type: 'DECIMAL' },
                { name: 'date', type: 'DATE' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 7, sales: 775.00, date: '2024-02-01', status: 'completed' },
                { id: 11, sales: 1320.00, date: '2024-02-20', status: 'completed' },
              ]
            },
          ]
        },
        {
          id: 'customers',
          name: 'customers',
          description: 'Customer profiles and engagement metrics.',
          owner: 'crm_mgr',
          size: '1.1 GB',
          tables: [
            {
              id: 'customer_details',
              name: 'customer_details',
              rowCount: 45000,
              storageSize: '1.1 GB',
              description: 'Primary customer records and contact information.',
              columns: [
                { name: 'customer_id', type: 'VARCHAR PRIMARY KEY' },
                { name: 'name', type: 'TEXT' },
                { name: 'region', type: 'VARCHAR' },
                { name: 'tier', type: 'VARCHAR' },
                { name: 'signup_date', type: 'DATE' }
              ],
              sampleData: [
                { customer_id: 'C001', name: 'Acme Corp', region: 'North America', tier: 'Enterprise', signup_date: '2022-03-15' },
                { customer_id: 'C002', name: 'Bright Solutions', region: 'Europe', tier: 'Mid-Market', signup_date: '2022-07-20' },
                { customer_id: 'C003', name: 'CloudBase Inc', region: 'Asia Pacific', tier: 'Enterprise', signup_date: '2021-11-01' },
              ]
            },
            {
              id: 'customer_feedback',
              name: 'customer_feedback',
              rowCount: 2300,
              storageSize: '120 MB',
              description: 'Customer satisfaction and feedback records.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'customer_id', type: 'VARCHAR' },
                { name: 'feedback', type: 'TEXT' },
                { name: 'rating', type: 'INT' }
              ],
              sampleData: [
                { id: 1, customer_id: 'C001', feedback: 'Great service!', rating: 5 },
                { id: 2, customer_id: 'C002', feedback: 'Good support.', rating: 4 },
              ]
            },
            {
              id: 'loyalty_program',
              name: 'loyalty_program',
              rowCount: 1800,
              storageSize: '85 MB',
              description: 'Loyalty points and membership levels.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'customer_id', type: 'VARCHAR' },
                { name: 'points', type: 'INT' },
                { name: 'level', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, customer_id: 'C001', points: 500, level: 'Gold' },
                { id: 2, customer_id: 'C002', points: 300, level: 'Silver' },
              ]
            },
          ]
        },
        {
          id: 'products',
          name: 'products',
          description: 'Product catalog and inventory management.',
          owner: 'product_mgr',
          size: '560 MB',
          tables: [
            {
              id: 'product_catalog',
              name: 'product_catalog',
              rowCount: 560,
              storageSize: '220 MB',
              description: 'Complete product listing and categorization.',
              columns: [
                { name: 'product_id', type: 'VARCHAR PRIMARY KEY' },
                { name: 'name', type: 'TEXT' },
                { name: 'category', type: 'VARCHAR' },
                { name: 'unit_price', type: 'DECIMAL' }
              ],
              sampleData: [
                { product_id: 'P01', name: 'Analytics Pro', category: 'Software', unit_price: 1200.00 },
                { product_id: 'P02', name: 'DataBridge Lite', category: 'Software', unit_price: 890.00 },
              ]
            },
            {
              id: 'pricing',
              name: 'pricing',
              rowCount: 560,
              storageSize: '180 MB',
              description: 'Product pricing and discount tiers.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'product_id', type: 'VARCHAR' },
                { name: 'base_price', type: 'DECIMAL' },
                { name: 'discount', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, product_id: 'P01', base_price: 1200.00, discount: 0.1 },
                { id: 2, product_id: 'P02', base_price: 890.00, discount: 0 },
              ]
            },
            {
              id: 'inventory',
              name: 'inventory',
              rowCount: 340,
              storageSize: '160 MB',
              description: 'Product stock levels across warehouses.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'product_id', type: 'VARCHAR' },
                { name: 'quantity', type: 'INT' },
                { name: 'warehouse_loc', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, product_id: 'P01', quantity: 100, warehouse_loc: 'WH-NORTH' },
                { id: 2, product_id: 'P02', quantity: 250, warehouse_loc: 'WH-EAST' },
              ]
            },
          ]
        },
      ]
    },
    {
      id: 'marketing_catalog',
      name: 'marketing_catalog',
      description: 'Marketing performance, campaigns, and audience segmentation.',
      schemas: [
        {
          id: 'campaigns',
          name: 'campaigns',
          description: 'Ad, email, and social media campaign tracking.',
          owner: 'marketing_ops',
          size: '850 MB',
          tables: [
            {
              id: 'ad_campaigns',
              name: 'ad_campaigns',
              rowCount: 120,
              storageSize: '340 MB',
              description: 'Performance metrics for digital advertising campaigns.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'name', type: 'TEXT' },
                { name: 'budget', type: 'DECIMAL' },
                { name: 'platform', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, name: 'Summer Sale', budget: 5000, platform: 'Google Ads' },
                { id: 2, name: 'Winter Fest', budget: 7000, platform: 'Facebook Ads' },
              ]
            },
            {
              id: 'email_campaigns',
              name: 'email_campaigns',
              rowCount: 450,
              storageSize: '280 MB',
              description: 'Email marketing campaign metrics.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'subject', type: 'TEXT' },
                { name: 'sent_count', type: 'INT' },
                { name: 'open_rate', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, subject: 'Newsletter March', sent_count: 1000, open_rate: 0.25 },
                { id: 2, subject: 'Product Update', sent_count: 1500, open_rate: 0.35 },
              ]
            },
            {
              id: 'social_media_campaigns',
              name: 'social_media_campaigns',
              rowCount: 230,
              storageSize: '230 MB',
              description: 'Social media campaign engagement data.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'platform', type: 'VARCHAR' },
                { name: 'posts_count', type: 'INT' },
                { name: 'engagement', type: 'INT' }
              ],
              sampleData: [
                { id: 1, platform: 'Instagram', posts_count: 10, engagement: 2500 },
                { id: 2, platform: 'X/Twitter', posts_count: 25, engagement: 1200 },
              ]
            },
          ]
        },
        {
          id: 'analytics',
          name: 'analytics',
          description: 'Campaign performance and metrics analysis.',
          owner: 'analytics_lead',
          size: '620 MB',
          tables: [
            {
              id: 'campaign_performance',
              name: 'campaign_performance',
              rowCount: 180,
              storageSize: '250 MB',
              description: 'ROI and CPA for marketing campaigns.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'campaign_id', type: 'INT' },
                { name: 'roi', type: 'DECIMAL' },
                { name: 'cpa', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, campaign_id: 1, roi: 2.5, cpa: 15.0 },
                { id: 2, campaign_id: 2, roi: 3.1, cpa: 12.0 },
              ]
            },
            {
              id: 'click_through_rates',
              name: 'click_through_rates',
              rowCount: 320,
              storageSize: '200 MB',
              description: 'CTR and impressions data.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'campaign_id', type: 'INT' },
                { name: 'ctr', type: 'DECIMAL' },
                { name: 'impressions', type: 'INT' }
              ],
              sampleData: [
                { id: 1, campaign_id: 1, ctr: 0.05, impressions: 10000 },
                { id: 2, campaign_id: 2, ctr: 0.08, impressions: 15000 },
              ]
            },
            {
              id: 'conversions',
              name: 'conversions',
              rowCount: 560,
              storageSize: '170 MB',
              description: 'Conversion tracking and revenue attribution.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'campaign_id', type: 'INT' },
                { name: 'count', type: 'INT' },
                { name: 'value', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, campaign_id: 1, count: 50, value: 2500 },
                { id: 2, campaign_id: 2, count: 120, value: 8400 },
              ]
            },
          ]
        },
        {
          id: 'audience',
          name: 'audience',
          description: 'Audience segmentation and demographic data.',
          owner: 'audience_mgr',
          size: '380 MB',
          tables: [
            {
              id: 'user_segments',
              name: 'user_segments',
              rowCount: 45,
              storageSize: '120 MB',
              description: 'User segmentation by behavior.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'segment_name', type: 'TEXT' },
                { name: 'criteria', type: 'TEXT' }
              ],
              sampleData: [
                { id: 1, segment_name: 'High LTV', criteria: 'Total spend > $5000' },
                { id: 2, segment_name: 'Churn Risk', criteria: 'No activity > 30 days' },
              ]
            },
            {
              id: 'demographics',
              name: 'demographics',
              rowCount: 120,
              storageSize: '140 MB',
              description: 'Demographic profiles of user segments.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'segment_id', type: 'INT' },
                { name: 'age_range', type: 'VARCHAR' },
                { name: 'top_region', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, segment_id: 1, age_range: '25-45', top_region: 'North America' },
                { id: 2, segment_id: 2, age_range: '18-24', top_region: 'Europe' },
              ]
            },
            {
              id: 'engagement_data',
              name: 'engagement_data',
              rowCount: 890,
              storageSize: '120 MB',
              description: 'User engagement and session data.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'user_id', type: 'VARCHAR' },
                { name: 'last_session_duration', type: 'INT' },
                { name: 'clicks', type: 'INT' }
              ],
              sampleData: [
                { id: 1, user_id: 'U004', last_session_duration: 450, clicks: 12 },
                { id: 2, user_id: 'U005', last_session_duration: 120, clicks: 5 },
              ]
            },
          ]
        },
      ]
    },
    {
      id: 'hr_catalog',
      name: 'hr_catalog',
      description: 'Employee records, recruitment pipeline, and performance reviews.',
      schemas: [
        {
          id: 'employees',
          name: 'employees',
          description: 'Internal employee directory and payroll data.',
          owner: 'hr_dir',
          size: '420 MB',
          tables: [
            {
              id: 'employee_details',
              name: 'employee_details',
              rowCount: 1200,
              storageSize: '420 MB',
              description: 'Full employee profile information.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_name', type: 'TEXT' },
                { name: 'role', type: 'VARCHAR' },
                { name: 'department', type: 'VARCHAR' },
                { name: 'join_date', type: 'DATE' }
              ],
              sampleData: [
                { id: 1, employee_name: 'Sarah Chen', role: 'Lead Data Engineer', department: 'Data Science', join_date: '2021-03-15' },
                { id: 2, employee_name: 'Marco Russo', role: 'Product Designer', department: 'Design', join_date: '2022-07-22' },
              ]
            },
            {
              id: 'attendance',
              name: 'attendance',
              rowCount: 24000,
              storageSize: '180 MB',
              description: 'Employee attendance records.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_id', type: 'INT' },
                { name: 'date', type: 'DATE' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, employee_id: 1, date: '2024-03-18', status: 'Present' },
                { id: 2, employee_id: 2, date: '2024-03-18', status: 'Leave' },
              ]
            },
            {
              id: 'payroll',
              name: 'payroll',
              rowCount: 1200,
              storageSize: '95 MB',
              description: 'Salary and bonus information.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_id', type: 'INT' },
                { name: 'salary', type: 'DECIMAL' },
                { name: 'bonus', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, employee_id: 1, salary: 145000, bonus: 12000 },
                { id: 2, employee_id: 2, salary: 110000, bonus: 8000 },
              ]
            },
          ]
        },
        {
          id: 'recruitment',
          name: 'recruitment',
          description: 'Recruitment pipeline and candidate tracking.',
          owner: 'talent_mgr',
          size: '180 MB',
          tables: [
            {
              id: 'candidates',
              name: 'candidates',
              rowCount: 340,
              storageSize: '80 MB',
              description: 'Candidate applications and status.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'name', type: 'TEXT' },
                { name: 'position', type: 'VARCHAR' },
                { name: 'source', type: 'VARCHAR' },
                { name: 'status', type: 'VARCHAR' }
              ],
              sampleData: [
                { id: 1, name: 'Alice Smith', position: 'Data Engineer', source: 'LinkedIn', status: 'Interviewing' },
                { id: 2, name: 'Bob Jones', position: 'Frontend Developer', source: 'Referral', status: 'Under Review' },
              ]
            },
            {
              id: 'interviews',
              name: 'interviews',
              rowCount: 120,
              storageSize: '50 MB',
              description: 'Interview records and scores.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'candidate_id', type: 'INT' },
                { name: 'interviewer_id', type: 'INT' },
                { name: 'date', type: 'DATE' },
                { name: 'score', type: 'DECIMAL' }
              ],
              sampleData: [
                { id: 1, candidate_id: 1, interviewer_id: 1, date: '2024-03-20', score: 4.5 },
              ]
            },
            {
              id: 'job_openings',
              name: 'job_openings',
              rowCount: 15,
              storageSize: '50 MB',
              description: 'Active job postings.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'title', type: 'TEXT' },
                { name: 'location', type: 'VARCHAR' },
                { name: 'posted_at', type: 'DATE' }
              ],
              sampleData: [
                { id: 1, title: 'DevOps Lead', location: 'Remote', posted_at: '2024-03-10' },
                { id: 2, title: 'Product Manager', location: 'New York', posted_at: '2024-03-12' },
              ]
            },
          ]
        },
        {
          id: 'performance',
          name: 'performance',
          description: 'Employee performance reviews and ratings.',
          owner: 'hr_dir',
          size: '240 MB',
          tables: [
            {
              id: 'reviews',
              name: 'reviews',
              rowCount: 450,
              storageSize: '100 MB',
              description: 'Performance review cycles.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_id', type: 'INT' },
                { name: 'cycle', type: 'VARCHAR' },
                { name: 'rating_score', type: 'DECIMAL' },
                { name: 'comments', type: 'TEXT' }
              ],
              sampleData: [
                { id: 1, employee_id: 1, cycle: '2023-Q4', rating_score: 4.8, comments: 'Exceptional performance in warehouse migration.' },
              ]
            },
            {
              id: 'ratings',
              name: 'ratings',
              rowCount: 1200,
              storageSize: '80 MB',
              description: 'Current performance ratings.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_id', type: 'INT' },
                { name: 'current_rating', type: 'VARCHAR' },
                { name: 'tenure_months', type: 'INT' }
              ],
              sampleData: [
                { id: 1, employee_id: 1, current_rating: 'High Performer', tenure_months: 36 },
                { id: 2, employee_id: 2, current_rating: 'Strong Performer', tenure_months: 20 },
              ]
            },
            {
              id: 'promotions',
              name: 'promotions',
              rowCount: 85,
              storageSize: '60 MB',
              description: 'Promotion history records.',
              columns: [
                { name: 'id', type: 'INT PRIMARY KEY' },
                { name: 'employee_id', type: 'INT' },
                { name: 'from_role', type: 'VARCHAR' },
                { name: 'to_role', type: 'VARCHAR' },
                { name: 'effective_date', type: 'DATE' }
              ],
              sampleData: [
                { id: 1, employee_id: 1, from_role: 'Senior Data Engineer', to_role: 'Lead Data Engineer', effective_date: '2023-01-01' },
              ]
            },
          ]
        },
      ]
    }
  ],

  // ── Mock Volumes ──────────────────────────────────────────
  volumes: [
    { id: 'vol_1', filename: 'sales_q1_2024.csv', file_type: 'CSV', size_display: '2.4 MB', status: 'uploaded', uploaded_at: '2024-03-15T10:30:00Z' },
    { id: 'vol_2', filename: 'employee_data.csv', file_type: 'CSV', size_display: '1.1 MB', status: 'converted', uploaded_at: '2024-03-14T09:15:00Z' },
    { id: 'vol_3', filename: 'campaign_results.json', file_type: 'JSON', size_display: '890 KB', status: 'uploaded', uploaded_at: '2024-03-13T14:20:00Z' },
  ],

  // ── Mock Tags ─────────────────────────────────────────────
  tags: {
    'regional_sales_north_region': ['gold'],
    'regional_sales_south_region': ['silver'],
    'customers_customer_details': ['gold', 'bronze'],
    'campaigns_ad_campaigns': ['silver'],
    'employees_employee_details': ['bronze'],
  },

  // ── Mock Dashboard Activity ───────────────────────────────
  recentActivity: [
    { name: 'north_region', schema: 'regional_sales', lastAccessed: '2 mins ago', size: '1.2 GB', type: 'Table' },
    { name: 'customer_details', schema: 'customers', lastAccessed: '1 hour ago', size: '1.1 GB', type: 'Table' },
    { name: 'ad_campaigns', schema: 'campaigns', lastAccessed: '3 hours ago', size: '340 MB', type: 'Table' },
    { name: 'employee_details', schema: 'employees', lastAccessed: 'Yesterday', size: '420 MB', type: 'Table' },
  ],

  dashboardActivity: [
    { id: 1, type: 'table', detail: 'Table north_region injected to warehouse', timestamp: new Date(Date.now() - 120000).toISOString(), duration: 1.23 },
    { id: 2, type: 'query', detail: 'SELECT * FROM north_region executed', timestamp: new Date(Date.now() - 300000).toISOString(), duration: 0.45 },
    { id: 3, type: 'export', detail: 'Exported customer_details as CSV', timestamp: new Date(Date.now() - 600000).toISOString(), duration: 2.10 },
    { id: 4, type: 'table', detail: 'Table ad_campaigns injected to warehouse', timestamp: new Date(Date.now() - 900000).toISOString(), duration: 0.89 },
    { id: 5, type: 'query', detail: 'SELECT COUNT(*) FROM employee_details', timestamp: new Date(Date.now() - 1800000).toISOString(), duration: 0.12 },
  ],
};

// ── Helper: generate CSV string from sampleData ─────────────
export function generateCSV(columns, sampleData) {
  if (!sampleData || sampleData.length === 0) return '';
  const colNames = columns.map(c => c.name);
  const header = colNames.join(',');
  const rows = sampleData.map(row => colNames.map(col => JSON.stringify(row[col] ?? '')).join(','));
  return [header, ...rows].join('\n');
}

// ── Helper: generate JSON string from sampleData ────────────
export function generateJSON(sampleData) {
  return JSON.stringify(sampleData || [], null, 2);
}

// ── Helper: download a string as a file ─────────────────────
export function downloadAsFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
