import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from '../components/shared/ToastContainer';
import '../styles/dashboard-theme.css';

const DashboardContent = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: 'var(--df-bg)',
        color: 'var(--df-text)',
      }}
    >
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main
          className="flex-1 overflow-auto df-page-enter df-scrollbar"
          style={{ backgroundColor: 'var(--df-bg-secondary)' }}
        >
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardContent>{children}</DashboardContent>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
