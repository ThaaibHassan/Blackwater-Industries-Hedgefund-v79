import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Target,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Activity,
  DollarSign,
  Globe,
  Layers,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PerformanceAttribution, SectorAttribution, FactorAttribution } from '@/types';

// Mock performance attribution data
const mockAttribution: PerformanceAttribution = {
  id: 'attr_001',
  portfolioId: 'portfolio_001',
  period: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  },
  totalReturn: 15.2,
  benchmarkReturn: 12.1,
  excessReturn: 3.1,
  attribution: {
    assetAllocation: 0.8,
    stockSelection: 1.9,
    interaction: 0.2,
    currency: 0.1,
    other: 0.1
  },
  sectorAttribution: [
    {
      sector: 'Technology',
      weight: 25.5,
      return: 18.2,
      contribution: 4.6,
      benchmarkWeight: 22.0,
      benchmarkReturn: 15.1,
      excessReturn: 3.1
    },
    {
      sector: 'Healthcare',
      weight: 18.2,
      return: 12.8,
      contribution: 2.3,
      benchmarkWeight: 15.5,
      benchmarkReturn: 10.2,
      excessReturn: 2.6
    },
    {
      sector: 'Financials',
      weight: 15.8,
      return: 8.5,
      contribution: 1.3,
      benchmarkWeight: 18.2,
      benchmarkReturn: 9.1,
      excessReturn: -0.6
    },
    {
      sector: 'Consumer Discretionary',
      weight: 12.4,
      return: 14.2,
      contribution: 1.8,
      benchmarkWeight: 11.8,
      benchmarkReturn: 12.5,
      excessReturn: 1.7
    },
    {
      sector: 'Industrials',
      weight: 10.1,
      return: 11.5,
      contribution: 1.2,
      benchmarkWeight: 12.5,
      benchmarkReturn: 10.8,
      excessReturn: 0.7
    }
  ],
  factorAttribution: [
    {
      factor: 'Market Beta',
      exposure: 0.95,
      factorReturn: 12.1,
      contribution: 11.5,
      benchmarkExposure: 1.0,
      benchmarkFactorReturn: 12.1,
      excessContribution: -0.6
    },
    {
      factor: 'Size',
      exposure: -0.15,
      factorReturn: 2.1,
      contribution: -0.3,
      benchmarkExposure: 0.0,
      benchmarkFactorReturn: 2.1,
      excessContribution: -0.3
    },
    {
      factor: 'Value',
      exposure: 0.25,
      factorReturn: 1.8,
      contribution: 0.5,
      benchmarkExposure: 0.0,
      benchmarkFactorReturn: 1.8,
      excessContribution: 0.5
    },
    {
      factor: 'Momentum',
      exposure: 0.35,
      factorReturn: 3.2,
      contribution: 1.1,
      benchmarkExposure: 0.0,
      benchmarkFactorReturn: 3.2,
      excessContribution: 1.1
    },
    {
      factor: 'Quality',
      exposure: 0.45,
      factorReturn: 2.5,
      contribution: 1.1,
      benchmarkExposure: 0.0,
      benchmarkFactorReturn: 2.5,
      excessContribution: 1.1
    }
  ],
  createdAt: new Date()
};

const PerformanceAttributionPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedAttribution, setSelectedAttribution] = useState<PerformanceAttribution>(mockAttribution);
  const { toast } = useToast();

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getContributionColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Performance attribution report has been exported to PDF",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Attribution</h1>
          <p className="text-muted-foreground">
            Comprehensive performance attribution analysis and factor decomposition
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Period</CardTitle>
          <CardDescription>Select the time period for attribution analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="period">Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">Month-to-Date</SelectItem>
                  <SelectItem value="qtd">Quarter-to-Date</SelectItem>
                  <SelectItem value="ytd">Year-to-Date</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="3y">3 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="view">View</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="view" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="sector">Sector Attribution</SelectItem>
                  <SelectItem value="factor">Factor Attribution</SelectItem>
                  <SelectItem value="fx">FX Attribution</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(selectedAttribution.totalReturn)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs {formatPercentage(selectedAttribution.benchmarkReturn)} benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excess Return</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getContributionColor(selectedAttribution.excessReturn)}`}>
              {formatPercentage(selectedAttribution.excessReturn)}
            </div>
            <p className="text-xs text-muted-foreground">
              Alpha generation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Information Ratio</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              1.24
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted alpha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracking Error</CardTitle>
            <Layers className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              2.5%
            </div>
            <p className="text-xs text-muted-foreground">
              Active risk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attribution Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attribution Breakdown</CardTitle>
            <CardDescription>Decomposition of excess return by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(selectedAttribution.attribution).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getContributionColor(value)}`}>
                      {formatPercentage(value)}
                    </span>
                    <Progress 
                      value={Math.abs(value) / Math.abs(selectedAttribution.excessReturn) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factor Attribution</CardTitle>
            <CardDescription>Factor-based performance decomposition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedAttribution.factorAttribution.slice(0, 5).map((factor) => (
                <div key={factor.factor} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">{factor.factor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getContributionColor(factor.excessContribution)}`}>
                      {formatPercentage(factor.excessContribution)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {factor.exposure.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Attribution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Attribution</CardTitle>
          <CardDescription>Detailed sector-level performance attribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Sector</th>
                  <th className="text-right py-2 font-medium">Weight</th>
                  <th className="text-right py-2 font-medium">Return</th>
                  <th className="text-right py-2 font-medium">Contribution</th>
                  <th className="text-right py-2 font-medium">Benchmark Weight</th>
                  <th className="text-right py-2 font-medium">Benchmark Return</th>
                  <th className="text-right py-2 font-medium">Excess Return</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttribution.sectorAttribution.map((sector) => (
                  <tr key={sector.sector} className="border-b">
                    <td className="py-2 font-medium">{sector.sector}</td>
                    <td className="py-2 text-right">{sector.weight.toFixed(1)}%</td>
                    <td className={`py-2 text-right font-medium ${sector.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(sector.return)}
                    </td>
                    <td className={`py-2 text-right font-medium ${getContributionColor(sector.contribution)}`}>
                      {formatPercentage(sector.contribution)}
                    </td>
                    <td className="py-2 text-right">{sector.benchmarkWeight.toFixed(1)}%</td>
                    <td className="py-2 text-right">{formatPercentage(sector.benchmarkReturn)}</td>
                    <td className={`py-2 text-right font-medium ${getContributionColor(sector.excessReturn)}`}>
                      {formatPercentage(sector.excessReturn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FX Attribution */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Attribution</CardTitle>
          <CardDescription>Foreign exchange impact on performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">USD Exposure</span>
                <Badge variant="outline">65%</Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">+0.8%</div>
              <div className="text-xs text-muted-foreground">Currency contribution</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">EUR Exposure</span>
                <Badge variant="outline">20%</Badge>
              </div>
              <div className="text-2xl font-bold text-red-600">-0.3%</div>
              <div className="text-xs text-muted-foreground">Currency contribution</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">JPY Exposure</span>
                <Badge variant="outline">15%</Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">+0.2%</div>
              <div className="text-xs text-muted-foreground">Currency contribution</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAttributionPage; 