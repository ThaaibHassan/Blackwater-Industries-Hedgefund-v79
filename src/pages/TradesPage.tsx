import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

// Mock trading data
const trades = [
  {
    id: 1,
    symbol: 'AAPL',
    side: 'buy',
    quantity: 1000,
    price: 185.50,
    totalValue: 185500,
    commission: 9.99,
    timestamp: '2024-01-15T10:30:00Z',
    status: 'executed',
    strategy: 'momentum',
    analyst: 'John Smith',
    notes: 'Strong earnings beat, technical breakout',
    tags: ['earnings', 'breakout', 'large-cap'],
    pnl: 2500,
    exitPrice: null,
    exitDate: null,
    holdingPeriod: null
  },
  {
    id: 2,
    symbol: 'TSLA',
    side: 'sell',
    quantity: 500,
    price: 245.75,
    totalValue: 122875,
    commission: 9.99,
    timestamp: '2024-01-15T14:15:00Z',
    status: 'executed',
    strategy: 'mean-reversion',
    analyst: 'Sarah Johnson',
    notes: 'Overbought conditions, taking profits',
    tags: ['profit-taking', 'technical', 'ev'],
    pnl: -1200,
    exitPrice: null,
    exitDate: null,
    holdingPeriod: null
  },
  {
    id: 3,
    symbol: 'NVDA',
    side: 'buy',
    quantity: 200,
    price: 890.25,
    totalValue: 178050,
    commission: 9.99,
    timestamp: '2024-01-14T09:45:00Z',
    status: 'executed',
    strategy: 'growth',
    analyst: 'Mike Chen',
    notes: 'AI momentum continues, strong fundamentals',
    tags: ['ai', 'growth', 'semiconductor'],
    pnl: 8500,
    exitPrice: null,
    exitDate: null,
    holdingPeriod: null
  },
  {
    id: 4,
    symbol: 'MSFT',
    side: 'buy',
    quantity: 800,
    price: 415.30,
    totalValue: 332240,
    commission: 9.99,
    timestamp: '2024-01-14T11:20:00Z',
    status: 'pending',
    strategy: 'value',
    analyst: 'Lisa Wang',
    notes: 'Cloud growth story intact',
    tags: ['cloud', 'value', 'dividend'],
    pnl: 0,
    exitPrice: null,
    exitDate: null,
    holdingPeriod: null
  },
  {
    id: 5,
    symbol: 'GOOGL',
    side: 'sell',
    quantity: 300,
    price: 165.80,
    totalValue: 49740,
    commission: 9.99,
    timestamp: '2024-01-13T16:00:00Z',
    status: 'cancelled',
    strategy: 'technical',
    analyst: 'David Kim',
    notes: 'Support level broken, stop loss',
    tags: ['stop-loss', 'technical', 'advertising'],
    pnl: -800,
    exitPrice: null,
    exitDate: null,
    holdingPeriod: null
  }
];

const strategies = [
  { name: 'momentum', description: 'Momentum Trading', winRate: 65, avgReturn: 2.1 },
  { name: 'mean-reversion', description: 'Mean Reversion', winRate: 58, avgReturn: 1.8 },
  { name: 'growth', description: 'Growth Investing', winRate: 72, avgReturn: 3.2 },
  { name: 'value', description: 'Value Investing', winRate: 61, avgReturn: 2.5 },
  { name: 'technical', description: 'Technical Analysis', winRate: 55, avgReturn: 1.5 }
];

const TradesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedSide, setSelectedSide] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || trade.status === selectedStatus;
    const matchesStrategy = selectedStrategy === 'all' || trade.strategy === selectedStrategy;
    const matchesSide = selectedSide === 'all' || trade.side === selectedSide;
    
    return matchesSearch && matchesStatus && matchesStrategy && matchesSide;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    switch (sortBy) {
      case 'timestamp':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'pnl':
        return b.pnl - a.pnl;
      case 'value':
        return b.totalValue - a.totalValue;
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  const totalTrades = trades.length;
  const executedTrades = trades.filter(t => t.status === 'executed').length;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = executedTrades > 0 ? 
    (trades.filter(t => t.status === 'executed' && t.pnl > 0).length / executedTrades * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'executed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Journal</h1>
          <p className="text-muted-foreground">
            Track trades, analyze performance, and manage strategies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Trading Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              {executedTrades} executed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnl)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {trades.filter(t => t.status === 'executed' && t.pnl > 0).length} of {executedTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnl / executedTrades)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per executed trade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="executed">Executed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <select
                id="strategy"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Strategies</option>
                <option value="momentum">Momentum</option>
                <option value="mean-reversion">Mean Reversion</option>
                <option value="growth">Growth</option>
                <option value="value">Value</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <div>
              <Label htmlFor="side">Side</Label>
              <select
                id="side"
                value={selectedSide}
                onChange={(e) => setSelectedSide(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Sides</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="timestamp">Date</option>
                <option value="pnl">P&L</option>
                <option value="value">Value</option>
                <option value="symbol">Symbol</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trading History</CardTitle>
          <CardDescription>
            {filteredTrades.length} of {trades.length} trades shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Side</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Value</th>
                  <th className="text-right p-2">P&L</th>
                  <th className="text-left p-2">Strategy</th>
                  <th className="text-left p-2">Analyst</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTrades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="font-medium">{trade.symbol}</div>
                    </td>
                    <td className="p-2">
                      <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                        {trade.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(trade.status)}
                        <Badge className={getStatusColor(trade.status)}>
                          {trade.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2 text-right">{trade.quantity.toLocaleString()}</td>
                    <td className="p-2 text-right">${trade.price.toFixed(2)}</td>
                    <td className="p-2 text-right">{formatCurrency(trade.totalValue)}</td>
                    <td className="p-2 text-right">
                      <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{trade.strategy}</Badge>
                    </td>
                    <td className="p-2">{trade.analyst}</td>
                    <td className="p-2">{formatDate(trade.timestamp)}</td>
                    <td className="p-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Performance</CardTitle>
            <CardDescription>Performance by trading strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div key={strategy.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{strategy.description}</div>
                    <div className="text-sm text-muted-foreground">
                      Win Rate: {strategy.winRate}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPercentage(strategy.avgReturn)}</div>
                    <div className="text-sm text-muted-foreground">Avg Return</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex items-center space-x-3 p-3 border rounded-lg">
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
                    <p className="text-xs text-muted-foreground">{formatDate(trade.timestamp)}</p>
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

export default TradesPage; 