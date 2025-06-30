import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { 
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  X,
  Save
} from 'lucide-react';

// Mock portfolio data
const portfolioPositions = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    side: 'long',
    quantity: 1000,
    avgPrice: 175.50,
    currentPrice: 185.50,
    marketValue: 185500,
    unrealizedPnl: 10000,
    pnlPercent: 5.7,
    weight: 15.2,
    sector: 'Technology',
    risk: 'medium'
  },
  {
    id: 2,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    side: 'long',
    quantity: 500,
    avgPrice: 220.00,
    currentPrice: 245.75,
    marketValue: 122875,
    unrealizedPnl: 12875,
    pnlPercent: 11.7,
    weight: 10.1,
    sector: 'Consumer Discretionary',
    risk: 'high'
  },
  {
    id: 3,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    side: 'long',
    quantity: 200,
    avgPrice: 850.00,
    currentPrice: 890.25,
    marketValue: 178050,
    unrealizedPnl: 8050,
    pnlPercent: 4.7,
    weight: 14.6,
    sector: 'Technology',
    risk: 'high'
  },
  {
    id: 4,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    side: 'long',
    quantity: 800,
    avgPrice: 400.00,
    currentPrice: 415.30,
    marketValue: 332240,
    unrealizedPnl: 12240,
    pnlPercent: 3.8,
    weight: 27.3,
    sector: 'Technology',
    risk: 'medium'
  },
  {
    id: 5,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    side: 'short',
    quantity: 300,
    avgPrice: 170.00,
    currentPrice: 165.80,
    marketValue: 49740,
    unrealizedPnl: 1260,
    pnlPercent: 2.5,
    weight: 4.1,
    sector: 'Technology',
    risk: 'medium'
  }
];

const sectorAllocation = [
  { sector: 'Technology', weight: 71.2, return: 6.2 },
  { sector: 'Consumer Discretionary', weight: 10.1, return: 11.7 },
  { sector: 'Healthcare', weight: 8.5, return: -2.1 },
  { sector: 'Financials', weight: 6.2, return: 1.8 },
  { sector: 'Other', weight: 4.0, return: 0.5 }
];

const PortfolioPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('weight');
  const { toast } = useToast();

  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    name: '',
    side: 'long' as const,
    quantity: 0,
    avgPrice: 0,
    currentPrice: 0,
    sector: 'Technology',
    risk: 'medium' as const
  });

  const filteredPositions = portfolioPositions.filter(position => {
    const matchesSearch = position.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || position.sector === selectedSector;
    const matchesRisk = selectedRisk === 'all' || position.risk === selectedRisk;
    
    return matchesSearch && matchesSector && matchesRisk;
  });

  const sortedPositions = [...filteredPositions].sort((a, b) => {
    switch (sortBy) {
      case 'weight':
        return b.weight - a.weight;
      case 'pnl':
        return b.unrealizedPnl - a.unrealizedPnl;
      case 'pnlPercent':
        return b.pnlPercent - a.pnlPercent;
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  const totalValue = portfolioPositions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalPnl = portfolioPositions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const totalPnlPercent = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPosition = (position: any) => {
    toast({
      title: "Position Details",
      description: `Viewing details for ${position.symbol}`,
    });
  };

  const handleEditPosition = (position: any) => {
    setNewPosition({
      symbol: position.symbol,
      name: position.name,
      side: position.side,
      quantity: position.quantity,
      avgPrice: position.avgPrice,
      currentPrice: position.currentPrice,
      sector: position.sector,
      risk: position.risk
    });
    setEditingPositionId(position.id);
    setIsAddingPosition(true);
  };

  const handleDeletePosition = (position: any) => {
    if (confirm(`Are you sure you want to close the ${position.symbol} position?`)) {
      toast({
        title: "Position Closed",
        description: `${position.symbol} position has been closed.`,
      });
    }
  };

  const handleExportPortfolio = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Symbol,Name,Side,Quantity,Avg Price,Current Price,Market Value,Unrealized PnL,PnL %\n"
      + portfolioPositions.map(p => 
          `${p.symbol},${p.name},${p.side},${p.quantity},${p.avgPrice},${p.currentPrice},${p.marketValue},${p.unrealizedPnl},${p.pnlPercent}%`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "portfolio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Portfolio Exported",
      description: "Portfolio data has been exported to CSV file.",
    });
  };

  const handleAddPosition = () => {
    setIsAddingPosition(true);
    setEditingPositionId(null);
    setNewPosition({
      symbol: '',
      name: '',
      side: 'long',
      quantity: 0,
      avgPrice: 0,
      currentPrice: 0,
      sector: 'Technology',
      risk: 'medium'
    });
  };

  const handleSavePosition = () => {
    if (newPosition.symbol && newPosition.name && newPosition.quantity > 0 && newPosition.avgPrice > 0) {
      toast({
        title: "Position Added",
        description: `${newPosition.quantity} shares of ${newPosition.symbol} added to portfolio.`,
      });
      setIsAddingPosition(false);
      setNewPosition({
        symbol: '',
        name: '',
        side: 'long',
        quantity: 0,
        avgPrice: 0,
        currentPrice: 0,
        sector: 'Technology',
        risk: 'medium'
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePosition = () => {
    if (editingPositionId && newPosition.symbol && newPosition.name && newPosition.quantity > 0 && newPosition.avgPrice > 0) {
      toast({
        title: "Position Updated",
        description: `${newPosition.symbol} position has been updated.`,
      });
      setIsAddingPosition(false);
      setEditingPositionId(null);
      setNewPosition({
        symbol: '',
        name: '',
        side: 'long',
        quantity: 0,
        avgPrice: 0,
        currentPrice: 0,
        sector: 'Technology',
        risk: 'medium'
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
    setIsAddingPosition(false);
    setEditingPositionId(null);
    setNewPosition({
      symbol: '',
      name: '',
      side: 'long',
      quantity: 0,
      avgPrice: 0,
      currentPrice: 0,
      sector: 'Technology',
      risk: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage investment positions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportPortfolio} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddPosition} disabled={isAddingPosition}>
            <Plus className="mr-2 h-4 w-4" />
            Add Position
          </Button>
        </div>
      </div>

      {/* INLINE POSITION FORM */}
      {isAddingPosition && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingPositionId ? 'Edit Position' : 'Add New Position'}
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    value={newPosition.symbol}
                    onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })}
                    placeholder="Enter stock symbol"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={newPosition.name}
                    onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
                    placeholder="Enter company name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="side">Side</Label>
                  <Select value={newPosition.side} onValueChange={(value: 'long' | 'short') => setNewPosition({ ...newPosition, side: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newPosition.quantity}
                    onChange={(e) => setNewPosition({ ...newPosition, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter quantity"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="avgPrice">Average Price *</Label>
                  <Input
                    id="avgPrice"
                    type="number"
                    step="0.01"
                    value={newPosition.avgPrice}
                    onChange={(e) => setNewPosition({ ...newPosition, avgPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPrice">Current Price</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={newPosition.currentPrice}
                    onChange={(e) => setNewPosition({ ...newPosition, currentPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter current price"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Select value={newPosition.sector} onValueChange={(value) => setNewPosition({ ...newPosition, sector: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Financials">Financials</SelectItem>
                      <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select value={newPosition.risk} onValueChange={(value: 'low' | 'medium' | 'high') => setNewPosition({ ...newPosition, risk: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={editingPositionId ? handleUpdatePosition : handleSavePosition} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingPositionId ? 'Update Position' : 'Add Position'}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <div className={`text-xs ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(totalPnlPercent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnl)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(totalPnlPercent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              Active positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioPositions.filter(p => p.unrealizedPnl > 0).length}/{portfolioPositions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Profitable positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
              <Label htmlFor="sector">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financials">Financials</SelectItem>
                  <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk">Risk Level</Label>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger id="risk">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="pnl">P&L</SelectItem>
                  <SelectItem value="pnlPercent">P&L %</SelectItem>
                  <SelectItem value="symbol">Symbol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Positions</CardTitle>
          <CardDescription>
            {filteredPositions.length} of {portfolioPositions.length} positions shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Side</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Avg Price</th>
                  <th className="text-right p-2">Current Price</th>
                  <th className="text-right p-2">Market Value</th>
                  <th className="text-right p-2">Unrealized P&L</th>
                  <th className="text-right p-2">P&L %</th>
                  <th className="text-left p-2">Weight</th>
                  <th className="text-left p-2">Sector</th>
                  <th className="text-left p-2">Risk</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.map((position) => (
                  <tr key={position.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="font-medium">{position.symbol}</div>
                    </td>
                    <td className="p-2">{position.name}</td>
                    <td className="p-2">
                      <Badge variant={position.side === 'long' ? 'default' : 'secondary'}>
                        {position.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">{position.quantity.toLocaleString()}</td>
                    <td className="p-2 text-right">${position.avgPrice.toFixed(2)}</td>
                    <td className="p-2 text-right">${position.currentPrice.toFixed(2)}</td>
                    <td className="p-2 text-right">{formatCurrency(position.marketValue)}</td>
                    <td className="p-2 text-right">
                      <div className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(position.unrealizedPnl)}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div className={`font-medium ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(position.pnlPercent)}
                      </div>
                    </td>
                    <td className="p-2 text-right">{position.weight.toFixed(1)}%</td>
                    <td className="p-2">
                      <Badge variant="outline">{position.sector}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getRiskColor(position.risk)}>
                        {position.risk}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPosition(position)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPosition(position)}
                          title="Edit Position"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePosition(position)}
                          title="Close Position"
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

      {/* Sector Allocation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>Portfolio allocation by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectorAllocation.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sector.sector}</span>
                    <span className="text-sm text-muted-foreground">{sector.weight}%</span>
                  </div>
                  <Progress value={sector.weight} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Return</span>
                    <span className={sector.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(sector.return)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Portfolio performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Return</span>
                <span className={`font-medium ${totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(totalPnlPercent)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sharpe Ratio</span>
                <span className="font-medium">1.24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Max Drawdown</span>
                <span className="font-medium text-red-600">-8.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Volatility</span>
                <span className="font-medium">12.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPage; 