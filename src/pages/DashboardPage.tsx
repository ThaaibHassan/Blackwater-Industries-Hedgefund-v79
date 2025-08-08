import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useWatchlists } from '@/context/WatchlistContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  FileText,
  Activity,
  Target,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Plus,
  BarChart3,
  Brain,
  Shield,
  CreditCard,
  Leaf,
  Gauge,
  ArrowUpDown,
  Database,
  UserCheck,
  PieChart,
  Globe,
  Briefcase,
  Zap,
  BarChart,
  TrendingDown as TrendingDownIcon,
  AlertCircle,
  Star,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle,
  Play,
  Pause,
  StopCircle,
  RefreshCw,
  TrendingUp as TrendingUpIcon,
  Percent,
  Hash,
  Layers,
  Compass,
  Lightbulb,
  BookOpen,
  Search,
  Filter,
  Settings,
  Bell,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import AdvancedChart from '@/components/charts/AdvancedChart';
import { useState, useEffect } from 'react';
import React, { createContext, useContext } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const WatchlistWidget = () => {
  const { watchlists, loading, addAssetToWatchlist, removeAssetFromWatchlist } = useWatchlists();
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  if (loading) return <div>Loading watchlists...</div>;
  if (!watchlists.length) return <div>No watchlists found.</div>;
  const watchlist = watchlists[0];
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Watchlist: {watchlist.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (symbol && name) {
              await addAssetToWatchlist(watchlist.id, { symbol, name });
              setSymbol('');
              setName('');
            }
          }}
          className="flex gap-2 mb-4"
        >
          <input
            className="border rounded px-2 py-1"
            placeholder="Symbol"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button type="submit" size="sm">Add</Button>
        </form>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Symbol</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.assets.map(asset => (
              <tr key={asset.symbol}>
                <td className="p-2">{asset.symbol}</td>
                <td className="p-2">{asset.name}</td>
                <td className="p-2">
                  <Button size="sm" variant="destructive" onClick={() => removeAssetFromWatchlist(watchlist.id, asset.symbol)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

// Dashboard Widgets Context and Registry
interface DashboardWidgetConfig {
  id: string;
  type: string;
  title: string;
  component: React.FC;
}

const GlobalIndicesWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>Global Indices (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">S&P 500</div>
          <div>4,500.00</div>
        </div>
        <div>
          <div className="font-bold">NASDAQ</div>
          <div>14,000.00</div>
        </div>
        <div>
          <div className="font-bold">FTSE 100</div>
          <div>7,200.00</div>
        </div>
        <div>
          <div className="font-bold">NIKKEI 225</div>
          <div>32,000.00</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BondYieldsWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>Bond Yields (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">US 10Y</div>
          <div>4.25%</div>
        </div>
        <div>
          <div className="font-bold">US 2Y</div>
          <div>4.75%</div>
        </div>
        <div>
          <div className="font-bold">DE 10Y</div>
          <div>2.50%</div>
        </div>
        <div>
          <div className="font-bold">JP 10Y</div>
          <div>0.60%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FXHeatmapWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>FX Heatmap (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">EUR/USD</div>
          <div className="text-green-600">+0.45%</div>
        </div>
        <div>
          <div className="font-bold">USD/JPY</div>
          <div className="text-red-600">-0.20%</div>
        </div>
        <div>
          <div className="font-bold">GBP/USD</div>
          <div className="text-green-600">+0.30%</div>
        </div>
        <div>
          <div className="font-bold">AUD/USD</div>
          <div className="text-red-600">-0.10%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const widgetRegistry: DashboardWidgetConfig[] = [
  { id: 'advanced-chart', type: 'chart', title: 'Advanced Chart', component: AdvancedChart },
  { id: 'watchlist', type: 'watchlist', title: 'Watchlist', component: WatchlistWidget },
  { id: 'global-indices', type: 'indices', title: 'Global Indices', component: GlobalIndicesWidget },
  { id: 'bond-yields', type: 'bonds', title: 'Bond Yields', component: BondYieldsWidget },
  { id: 'fx-heatmap', type: 'fx', title: 'FX Heatmap', component: FXHeatmapWidget },
  // Add more widgets here (FX heatmap, etc.)
];

const DashboardWidgetsContext = createContext<DashboardWidgetConfig[]>(widgetRegistry);
export const useDashboardWidgets = () => useContext(DashboardWidgetsContext);

function SortableWidget({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

const WidgetPicker: React.FC<{
  widgetOrder: string[];
  setWidgetOrder: (ids: string[]) => void;
  enabledWidgets: Set<string>;
  setEnabledWidgets: (s: Set<string>) => void;
  widgetRegistry: DashboardWidgetConfig[];
}> = ({ widgetOrder, setWidgetOrder, enabledWidgets, setEnabledWidgets, widgetRegistry }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Customize Dashboard Widgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {widgetRegistry.map(w => (
            <label key={w.id} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={enabledWidgets.has(w.id)}
                onChange={e => {
                  const newSet = new Set(enabledWidgets);
                  if (e.target.checked) {
                    newSet.add(w.id);
                    // Add to order if not present
                    if (!widgetOrder.includes(w.id)) setWidgetOrder([...widgetOrder, w.id]);
                  } else {
                    newSet.delete(w.id);
                    setWidgetOrder(widgetOrder.filter(id => id !== w.id));
                  }
                  setEnabledWidgets(newSet);
                }}
              />
              {w.title}
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { 
    getPortfolioStats, 
    getTaskStats, 
    getInvestorStats, 
    getTradeStats,
    tasks,
    trades,
    researchNotes,
    investors,
    workflows,
    portfolioPositions
  } = useData();
  const { user } = useAuth();
  const { getDashboardLayout, setDashboardLayout } = useWatchlists();

  const portfolioStats = getPortfolioStats();
  const taskStats = getTaskStats();
  const investorStats = getInvestorStats();
  const tradeStats = getTradeStats();

  // Additional comprehensive stats
  const researchStats = {
    total: researchNotes.length,
    buy: researchNotes.filter(n => n.recommendation === 'buy').length,
    sell: researchNotes.filter(n => n.recommendation === 'sell').length,
    hold: researchNotes.filter(n => n.recommendation === 'hold').length,
    published: researchNotes.filter(n => n.status === 'published').length,
    inReview: researchNotes.filter(n => n.status === 'in_review').length,
    avgPriority: researchNotes.length > 0 ? 
      researchNotes.reduce((sum, n) => {
        const priorityScore = n.priority === 'urgent' ? 4 : n.priority === 'high' ? 3 : n.priority === 'medium' ? 2 : 1;
        return sum + priorityScore;
      }, 0) / researchNotes.length : 0
  };

  const workflowStats = {
    total: workflows.length,
    completed: workflows.filter(w => w.status === 'completed').length,
    inProgress: workflows.filter(w => w.status === 'in_progress').length,
    completionRate: workflows.length > 0 ? (workflows.filter(w => w.status === 'completed').length / workflows.length) * 100 : 0
  };

  const riskStats = {
    totalPositions: portfolioPositions.length,
    profitablePositions: portfolioPositions.filter(p => p.unrealizedPnl > 0).length,
    losingPositions: portfolioPositions.filter(p => p.unrealizedPnl < 0).length,
    avgPositionSize: portfolioPositions.length > 0 ? portfolioPositions.reduce((sum, p) => sum + p.marketValue, 0) / portfolioPositions.length : 0,
    largestPosition: portfolioPositions.length > 0 ? Math.max(...portfolioPositions.map(p => p.marketValue)) : 0
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const recentTasks = tasks.slice(0, 5);
  const recentTrades = trades.slice(0, 5);
  const recentResearch = researchNotes.slice(0, 3);
  const recentWorkflows = workflows.slice(0, 3);

  const [widgetOrder, setWidgetOrder] = React.useState(widgetRegistry.map(w => w.id));
  const [enabledWidgets, setEnabledWidgets] = React.useState<Set<string>>(new Set(widgetRegistry.map(w => w.id)));
  const sensors = useSensors(useSensor(PointerSensor));

  // Load layout from Firestore on mount
  useEffect(() => {
    (async () => {
      const layout = await getDashboardLayout();
      if (layout) {
        setWidgetOrder(layout.order);
        setEnabledWidgets(new Set(layout.enabled));
      }
    })();
    // eslint-disable-next-line
  }, []);
  // Save layout to Firestore on change
  useEffect(() => {
    setDashboardLayout(widgetOrder, Array.from(enabledWidgets));
    // eslint-disable-next-line
  }, [widgetOrder, enabledWidgets]);

  // Keep widgetOrder in sync with registry (if widgets are added/removed)
  useEffect(() => {
    setWidgetOrder(prev => widgetRegistry.map(w => w.id).filter(id => prev.includes(id)).concat(widgetRegistry.map(w => w.id).filter(id => !prev.includes(id))));
  }, [widgetRegistry.length]);

  const widgetsById = Object.fromEntries(widgetRegistry.map(w => [w.id, w]));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName}. Here's your comprehensive overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Primary Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.totalValue)}</div>
            <div className={`text-xs ${portfolioStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(portfolioStats.totalPnlPercent)}
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioStats.positions} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investorStats.active}</div>
            <div className="text-xs text-muted-foreground">
              of {investorStats.total} total
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(investorStats.totalCommitments)} committed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fund Allocation</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investorStats.allocationPercentage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(investorStats.totalAllocated)} allocated
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(investorStats.totalUnallocated)} unallocated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.pending}</div>
            <div className="text-xs text-muted-foreground">
              of {taskStats.total} total
            </div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completed} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Activity</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tradeStats.executed}</div>
            <div className="text-xs text-muted-foreground">
              of {tradeStats.total} total trades
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(tradeStats.totalValue)} volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Quality</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchStats.published}</div>
            <div className="text-xs text-muted-foreground">
              published ({researchStats.total} total)
            </div>
            <p className="text-xs text-muted-foreground">
              {researchStats.inReview} in review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflow Progress</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowStats.completionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              completion rate
            </div>
            <p className="text-xs text-muted-foreground">
              {workflowStats.completed} of {workflowStats.total} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskStats.profitablePositions}</div>
            <div className="text-xs text-muted-foreground">
              of {riskStats.totalPositions} profitable
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(riskStats.avgPositionSize)} avg position
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Real-time portfolio value and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioStats.totalValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Unrealized P&L</p>
                  <p className={`text-2xl font-bold ${portfolioStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(portfolioStats.totalPnl)}
                  </p>
                </div>
              </div>
              <Progress value={Math.abs(portfolioStats.totalPnlPercent)} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Performance</span>
                <span>{formatPercentage(portfolioStats.totalPnlPercent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Research Insights</CardTitle>
            <CardDescription>Latest research recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Buy</span>
                </div>
                <Badge variant="secondary">{researchStats.buy}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Sell</span>
                </div>
                <Badge variant="secondary">{researchStats.sell}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Pause className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Hold</span>
                </div>
                <Badge variant="secondary">{researchStats.hold}</Badge>
              </div>
              <Progress 
                value={(researchStats.buy / researchStats.total) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Activity Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Current task status and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <Badge variant="secondary">{taskStats.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">In Progress</span>
                </div>
                <Badge variant="secondary">{taskStats.inProgress}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Completed</span>
                </div>
                <Badge variant="secondary">{taskStats.completed}</Badge>
              </div>
              <Progress 
                value={(taskStats.completed / taskStats.total) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Summary</CardTitle>
            <CardDescription>Latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Executed</span>
                </div>
                <Badge variant="secondary">{tradeStats.executed}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <Badge variant="secondary">{tradeStats.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total Value</span>
                </div>
                <Badge variant="secondary">{formatCurrency(tradeStats.totalValue)}</Badge>
              </div>
              <Progress 
                value={(tradeStats.executed / tradeStats.total) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investor Status</CardTitle>
            <CardDescription>Investor relationship overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Active</span>
                </div>
                <Badge variant="secondary">{investorStats.active}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Allocated</span>
                </div>
                <Badge variant="secondary">{formatCurrency(investorStats.totalAllocated)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Unallocated</span>
                </div>
                <Badge variant="secondary">{formatCurrency(investorStats.totalUnallocated)}</Badge>
              </div>
              <Progress 
                value={investorStats.allocationPercentage} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Profile</CardTitle>
            <CardDescription>Portfolio risk metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Profitable</span>
                </div>
                <Badge variant="secondary">{riskStats.profitablePositions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDownIcon className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Losing</span>
                </div>
                <Badge variant="secondary">{riskStats.losingPositions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Avg Size</span>
                </div>
                <Badge variant="secondary">{formatCurrency(riskStats.avgPositionSize)}</Badge>
              </div>
              <Progress 
                value={(riskStats.profitablePositions / riskStats.totalPositions) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest task updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  {task.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : task.status === 'in_progress' ? (
                    <Activity className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${trade.side === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{trade.symbol} {trade.side}</p>
                    <p className="text-xs text-muted-foreground">
                      {trade.quantity} shares @ ${trade.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${(trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(trade.pnl)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Research</CardTitle>
            <CardDescription>Recent research publications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResearch.map((note) => (
                <div key={note.id} className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{note.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {(note.title ? note.title.substring(0, 50) : "Untitled")}...
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={note.recommendation === 'buy' ? 'default' : note.recommendation === 'hold' ? 'secondary' : note.recommendation === 'sell' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {(note.recommendation ? note.recommendation.toUpperCase() : 'N/A')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Status */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
            <CardDescription>Current workflow status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center space-x-3">
                  {workflow.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{workflow.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {workflow.assignee}
                    </p>
                  </div>
                  <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {workflow.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Win Rate</span>
                </div>
                <Badge variant="secondary">
                  {riskStats.totalPositions > 0 ? ((riskStats.profitablePositions / riskStats.totalPositions) * 100).toFixed(1) : 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Avg P&L</span>
                </div>
                <Badge variant="secondary">
                  {formatCurrency(portfolioStats.totalPnl / portfolioStats.positions)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">ROI</span>
                </div>
                <Badge variant="secondary">
                  {formatPercentage(portfolioStats.totalPnlPercent)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Trading System</span>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Data Feeds</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Risk Engine</span>
                </div>
                <Badge variant="default">Monitoring</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 