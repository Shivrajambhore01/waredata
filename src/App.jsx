import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DataProvider } from "./context/DataContext";
import DashboardLayout from "./layout/DashboardLayout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboard Pages
import SqlLab from "./pages/SqlLab";
import QueryBuilderPage from "./pages/QueryBuilderPage";
import SavedQueriesPage from "./pages/SavedQueriesPage";
import DataInjectionPage from "./pages/DataInjectionPage";
import QueryHistoryPage from "./pages/QueryHistoryPage";
import Warehouse from "./pages/Warehouse";
import SchemaExplorerPage from "./pages/SchemaExplorerPage";
import Catalog from "./pages/Catalog";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>

          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route
            path="/sql-editor"
            element={
              <DashboardLayout>
                <SqlLab />
              </DashboardLayout>
            }
          />

          <Route
            path="/query-builder"
            element={
              <DashboardLayout>
                <QueryBuilderPage />
              </DashboardLayout>
            }
          />

          <Route
            path="/schema-preview"
            element={
              <DashboardLayout>
                <SchemaExplorerPage />
              </DashboardLayout>
            }
          />

          <Route
            path="/saved-queries"
            element={
              <DashboardLayout>
                <SavedQueriesPage />
              </DashboardLayout>
            }
          />

          <Route
            path="/query-history"
            element={
              <DashboardLayout>
                <QueryHistoryPage />
              </DashboardLayout>
            }
          />

          
          {/* Catalog */}
          <Route
            path="/catalog"
            element={
              <DashboardLayout>
                <Catalog />
              </DashboardLayout>
            }
          />
          {/* Workspace */}
          <Route
            path="/workspace"
            element={
              <DashboardLayout>
                <WorkspacePage />
              </DashboardLayout>
            }
          />

          {/* Warehouse */}
          <Route
            path="/warehouse"
            element={
              <DashboardLayout>
                <Warehouse />
              </DashboardLayout>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;