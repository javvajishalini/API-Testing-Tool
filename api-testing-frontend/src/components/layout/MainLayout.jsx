import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-100 overflow-hidden">
      <Toaster position="bottom-right" />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
