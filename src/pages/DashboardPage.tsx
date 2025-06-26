import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import PerformanceChart from '@/components/charts/PerformanceChart';

// Mock data with realistic hedge fund metrics
const portfolioData = {
  totalAum: 2400000000,
  dailyChange: 2.5,
  ytdReturn: 12.4,
  benchmarkReturn: 11.2,
  sharpeRatio: 1.8,
  maxDrawdown: -8.2,
  activeInvestors: 1247,
  newInvestors: 12,
  openPositions: 156,
  longPositions: 23,
  shortPositions: 133,
  cashPosition: 5.2,
  leverage: 1.4
};

const recentTrades = [
  { id: 1, symbol: 'AAPL', side: 'buy', quantity: 1000, price: 185.50, timestamp: '2 hours ago', pnl: 2500 },
  { id: 2, symbol: 'TSLA', side: 'sell', quantity: 500, price: 245.75, timestamp: '4 hours ago', pnl: -1200 },
  { id: 3, symbol: 'NVDA', side: 'buy', quantity: 200, price: 890.25, timestamp: '6 hours ago', pnl: 8500 },
  { id: 4, symbol: 'MSFT', side: 'buy', quantity: 800, price: 415.30, timestamp: '8 hours ago', pnl: 3200 },
  { id: 5, symbol: 'GOOGL', side: 'sell', quantity: 300, price: 165.80, timestamp: '12 hours ago', pnl: -800 }
];

const topHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', weight: 8.5, return: 15.2, value: 204000000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', weight: 7.8, return: 12.8, value: 187200000 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', weight: 6.2, return: 45.6, value: 148800000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 5.9, return: 8.4, value: 141600000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 5.1, return: 22.1, value: 122400000 }
];

const performanceData = [
  { month: 'Jan', return: 2.1, benchmark: 1.8 },
  { month: 'Feb', return: -1.2, benchmark: -0.8 },
  { month: 'Mar', return: 3.4, benchmark: 2.9 },
  { month: 'Apr', return: 1.8, benchmark: 1.5 },
  { month: 'May', return: -0.5, benchmark: -0.3 },
  { month: 'Jun', return: 2.7, benchmark: 2.2 },
  { month: 'Jul', return: 1.9, benchmark: 1.6 },
  { month: 'Aug', return: -1.1, benchmark: -0.9 },
  { month: 'Sep', return: 2.3, benchmark: 1.9 },
  { month: 'Oct', return: 1.5, benchmark: 1.2 },
  { month: 'Nov', return: 3.1, benchmark: 2.6 },
  { month: 'Dec', return: 2.8, benchmark: 2.3 }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [filteredPerformanceData, setFilteredPerformanceData] = useState(performanceData);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getFilteredData = () => {
      switch (selectedTimeframe) {
        case '1M':
          return performanceData.slice(-1);
        case '3M':
          return performanceData.slice(-3);
        case '6M':
          return performanceData.slice(-6);
        case '1Y':
        case 'ALL':
        default:
          return performanceData;
      }
    };
    setFilteredPerformanceData(getFilteredData());
  }, [selectedTimeframe]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshKey(prev => prev + 1);
    }, 1000);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName}. Here's your portfolio overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalAum)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {portfolioData.dailyChange >= 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              {formatPercentage(portfolioData.dailyChange)} from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(portfolioData.ytdReturn)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500">+{formatPercentage(portfolioData.ytdReturn - portfolioData.benchmarkReturn)}</span>
              <span className="mx-1">vs</span>
              <span>Benchmark ({formatPercentage(portfolioData.benchmarkReturn)})</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.sharpeRatio}</div>
            <div className="text-xs text-muted-foreground">
              Risk-adjusted return
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.openPositions}</div>
            <div className="text-xs text-muted-foreground">
              {portfolioData.longPositions} long, {portfolioData.shortPositions} short
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Monthly performance vs benchmark</CardDescription>
              </div>
              <div className="flex space-x-1">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={filteredPerformanceData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${trade.side === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{trade.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {trade.quantity} shares @ ${trade.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(trade.pnl)}
                    </p>
                    <p className="text-xs text-muted-foreground">{trade.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Holdings and Risk Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
            <CardDescription>Largest portfolio positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topHoldings.map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{holding.symbol}</p>
                      <p className="text-xs text-muted-foreground">{holding.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(holding.value)}</p>
                    <p className={`text-xs ${holding.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(holding.return)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
            <CardDescription>Portfolio risk indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Max Drawdown</span>
                <Badge variant={portfolioData.maxDrawdown > -10 ? "default" : "destructive"}>
                  {formatPercentage(portfolioData.maxDrawdown)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cash Position</span>
                <span className="text-sm font-medium">{formatPercentage(portfolioData.cashPosition)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Leverage</span>
                <Badge variant={portfolioData.leverage > 1.5 ? "destructive" : "default"}>
                  {portfolioData.leverage}x
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Equity Exposure</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fixed Income</span>
                  <span>20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Alternatives</span>
                  <span>10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 