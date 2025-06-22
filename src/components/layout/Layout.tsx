import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main content area - pushed to the right */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className={cn(
          "flex-1 p-4 md:p-6 overflow-y-auto",
          theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 