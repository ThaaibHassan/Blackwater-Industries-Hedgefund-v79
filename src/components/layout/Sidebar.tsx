import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Search, 
  Users, 
  FileText, 
  Shield, 
  Calendar, 
  Settings,
  X,
  Activity,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import Logo from '@/components/ui/logo';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Portfolio', href: '/portfolio', icon: Wallet },
    { title: 'Trades', href: '/trades', icon: TrendingUp },
    { title: 'Research', href: '/research', icon: Search },
    { title: 'Market Screener', href: '/screener', icon: BarChart3 },
    { title: 'Accounts', href: '/mt5', icon: Activity },
    { title: 'Investors', href: '/investors', icon: Users },
    { title: 'Reports', href: '/reports', icon: FileText },
    { title: 'Compliance', href: '/compliance', icon: Shield },
    { title: 'Tasks', href: '/tasks', icon: Calendar },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];
  
  const adminMenuItems = [
    { title: 'User Management', href: '/users', icon: Users, role: 'admin' }
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [...menuItems, ...adminMenuItems];
    }
    return menuItems;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={cn(
        "w-64 h-screen fixed left-0 top-0 z-30 flex flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        "border-border"
      )}>
        {/* Logo and Close button */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg text-foreground">Blackwater</h1>
              <p className="text-xs text-muted-foreground">Hedge Fund</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.title}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>
        
        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">
                {user?.displayName || 'Admin User'}
              </p>
              <p className="text-xs truncate capitalize text-muted-foreground">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 