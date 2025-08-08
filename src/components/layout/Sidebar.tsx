import React, { useState } from 'react';
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
  ChevronRight,
  ChevronDown,
  Brain,
  CreditCard,
  Leaf,
  Gauge,
  ArrowUpDown,
  Database,
  UserCheck,
  Target,
  PieChart,
  Globe,
  Briefcase,
  Zap,
  BarChart,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FolderOpen,
  UserPlus,
  Cog,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import Logo from '@/components/ui/logo';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
  isOpen?: boolean;
  priority?: number; // For sorting
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: string;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Executive Dashboard']));

  const toggleSection = (sectionTitle: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionTitle)) {
      // If clicking on an already open section, close it
      newOpenSections.delete(sectionTitle);
    } else {
      // If opening a new section, close all others and open only this one
      newOpenSections.clear();
      newOpenSections.add(sectionTitle);
    }
    setOpenSections(newOpenSections);
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Executive Dashboard',
      icon: LayoutDashboard,
      priority: 1,
      items: [
        { 
          title: 'Overview', 
          href: '/dashboard', 
          icon: LayoutDashboard,
          description: 'Key performance metrics and insights'
        },
        { 
          title: 'Trading Platforms', 
          href: '/mt5', 
          icon: Activity,
          description: 'MetaTrader 5 and Myfxbook integration for comprehensive trading management'
        },
      ]
    },
    {
      title: 'Trading & Portfolio',
      icon: TrendingUp,
      priority: 2,
      items: [
        { 
          title: 'Portfolio Management', 
          href: '/portfolio', 
          icon: Wallet,
          description: 'Portfolio allocation and rebalancing'
        },
        { 
          title: 'Trading Execution', 
          href: '/trading-ems', 
          icon: ArrowUpDown,
          description: 'Order management and execution'
        },
        { 
          title: 'Trade History', 
          href: '/trades', 
          icon: TrendingDown,
          description: 'Historical trade analysis'
        },
        { 
          title: 'Performance Analytics', 
          href: '/performance-attribution', 
          icon: BarChart,
          description: 'Performance attribution and analysis'
        },
      ]
    },
    {
      title: 'Research & Analytics',
      icon: Search,
      priority: 3,
      items: [
        { 
          title: 'Market Research', 
          href: '/research', 
          icon: Search,
          description: 'Market analysis and insights'
        },
        { 
          title: 'Market Screener', 
          href: '/screener', 
          icon: BarChart3,
          description: 'Advanced market screening tools'
        },
        { 
          title: 'AI Insights', 
          href: '/ai-insights', 
          icon: Brain,
          description: 'AI-powered market predictions'
        },
      ]
    },
    {
      title: 'Risk & Compliance',
      icon: Shield,
      priority: 4,
      items: [
        { 
          title: 'Risk Management', 
          href: '/risk-management', 
          icon: Gauge,
          description: 'Risk monitoring and controls'
        },
        { 
          title: 'Credit Analysis', 
          href: '/credit-analysis', 
          icon: CreditCard,
          description: 'Credit risk assessment'
        },
        { 
          title: 'ESG & Climate Risk', 
          href: '/esg', 
          icon: Leaf,
          description: 'Environmental and social governance'
        },
        { 
          title: 'Compliance', 
          href: '/compliance', 
          icon: Shield,
          description: 'Regulatory compliance monitoring'
        },
      ]
    },
    {
      title: 'Client Relations',
      icon: Users,
      priority: 5,
      items: [
        { 
          title: 'Investor Portal', 
          href: '/investor-portal', 
          icon: Users,
          description: 'Investor relationship management'
        },
        { 
          title: 'Investor Directory', 
          href: '/investors', 
          icon: UserPlus,
          description: 'Investor database and profiles'
        },
      ]
    },
    {
      title: 'Operations',
      icon: Briefcase,
      priority: 6,
      items: [
        { 
          title: 'Reporting', 
          href: '/reports', 
          icon: FileText,
          description: 'Financial and performance reports'
        },
        { 
          title: 'Data Management', 
          href: '/data-ingestion', 
          icon: Database,
          description: 'Data ingestion and processing'
        },
        { 
          title: 'Task Management', 
          href: '/tasks', 
          icon: Calendar,
          description: 'Task tracking and workflow'
        },
      ]
    },
    {
      title: 'Administration',
      icon: Cog,
      priority: 7,
      items: [
        { 
          title: 'User Management', 
          href: '/users', 
          icon: UserCheck, 
          role: 'admin',
          description: 'User access and permissions'
        },
        { 
          title: 'System Settings', 
          href: '/settings', 
          icon: Settings,
          description: 'Platform configuration'
        },
      ]
    }
  ];

  const getMenuSections = () => {
    return menuSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => !item.role || user?.role === item.role)
      }))
      .filter(section => section.items.length > 0)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={cn(
        "w-64 h-screen fixed left-0 top-0 z-30 flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        "border-border shadow-lg"
      )}>
        {/* Logo and Close button */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg text-foreground">Blackwater</h1>
              <p className="text-xs text-muted-foreground">Capital Management</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {getMenuSections().map((section) => {
            const SectionIcon = section.icon;
            const isOpen = openSections.has(section.title);
            
            return (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-4 h-4 transition-transform duration-200" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <div className="transition-transform duration-200">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {/* Section Items */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="ml-6 space-y-1 pt-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                              "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                              "focus:outline-none focus:ring-2 focus:ring-primary/20",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground"
                            )
                          }
                        >
                          <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                          <span className="flex-1">{item.title}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        
        {/* User Info */}
        <div className="p-4 border-t border-border bg-background/80 backdrop-blur">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50 hover:bg-accent/70 transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-110">
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
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded-md hover:bg-accent-foreground/10 transition-colors duration-200">
                <Bell className="w-3 h-3 text-muted-foreground" />
              </button>
              <button className="p-1 rounded-md hover:bg-accent-foreground/10 transition-colors duration-200">
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 