import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main content area - pushed to the right */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className={cn(
          "flex-1 p-6 overflow-y-auto",
          theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 