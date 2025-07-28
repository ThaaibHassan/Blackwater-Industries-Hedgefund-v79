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
import { useData } from '@/context/DataContext';

const PortfolioPage = () => {
  const { portfolioPositions } = useData();
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
    side: 'long' as 'long' | 'short',
    quantity: 0,
    avgPrice: 0,
    currentPrice: 0,
    sector: 'Technology',
    risk: 'medium' as 'low' | 'medium' | 'high',
  });

  const filteredPositions = portfolioPositions.filter(position => {
    const matchesSearch = (position.symbol || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (position.name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    setEditingPositionId(position.id);
    setNewPosition({
      symbol: position.symbol,
      name: position.name,
      side: position.side,
      quantity: position.quantity,
      avgPrice: position.avgPrice,
      currentPrice: position.currentPrice,
      sector: position.sector,
      risk: position.risk,
    });
  };

  const handleDeletePosition = (position: any) => {
    toast({
      title: "Position Deleted",
      description: `Removed ${position.symbol} from portfolio`,
    });
  };

  const handleExportPortfolio = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Symbol,Name,Side,Quantity,Avg Price,Current Price,Market Value,Unrealized P&L,P&L %\n"
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
      description: "Portfolio data has been exported to CSV",
    });
  };

  const handleAddPosition = () => {
    setIsAddingPosition(true);
    setNewPosition({
      symbol: '',
      name: '',
      side: 'long',
      quantity: 0,
      avgPrice: 0,
      currentPrice: 0,
      sector: 'Technology',
      risk: 'medium',
    });
  };

  const handleSavePosition = () => {
    if (!newPosition.symbol || !newPosition.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Position Added",
      description: `Added ${newPosition.symbol} to portfolio`,
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
      risk: 'medium',
    });
  };

  const handleUpdatePosition = () => {
    if (!newPosition.symbol || !newPosition.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Position Updated",
      description: `Updated ${newPosition.symbol} in portfolio`,
    });
    
    setEditingPositionId(null);
    setNewPosition({
      symbol: '',
      name: '',
      side: 'long',
      quantity: 0,
      avgPrice: 0,
      currentPrice: 0,
      sector: 'Technology',
      risk: 'medium',
    });
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
      risk: 'medium',
    });
  };

  // Dynamically calculate sector allocation from portfolioPositions
  const sectorAllocation = Object.values(
    portfolioPositions.reduce((acc, pos) => {
      if (!acc[pos.sector]) {
        acc[pos.sector] = { sector: pos.sector, weight: 0, return: 0, count: 0 };
      }
      acc[pos.sector].weight += pos.weight || 0;
      acc[pos.sector].return += pos.pnlPercent || 0;
      acc[pos.sector].count += 1;
      return acc;
    }, {} as Record<string, { sector: string; weight: number; return: number; count: number }>)
  ).map((s) => ({
    sector: s.sector,
    weight: s.weight,
    return: s.count > 0 ? s.return / s.count : 0,
  }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your investment positions and track performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPortfolio}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleAddPosition}>
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
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
              {portfolioPositions.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            {totalPnl >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnl)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatPercentage(totalPnlPercent)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalPnl >= 0 ? 'Profitable' : 'Loss'} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Position</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioPositions.length > 0 ? portfolioPositions[0].symbol : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {portfolioPositions.length > 0 ? formatCurrency(portfolioPositions[0].marketValue) : 'No positions'}
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioPositions.length > 0 ? `${portfolioPositions[0].weight.toFixed(1)}%` : '0%'} weight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium</div>
            <div className="text-xs text-muted-foreground">
              Based on positions
            </div>
            <p className="text-xs text-muted-foreground">
              Diversified portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Positions</CardTitle>
          <CardDescription>
            View and manage your investment positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
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

          {/* Add/Edit Position Form */}
          {(isAddingPosition || editingPositionId) && (
            <Card className="mb-6 border-2 border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isAddingPosition ? 'Add New Position' : 'Edit Position'}
                  <Button variant="ghost" size="icon" onClick={handleCancelForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      value={newPosition.symbol}
                      onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                      placeholder="AAPL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newPosition.name}
                      onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
                      placeholder="Apple Inc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="side">Side</Label>
                    <Select value={newPosition.side} onValueChange={(value: 'long' | 'short') => setNewPosition({...newPosition, side: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newPosition.quantity}
                      onChange={(e) => setNewPosition({...newPosition, quantity: Number(e.target.value)})}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgPrice">Avg Price</Label>
                    <Input
                      id="avgPrice"
                      type="number"
                      step="0.01"
                      value={newPosition.avgPrice}
                      onChange={(e) => setNewPosition({...newPosition, avgPrice: Number(e.target.value)})}
                      placeholder="150.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPrice">Current Price</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      step="0.01"
                      value={newPosition.currentPrice}
                      onChange={(e) => setNewPosition({...newPosition, currentPrice: Number(e.target.value)})}
                      placeholder="155.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={newPosition.sector} onValueChange={(value) => setNewPosition({...newPosition, sector: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="risk">Risk Level</Label>
                    <Select value={newPosition.risk} onValueChange={(value: 'low' | 'medium' | 'high') => setNewPosition({...newPosition, risk: value})}>
                      <SelectTrigger>
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
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={handleCancelForm}>
                    Cancel
                  </Button>
                  <Button onClick={isAddingPosition ? handleSavePosition : handleUpdatePosition}>
                    <Save className="w-4 h-4 mr-2" />
                    {isAddingPosition ? 'Add Position' : 'Update Position'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positions Table */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Symbol
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Side
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Quantity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Avg Price
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Current Price
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Market Value
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Unrealized P&L
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      P&L %
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Weight %
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Risk
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {sortedPositions.map((position) => (
                    <tr key={position.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                        {position.symbol}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {position.name}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <Badge variant={position.side === 'long' ? 'default' : 'secondary'}>
                          {position.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {position.quantity.toLocaleString()}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        ${position.avgPrice.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        ${position.currentPrice.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {formatCurrency(position.marketValue)}
                      </td>
                      <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(position.unrealizedPnl)}
                      </td>
                      <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(position.pnlPercent)}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {position.weight.toFixed(1)}%
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <Badge className={getRiskColor(position.risk)}>
                          {position.risk}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewPosition(position)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditPosition(position)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePosition(position)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioPage; 