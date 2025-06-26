import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

// Mock portfolio data
const portfolioPositions = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    side: 'long',
    quantity: 10000,
    avgPrice: 175.50,
    currentPrice: 185.75,
    marketValue: 1857500,
    unrealizedPnl: 102500,
    pnlPercent: 5.8,
    weight: 8.5,
    sector: 'Technology',
    risk: 'low',
    lastUpdated: '2 hours ago'
  },
  {
    id: 2,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    side: 'short',
    quantity: 5000,
    avgPrice: 250.00,
    currentPrice: 245.75,
    marketValue: 1228750,
    unrealizedPnl: 21250,
    pnlPercent: 1.7,
    weight: 5.6,
    sector: 'Automotive',
    risk: 'high',
    lastUpdated: '1 hour ago'
  },
  {
    id: 3,
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    side: 'long',
    quantity: 2000,
    avgPrice: 850.00,
    currentPrice: 890.25,
    marketValue: 1780500,
    unrealizedPnl: 80500,
    pnlPercent: 4.7,
    weight: 8.1,
    sector: 'Technology',
    risk: 'medium',
    lastUpdated: '30 minutes ago'
  },
  {
    id: 4,
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    side: 'long',
    quantity: 8000,
    avgPrice: 400.00,
    currentPrice: 415.30,
    marketValue: 3322400,
    unrealizedPnl: 122400,
    pnlPercent: 3.8,
    weight: 15.1,
    sector: 'Technology',
    risk: 'low',
    lastUpdated: '45 minutes ago'
  },
  {
    id: 5,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    side: 'long',
    quantity: 3000,
    avgPrice: 160.00,
    currentPrice: 165.80,
    marketValue: 497400,
    unrealizedPnl: 17400,
    pnlPercent: 3.6,
    weight: 2.3,
    sector: 'Technology',
    risk: 'low',
    lastUpdated: '1 hour ago'
  }
];

const sectorAllocation = [
  { sector: 'Technology', weight: 34.0, return: 4.2 },
  { sector: 'Healthcare', weight: 18.5, return: 2.1 },
  { sector: 'Financials', weight: 15.2, return: 1.8 },
  { sector: 'Consumer Discretionary', weight: 12.8, return: 3.4 },
  { sector: 'Industrials', weight: 10.5, return: 1.2 },
  { sector: 'Energy', weight: 5.2, return: -0.8 },
  { sector: 'Materials', weight: 3.8, return: 0.9 }
];

const PortfolioPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('weight');

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

  const totalMarketValue = portfolioPositions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalUnrealizedPnl = portfolioPositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
  const totalPnlPercent = (totalUnrealizedPnl / (totalMarketValue - totalUnrealizedPnl)) * 100;

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
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Manage positions, track performance, and monitor risk
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Position
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMarketValue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolioPositions.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalUnrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalUnrealizedPnl)}
            </div>
            <p className={`text-xs ${totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(totalPnlPercent)} total return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Long Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioPositions.filter(p => p.side === 'long').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(portfolioPositions.filter(p => p.side === 'long').reduce((sum, p) => sum + p.weight, 0))} of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Short Positions</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioPositions.filter(p => p.side === 'short').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(portfolioPositions.filter(p => p.side === 'short').reduce((sum, p) => sum + p.weight, 0))} of portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Position Filters</CardTitle>
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
                <SelectTrigger id="sector" className="w-full">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financials">Financials</SelectItem>
                  <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                  <SelectItem value="Industrials">Industrials</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Materials">Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk">Risk Level</Label>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger id="risk" className="w-full">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
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

      {/* Positions Table */}
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
                  <th className="text-left p-2">Side</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Avg Price</th>
                  <th className="text-right p-2">Current Price</th>
                  <th className="text-right p-2">Market Value</th>
                  <th className="text-right p-2">Unrealized P&L</th>
                  <th className="text-right p-2">Weight</th>
                  <th className="text-left p-2">Sector</th>
                  <th className="text-left p-2">Risk</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.map((position) => (
                  <tr key={position.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">{position.name}</div>
                      </div>
                    </td>
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
                      <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(position.pnlPercent)}
                      </div>
                    </td>
                    <td className="p-2 text-right">{position.weight.toFixed(1)}%</td>
                    <td className="p-2">{position.sector}</td>
                    <td className="p-2">
                      <Badge className={getRiskColor(position.risk)}>
                        {position.risk}
                      </Badge>
                    </td>
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

      {/* Sector Allocation */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>Portfolio weight by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectorAllocation.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{sector.sector}</span>
                    <span>{sector.weight.toFixed(1)}%</span>
                  </div>
                  <Progress value={sector.weight} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Return: {formatPercentage(sector.return)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Portfolio risk metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Beta</span>
                <span className="text-sm font-medium">0.85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Volatility</span>
                <span className="text-sm font-medium">12.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">VaR (95%)</span>
                <span className="text-sm font-medium text-red-600">-2.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sharpe Ratio</span>
                <span className="text-sm font-medium text-green-600">1.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Max Drawdown</span>
                <span className="text-sm font-medium text-red-600">-8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPage; 