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
  AlertTriangle,
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
  Shield,
  CreditCard,
  BarChart3,
  PieChart,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreditAnalysis, CreditCurve } from '@/types';

// Mock credit analysis data
const mockCreditAnalyses: CreditAnalysis[] = [
  {
    id: 'credit_001',
    issuerId: 'issuer_001',
    issuerName: 'Apple Inc.',
    creditRating: {
      internal: 'AA',
      external: 'AA+',
      outlook: 'stable'
    },
    creditScore: {
      altmanZScore: 3.2,
      mlScore: 0.85,
      compositeScore: 0.82
    },
    riskMetrics: {
      defaultProbability: 0.02,
      creditSpread: 85,
      duration: 4.2,
      convexity: 0.15,
      recoveryRate: 0.65
    },
    financialMetrics: {
      debtToEquity: 0.15,
      interestCoverage: 25.4,
      cashFlowCoverage: 8.2,
      leverageRatio: 1.8
    },
    sectorAnalysis: {
      sector: 'Technology',
      peerComparison: 0.85,
      industryRisk: 'low'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'credit_002',
    issuerId: 'issuer_002',
    issuerName: 'Microsoft Corporation',
    creditRating: {
      internal: 'AAA',
      external: 'AAA',
      outlook: 'positive'
    },
    creditScore: {
      altmanZScore: 3.8,
      mlScore: 0.92,
      compositeScore: 0.89
    },
    riskMetrics: {
      defaultProbability: 0.01,
      creditSpread: 45,
      duration: 3.8,
      convexity: 0.12,
      recoveryRate: 0.75
    },
    financialMetrics: {
      debtToEquity: 0.12,
      interestCoverage: 32.1,
      cashFlowCoverage: 12.5,
      leverageRatio: 1.5
    },
    sectorAnalysis: {
      sector: 'Technology',
      peerComparison: 0.92,
      industryRisk: 'low'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'credit_003',
    issuerId: 'issuer_003',
    issuerName: 'Tesla Inc.',
    creditRating: {
      internal: 'BB+',
      external: 'BB',
      outlook: 'stable'
    },
    creditScore: {
      altmanZScore: 2.1,
      mlScore: 0.45,
      compositeScore: 0.52
    },
    riskMetrics: {
      defaultProbability: 0.15,
      creditSpread: 350,
      duration: 5.8,
      convexity: 0.28,
      recoveryRate: 0.45
    },
    financialMetrics: {
      debtToEquity: 0.85,
      interestCoverage: 4.2,
      cashFlowCoverage: 2.1,
      leverageRatio: 3.2
    },
    sectorAnalysis: {
      sector: 'Automotive',
      peerComparison: 0.35,
      industryRisk: 'medium'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockCreditCurves: CreditCurve[] = [
  { id: 'curve_001', issuerId: 'issuer_001', maturity: 1, yield: 2.1, spread: 85, duration: 0.95, convexity: 0.02, timestamp: new Date() },
  { id: 'curve_002', issuerId: 'issuer_001', maturity: 3, yield: 2.8, spread: 95, duration: 2.85, convexity: 0.08, timestamp: new Date() },
  { id: 'curve_003', issuerId: 'issuer_001', maturity: 5, yield: 3.2, spread: 105, duration: 4.65, convexity: 0.15, timestamp: new Date() },
  { id: 'curve_004', issuerId: 'issuer_001', maturity: 10, yield: 3.8, spread: 125, duration: 8.45, convexity: 0.32, timestamp: new Date() }
];

const CreditAnalysisPage = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<CreditAnalysis | null>(null);
  const { toast } = useToast();

  const filteredAnalyses = mockCreditAnalyses.filter(analysis => {
    const matchesSearch = analysis.issuerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || analysis.sectorAnalysis.sector === selectedSector;
    const matchesRating = selectedRating === 'all' || analysis.creditRating.internal === selectedRating;
    const matchesRisk = selectedRisk === 'all' || analysis.sectorAnalysis.industryRisk === selectedRisk;
    
    return matchesSearch && matchesSector && matchesRating && matchesRisk;
  });

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatBasisPoints = (value: number) => {
    return `${value} bps`;
  };

  const getRatingColor = (rating: string) => {
    if (rating.includes('AAA') || rating.includes('AA')) return 'text-green-600';
    if (rating.includes('A') || rating.includes('BBB')) return 'text-yellow-600';
    if (rating.includes('BB') || rating.includes('B')) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Credit analysis report has been exported to PDF",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive credit risk analysis and fixed income intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Credit Analysis Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issuers</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockCreditAnalyses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Monitored issuers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Credit Score</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(mockCreditAnalyses.reduce((sum, a) => sum + a.creditScore.compositeScore, 0) / mockCreditAnalyses.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Composite score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Default Probability</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPercentage(mockCreditAnalyses.reduce((sum, a) => sum + a.riskMetrics.defaultProbability, 0) / mockCreditAnalyses.length * 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Issuers</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockCreditAnalyses.filter(a => a.creditScore.compositeScore < 0.6).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Credit Analysis</CardTitle>
          <CardDescription>Refine credit analysis by sector, rating, and risk level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search issuers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financials">Financials</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rating">Credit Rating</Label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger id="rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="AAA">AAA</SelectItem>
                  <SelectItem value="AA">AA</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="BBB">BBB</SelectItem>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk">Industry Risk</Label>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger id="risk">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Risk Matrix</CardTitle>
          <CardDescription>Comprehensive credit analysis for all monitored issuers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Issuer</th>
                  <th className="text-center py-2 font-medium">Internal Rating</th>
                  <th className="text-center py-2 font-medium">External Rating</th>
                  <th className="text-center py-2 font-medium">Credit Score</th>
                  <th className="text-center py-2 font-medium">Default Probability</th>
                  <th className="text-center py-2 font-medium">Credit Spread</th>
                  <th className="text-center py-2 font-medium">Sector Risk</th>
                  <th className="text-center py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 font-medium">{analysis.issuerName}</td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getRatingColor(analysis.creditRating.internal)}`}>
                        {analysis.creditRating.internal}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getRatingColor(analysis.creditRating.external)}`}>
                        {analysis.creditRating.external}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getScoreColor(analysis.creditScore.compositeScore)}`}>
                        {(analysis.creditScore.compositeScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="font-medium">
                        {formatPercentage(analysis.riskMetrics.defaultProbability * 100)}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="font-medium">
                        {formatBasisPoints(analysis.riskMetrics.creditSpread)}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <Badge className={getRiskColor(analysis.sectorAnalysis.industryRisk)}>
                        {analysis.sectorAnalysis.industryRisk}
                      </Badge>
                    </td>
                    <td className="py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Credit Curve Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Curve Analysis</CardTitle>
          <CardDescription>Yield curve and spread analysis for selected issuers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium mb-4 block">Yield Curve - Apple Inc.</Label>
              <div className="space-y-2">
                {mockCreditCurves.map((curve) => (
                  <div key={curve.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">{curve.maturity}Y</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{formatPercentage(curve.yield)}</span>
                        <span className="text-xs text-muted-foreground">yield</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{formatBasisPoints(curve.spread)}</span>
                      <span className="text-xs text-muted-foreground">spread</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-4 block">Financial Metrics</Label>
              <div className="space-y-4">
                {selectedAnalysis && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Debt/Equity</div>
                        <div className="text-lg font-bold">{selectedAnalysis.financialMetrics.debtToEquity.toFixed(2)}</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Interest Coverage</div>
                        <div className="text-lg font-bold">{selectedAnalysis.financialMetrics.interestCoverage.toFixed(1)}x</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Cash Flow Coverage</div>
                        <div className="text-lg font-bold">{selectedAnalysis.financialMetrics.cashFlowCoverage.toFixed(1)}x</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Leverage Ratio</div>
                        <div className="text-lg font-bold">{selectedAnalysis.financialMetrics.leverageRatio.toFixed(1)}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Altman Z-Score</span>
                        <span className={`font-bold ${getScoreColor(selectedAnalysis.creditScore.altmanZScore / 4)}`}>
                          {selectedAnalysis.creditScore.altmanZScore.toFixed(1)}
                        </span>
                      </div>
                      <Progress value={(selectedAnalysis.creditScore.altmanZScore / 4) * 100} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>ML Credit Score</span>
                        <span className={`font-bold ${getScoreColor(selectedAnalysis.creditScore.mlScore)}`}>
                          {(selectedAnalysis.creditScore.mlScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={selectedAnalysis.creditScore.mlScore * 100} className="h-2" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics Dashboard</CardTitle>
          <CardDescription>Key risk indicators and monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Portfolio Default Risk</span>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">0.08%</div>
              <div className="text-xs text-muted-foreground">
                Weighted average probability
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Credit Spread Widening</span>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">+15 bps</div>
              <div className="text-xs text-muted-foreground">
                Average spread change
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recovery Rate</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">62.5%</div>
              <div className="text-xs text-muted-foreground">
                Expected recovery rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditAnalysisPage; 