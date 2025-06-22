import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  LineChart,
  Search,
  Settings,
  Shield,
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  Database,
  PieChart
} from 'lucide-react';

const Sidebar = () => {
  const { user, hasPermission } = useAuth();
  const { theme } = useTheme();

  // Simple test - just show basic navigation
  const menuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Portfolio', href: '/portfolio', icon: Wallet },
    { title: 'Trades', href: '/trades', icon: TrendingUp },
    { title: 'Research', href: '/research', icon: Search },
    { title: 'Investors', href: '/investors', icon: Users },
    { title: 'Reports', href: '/reports', icon: FileText },
    { title: 'Compliance', href: '/compliance', icon: Shield },
    { title: 'Tasks', href: '/tasks', icon: Calendar },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "w-64 h-screen fixed left-0 top-0 z-50 flex flex-col border-r",
      theme === 'dark' 
        ? "bg-gray-900 border-gray-700 text-white" 
        : "bg-white border-gray-200 text-gray-900"
    )}>
      {/* Logo */}
      <div className={cn(
        "p-6 border-b",
        theme === 'dark' ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
      )}>
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            theme === 'dark' ? "bg-blue-600" : "bg-blue-600"
          )}>
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Blackwater</h1>
            <p className={cn(
              "text-xs",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>Hedge Fund</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : cn(
                        "hover:bg-gray-100",
                        theme === 'dark' 
                          ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                          : "text-gray-700 hover:text-gray-900"
                      )
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* User Info */}
      <div className={cn(
        "p-4 border-t",
        theme === 'dark' ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
      )}>
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            theme === 'dark' ? "bg-gray-600 text-gray-200" : "bg-gray-300 text-gray-700"
          )}>
            {user?.displayName?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              theme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {user?.displayName || 'Admin User'}
            </p>
            <p className={cn(
              "text-xs truncate capitalize",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>
              {user?.role || 'admin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 