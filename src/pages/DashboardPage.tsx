import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
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
  CheckCircle
} from 'lucide-react';

const DashboardPage = () => {
  const { 
    getPortfolioStats, 
    getTaskStats, 
    getInvestorStats, 
    getTradeStats,
    tasks,
    trades,
    researchNotes,
    investors
  } = useData();
  const { user } = useAuth();

  const portfolioStats = getPortfolioStats();
  const taskStats = getTaskStats();
  const investorStats = getInvestorStats();
  const tradeStats = getTradeStats();

  const formatCurrency = (amount: number) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.displayName}. Here's what's happening today.
        </p>
      </div>

      {/* Key Metrics */}
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tradeStats.executed}</div>
            <div className="text-xs text-muted-foreground">
              of {tradeStats.total} total
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(tradeStats.totalPnl)} P&L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Views */}
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
                    <p className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                      {note.title.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={note.recommendation === 'buy' ? 'default' : note.recommendation === 'hold' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {note.recommendation.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 