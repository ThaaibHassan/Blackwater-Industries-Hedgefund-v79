import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
  BarChart3,
  X,
  Save,
  Activity
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

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
  const { toast } = useToast();

  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    side: 'buy' as const,
    quantity: 0,
    price: 0,
    type: 'market' as const,
    strategy: 'momentum'
  });

  // Mock data - FIXED: Define trades array first
  const initialTrades = [
    {
      id: 1,
      symbol: 'AAPL',
      side: 'buy',
      quantity: 100,
      price: 175.50,
      totalValue: 17550,
      pnl: 1000,
      status: 'executed',
      type: 'market',
      strategy: 'momentum',
      analyst: 'John Smith',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      symbol: 'TSLA',
      side: 'sell',
      quantity: 50,
      price: 245.75,
      totalValue: 12287.5,
      pnl: -500,
      status: 'executed',
      type: 'limit',
      strategy: 'mean-reversion',
      analyst: 'Sarah Johnson',
      timestamp: '2024-01-14T14:20:00Z'
    },
    {
      id: 3,
      symbol: 'NVDA',
      side: 'buy',
      quantity: 200,
      price: 850.00,
      totalValue: 170000,
      pnl: 2000,
      status: 'pending',
      type: 'limit',
      strategy: 'growth',
      analyst: 'Mike Chen',
      timestamp: '2024-01-13T09:15:00Z'
    }
  ];

  // FIXED: Use initialTrades instead of trades
  const [trades, setTrades] = useState(initialTrades);

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
      case 'executed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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

  const handleViewTrade = (trade: any) => {
    toast({
      title: "Trade Details",
      description: `Viewing details for ${trade.symbol} trade`,
    });
  };

  const handleEditTrade = (trade: any) => {
    setNewTrade({
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.quantity,
      price: trade.price,
      type: trade.type,
      strategy: trade.strategy
    });
    setEditingTradeId(trade.id);
    setIsAddingTrade(true);
  };

  const handleDeleteTrade = (trade: any) => {
    if (confirm(`Are you sure you want to delete this ${trade.symbol} trade?`)) {
      setTrades(trades.filter(t => t.id !== trade.id));
      toast({
        title: "Trade Deleted",
        description: `${trade.symbol} trade has been removed.`,
      });
    }
  };

  const handleExportTrades = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Symbol,Side,Quantity,Price,Value,Status,Type\n"
      + trades.map(t => 
          `${t.timestamp},${t.symbol},${t.side},${t.quantity},${t.price},${t.totalValue},${t.status},${t.type}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trades_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Trades Exported",
      description: "Trade data has been exported to CSV file.",
    });
  };

  const handleAddTrade = () => {
    console.log('handleAddTrade called'); // Debug log
    setIsAddingTrade(true);
    setEditingTradeId(null);
    setNewTrade({
      symbol: '',
      side: 'buy',
      quantity: 0,
      price: 0,
      type: 'market',
      strategy: 'momentum'
    });
  };

  const handleSaveTrade = () => {
    if (newTrade.symbol && newTrade.quantity > 0 && newTrade.price > 0) {
      const trade = {
        id: Date.now(),
        ...newTrade,
        totalValue: newTrade.quantity * newTrade.price,
        pnl: 0,
        status: 'pending',
        analyst: 'Current User',
        timestamp: new Date().toISOString()
      };
      setTrades([...trades, trade]);
      setIsAddingTrade(false);
      setNewTrade({
        symbol: '',
        side: 'buy',
        quantity: 0,
        price: 0,
        type: 'market',
        strategy: 'momentum'
      });
      toast({
        title: "Trade Added",
        description: `${newTrade.side.toUpperCase()} ${newTrade.quantity} shares of ${newTrade.symbol} at $${newTrade.price}`,
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTrade = () => {
    if (editingTradeId && newTrade.symbol && newTrade.quantity > 0 && newTrade.price > 0) {
      setTrades(trades.map(trade => 
        trade.id === editingTradeId 
          ? { 
              ...trade, 
              ...newTrade, 
              totalValue: newTrade.quantity * newTrade.price 
            }
          : trade
      ));
      setIsAddingTrade(false);
      setEditingTradeId(null);
      setNewTrade({
        symbol: '',
        side: 'buy',
        quantity: 0,
        price: 0,
        type: 'market',
        strategy: 'momentum'
      });
      toast({
        title: "Trade Updated",
        description: `${newTrade.symbol} trade has been updated.`,
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleCancelForm = () => {
    setIsAddingTrade(false);
    setEditingTradeId(null);
    setNewTrade({
      symbol: '',
      side: 'buy',
      quantity: 0,
      price: 0,
      type: 'market',
      strategy: 'momentum'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Operations</h1>
          <p className="text-muted-foreground">
            Monitor and execute trading activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportTrades}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddTrade} disabled={isAddingTrade}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Trading Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Trading activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executedTrades}</div>
            <p className="text-xs text-muted-foreground">
              Completed trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(trades.reduce((sum, t) => sum + t.totalValue, 0))}</div>
            <p className="text-xs text-muted-foreground">
              Trade volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnl)}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit & Loss
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="executed">Executed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger id="strategy" className="w-full">
                  <SelectValue placeholder="All Strategies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="side">Side</Label>
              <Select value={selectedSide} onValueChange={setSelectedSide}>
                <SelectTrigger id="side" className="w-full">
                  <SelectValue placeholder="All Sides" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sides</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Date</SelectItem>
                  <SelectItem value="pnl">P&L</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="symbol">Symbol</SelectItem>
                </SelectContent>
              </Select>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTrade(trade)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTrade(trade)}
                          title="Edit Trade"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteTrade(trade)}
                          title="Delete Trade"
                          className="text-red-600 hover:text-red-700"
                        >
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

      {/* INLINE TRADE FORM */}
      {isAddingTrade && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingTradeId ? 'Edit Trade' : 'Add New Trade'}
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol *</Label>
                  <Input
                    id="symbol"
                    value={newTrade.symbol}
                    onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value.toUpperCase() })}
                    placeholder="Enter stock symbol"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="side">Side</Label>
                  <Select value={newTrade.side} onValueChange={(value: 'buy' | 'sell') => setNewTrade({ ...newTrade, side: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newTrade.quantity}
                    onChange={(e) => setNewTrade({ ...newTrade, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter quantity"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newTrade.price}
                    onChange={(e) => setNewTrade({ ...newTrade, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newTrade.type} onValueChange={(value: 'market' | 'limit') => setNewTrade({ ...newTrade, type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select value={newTrade.strategy} onValueChange={(value) => setNewTrade({ ...newTrade, strategy: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={editingTradeId ? handleUpdateTrade : handleSaveTrade} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingTradeId ? 'Update Trade' : 'Add Trade'}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradesPage; 