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
  Leaf,
  TreePine,
  Droplets,
  Sun,
  Wind,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ESGAnalysis, ClimateScenario, SDGAlignment } from '@/types';

// Mock ESG analysis data
const mockESGAnalyses: ESGAnalysis[] = [
  {
    id: 'esg_001',
    issuerId: 'issuer_001',
    issuerName: 'Apple Inc.',
    esgScore: {
      environmental: 85,
      social: 78,
      governance: 92,
      overall: 85
    },
    climateRisk: {
      carbonFootprint: 1250000, // metric tons CO2e
      carbonIntensity: 0.15, // tons CO2e per $1M revenue
      climateScenarioAnalysis: [
        { scenario: 'baseline', impact: -0.02, probability: 0.6, timeframe: 5 },
        { scenario: '2c', impact: -0.08, probability: 0.3, timeframe: 10 },
        { scenario: '4c', impact: -0.15, probability: 0.1, timeframe: 15 }
      ],
      transitionRisk: 0.12,
      physicalRisk: 0.08
    },
    sdgAlignment: [
      { goal: 'SDG 7 - Affordable & Clean Energy', alignment: 85, contribution: 0.15, description: 'Renewable energy initiatives' },
      { goal: 'SDG 12 - Responsible Consumption', alignment: 78, contribution: 0.12, description: 'Circular economy practices' },
      { goal: 'SDG 13 - Climate Action', alignment: 82, contribution: 0.18, description: 'Carbon neutrality commitment' }
    ],
    exclusionFilters: ['fossil_fuels', 'weapons'],
    inclusionFilters: ['renewable_energy', 'clean_tech'],
    dataSource: 'msci',
    lastUpdated: new Date()
  },
  {
    id: 'esg_002',
    issuerId: 'issuer_002',
    issuerName: 'Microsoft Corporation',
    esgScore: {
      environmental: 88,
      social: 85,
      governance: 95,
      overall: 89
    },
    climateRisk: {
      carbonFootprint: 980000,
      carbonIntensity: 0.12,
      climateScenarioAnalysis: [
        { scenario: 'baseline', impact: -0.01, probability: 0.7, timeframe: 5 },
        { scenario: '2c', impact: -0.05, probability: 0.25, timeframe: 10 },
        { scenario: '4c', impact: -0.12, probability: 0.05, timeframe: 15 }
      ],
      transitionRisk: 0.08,
      physicalRisk: 0.05
    },
    sdgAlignment: [
      { goal: 'SDG 9 - Industry Innovation', alignment: 92, contribution: 0.20, description: 'Digital transformation' },
      { goal: 'SDG 13 - Climate Action', alignment: 88, contribution: 0.16, description: 'Carbon negative by 2030' },
      { goal: 'SDG 17 - Partnerships', alignment: 85, contribution: 0.14, description: 'Global partnerships' }
    ],
    exclusionFilters: ['fossil_fuels'],
    inclusionFilters: ['cloud_computing', 'ai_ethics'],
    dataSource: 'sustainalytics',
    lastUpdated: new Date()
  },
  {
    id: 'esg_003',
    issuerId: 'issuer_003',
    issuerName: 'Tesla Inc.',
    esgScore: {
      environmental: 92,
      social: 65,
      governance: 70,
      overall: 76
    },
    climateRisk: {
      carbonFootprint: 450000,
      carbonIntensity: 0.08,
      climateScenarioAnalysis: [
        { scenario: 'baseline', impact: 0.05, probability: 0.8, timeframe: 5 },
        { scenario: '2c', impact: 0.12, probability: 0.15, timeframe: 10 },
        { scenario: '4c', impact: 0.18, probability: 0.05, timeframe: 15 }
      ],
      transitionRisk: 0.15,
      physicalRisk: 0.12
    },
    sdgAlignment: [
      { goal: 'SDG 7 - Affordable & Clean Energy', alignment: 95, contribution: 0.25, description: 'Electric vehicles' },
      { goal: 'SDG 9 - Industry Innovation', alignment: 88, contribution: 0.18, description: 'Sustainable transport' },
      { goal: 'SDG 13 - Climate Action', alignment: 90, contribution: 0.22, description: 'Zero emissions' }
    ],
    exclusionFilters: ['fossil_fuels'],
    inclusionFilters: ['electric_vehicles', 'renewable_energy'],
    dataSource: 'refinitiv',
    lastUpdated: new Date()
  }
];

const ESGPage = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ESGAnalysis | null>(null);
  const { toast } = useToast();

  const filteredAnalyses = mockESGAnalyses.filter(analysis => {
    const matchesSearch = analysis.issuerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = selectedScore === 'all' || 
      (selectedScore === 'high' && analysis.esgScore.overall >= 80) ||
      (selectedScore === 'medium' && analysis.esgScore.overall >= 60 && analysis.esgScore.overall < 80) ||
      (selectedScore === 'low' && analysis.esgScore.overall < 60);
    const matchesRisk = selectedRisk === 'all' || 
      (selectedRisk === 'low' && analysis.climateRisk.transitionRisk < 0.1) ||
      (selectedRisk === 'medium' && analysis.climateRisk.transitionRisk >= 0.1 && analysis.climateRisk.transitionRisk < 0.15) ||
      (selectedRisk === 'high' && analysis.climateRisk.transitionRisk >= 0.15);
    
    return matchesSearch && matchesScore && matchesRisk;
  });

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatCarbonFootprint = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M tons CO2e`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K tons CO2e`;
    return `${value.toFixed(0)} tons CO2e`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.1) return 'text-green-600';
    if (risk < 0.15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getESGColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "ESG analysis report has been exported to PDF",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ESG & Climate Risk</h1>
          <p className="text-muted-foreground">
            Environmental, Social, and Governance analysis with climate risk assessment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* ESG Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ESG Score</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(mockESGAnalyses.reduce((sum, a) => sum + a.esgScore.overall, 0) / mockESGAnalyses.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <TreePine className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCarbonFootprint(mockESGAnalyses.reduce((sum, a) => sum + a.climateRisk.carbonFootprint, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total portfolio emissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Climate Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPercentage(mockESGAnalyses.reduce((sum, a) => sum + a.climateRisk.transitionRisk, 0) / mockESGAnalyses.length * 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg transition risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SDG Alignment</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(mockESGAnalyses.reduce((sum, a) => sum + a.sdgAlignment.reduce((s, sdg) => s + sdg.alignment, 0) / a.sdgAlignment.length, 0) / mockESGAnalyses.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average alignment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter ESG Analysis</CardTitle>
          <CardDescription>Refine ESG analysis by score, risk, and sector</CardDescription>
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
              <Label htmlFor="score">ESG Score</Label>
              <Select value={selectedScore} onValueChange={setSelectedScore}>
                <SelectTrigger id="score">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79%)</SelectItem>
                  <SelectItem value="low">Low (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk">Climate Risk</Label>
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
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Financials">Financials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESG Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Risk Matrix</CardTitle>
          <CardDescription>Comprehensive ESG analysis for all monitored issuers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Issuer</th>
                  <th className="text-center py-2 font-medium">ESG Score</th>
                  <th className="text-center py-2 font-medium">Environmental</th>
                  <th className="text-center py-2 font-medium">Social</th>
                  <th className="text-center py-2 font-medium">Governance</th>
                  <th className="text-center py-2 font-medium">Carbon Footprint</th>
                  <th className="text-center py-2 font-medium">Climate Risk</th>
                  <th className="text-center py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 font-medium">{analysis.issuerName}</td>
                    <td className="py-2 text-center">
                      <Badge className={getESGColor(analysis.esgScore.overall)}>
                        {analysis.esgScore.overall}%
                      </Badge>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getScoreColor(analysis.esgScore.environmental)}`}>
                        {analysis.esgScore.environmental}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getScoreColor(analysis.esgScore.social)}`}>
                        {analysis.esgScore.social}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold ${getScoreColor(analysis.esgScore.governance)}`}>
                        {analysis.esgScore.governance}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="font-medium">
                        {formatCarbonFootprint(analysis.climateRisk.carbonFootprint)}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-medium ${getRiskColor(analysis.climateRisk.transitionRisk)}`}>
                        {formatPercentage(analysis.climateRisk.transitionRisk * 100)}
                      </span>
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

      {/* Climate Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Climate Scenario Analysis</CardTitle>
          <CardDescription>Impact assessment under different climate scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium mb-4 block">Scenario Impact - Apple Inc.</Label>
              <div className="space-y-3">
                {selectedAnalysis?.climateRisk.climateScenarioAnalysis.map((scenario) => (
                  <div key={scenario.scenario} className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{scenario.scenario} Scenario</span>
                      <Badge variant="outline">{scenario.timeframe}Y</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Impact:</span>
                        <span className={`ml-2 font-medium ${scenario.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(scenario.impact * 100)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Probability:</span>
                        <span className="ml-2 font-medium">{formatPercentage(scenario.probability * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-4 block">Climate Risk Metrics</Label>
              <div className="space-y-4">
                {selectedAnalysis && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Transition Risk</div>
                        <div className={`text-lg font-bold ${getRiskColor(selectedAnalysis.climateRisk.transitionRisk)}`}>
                          {formatPercentage(selectedAnalysis.climateRisk.transitionRisk * 100)}
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium">Physical Risk</div>
                        <div className={`text-lg font-bold ${getRiskColor(selectedAnalysis.climateRisk.physicalRisk)}`}>
                          {formatPercentage(selectedAnalysis.climateRisk.physicalRisk * 100)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Carbon Intensity</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress 
                          value={selectedAnalysis.climateRisk.carbonIntensity * 1000} 
                          className="flex-1 h-2"
                        />
                        <span className="text-sm font-medium">
                          {selectedAnalysis.climateRisk.carbonIntensity.toFixed(3)} tons/$1M
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDG Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainable Development Goals Alignment</CardTitle>
          <CardDescription>SDG contribution and alignment tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedAnalysis?.sdgAlignment.map((sdg) => (
              <div key={sdg.goal} className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{sdg.goal}</span>
                  <Badge className={getESGColor(sdg.alignment)}>
                    {sdg.alignment}% aligned
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{sdg.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Alignment</span>
                      <span>{sdg.alignment}%</span>
                    </div>
                    <Progress value={sdg.alignment} className="h-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Contribution</span>
                      <span>{formatPercentage(sdg.contribution * 100)}</span>
                    </div>
                    <Progress value={sdg.contribution * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ESG Trends Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Trends Dashboard</CardTitle>
          <CardDescription>Portfolio ESG performance trends and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Portfolio Carbon Intensity</span>
                <TreePine className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">0.12 tons/$1M</div>
              <div className="text-xs text-muted-foreground">
                -8.5% vs last year
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">ESG Score Trend</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">+5.2%</div>
              <div className="text-xs text-muted-foreground">
                Average improvement
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Climate Risk Exposure</span>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">12.5%</div>
              <div className="text-xs text-muted-foreground">
                Average transition risk
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ESGPage; 