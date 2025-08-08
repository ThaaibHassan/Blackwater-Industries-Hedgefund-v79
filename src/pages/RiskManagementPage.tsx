import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Settings,
  Zap,
  Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RiskScenario, StressTestResult, FactorImpact } from '@/types';

// Mock risk management data
const mockRiskScenarios: RiskScenario[] = [
  {
    id: 'scenario_001',
    name: 'Historical VaR (95%)',
    type: 'historical',
    description: 'Value at Risk based on historical market data',
    parameters: {
      confidenceLevel: 95,
      timeHorizon: 1,
      scenarios: 1000
    },
    results: {
      var: -2.1,
      cvar: -3.2,
      expectedShortfall: -3.2,
      maxDrawdown: -8.5,
      stressTestResults: [
        {
          scenario: '2008 Financial Crisis',
          portfolioImpact: -15.2,
          factorImpacts: [
            { factor: 'Equity Market', shock: -40, impact: -8.5, contribution: 55.9 },
            { factor: 'Credit Spread', shock: 200, impact: -3.2, contribution: 21.1 },
            { factor: 'Currency', shock: -15, impact: -2.1, contribution: 13.8 },
            { factor: 'Commodities', shock: -25, impact: -1.4, contribution: 9.2 }
          ],
          recommendations: [
            'Increase cash position to 15%',
            'Hedge equity exposure with put options',
            'Reduce leverage to 1.2x',
            'Diversify into defensive sectors'
          ]
        },
        {
          scenario: 'COVID-19 Pandemic',
          portfolioImpact: -12.8,
          factorImpacts: [
            { factor: 'Equity Market', shock: -30, impact: -6.8, contribution: 53.1 },
            { factor: 'Volatility', shock: 100, impact: -2.5, contribution: 19.5 },
            { factor: 'Liquidity', shock: -50, impact: -2.1, contribution: 16.4 },
            { factor: 'Currency', shock: -8, impact: -1.4, contribution: 11.0 }
          ],
          recommendations: [
            'Maintain high liquidity buffers',
            'Focus on quality defensive stocks',
            'Monitor counterparty risk closely',
            'Consider tail risk hedging strategies'
          ]
        }
      ]
    },
    createdAt: new Date()
  },
  {
    id: 'scenario_002',
    name: 'Monte Carlo VaR (99%)',
    type: 'monte_carlo',
    description: 'Monte Carlo simulation with 10,000 scenarios',
    parameters: {
      confidenceLevel: 99,
      timeHorizon: 10,
      scenarios: 10000
    },
    results: {
      var: -3.8,
      cvar: -5.2,
      expectedShortfall: -5.2,
      maxDrawdown: -12.5,
      stressTestResults: [
        {
          scenario: 'Inflation Shock',
          portfolioImpact: -8.5,
          factorImpacts: [
            { factor: 'Interest Rates', shock: 200, impact: -4.2, contribution: 49.4 },
            { factor: 'Real Estate', shock: -15, impact: -2.1, contribution: 24.7 },
            { factor: 'Bonds', shock: -8, impact: -1.4, contribution: 16.5 },
            { factor: 'Commodities', shock: 25, impact: -0.8, contribution: 9.4 }
          ],
          recommendations: [
            'Reduce duration exposure',
            'Increase inflation-protected securities',
            'Hedge with TIPS',
            'Consider commodity exposure'
          ]
        }
      ]
    },
    createdAt: new Date()
  },
  {
    id: 'scenario_003',
    name: 'Custom Stress Test',
    type: 'custom',
    description: 'Custom scenario with simultaneous market shocks',
    parameters: {
      confidenceLevel: 90,
      timeHorizon: 5,
      scenarios: 500
    },
    results: {
      var: -1.8,
      cvar: -2.5,
      expectedShortfall: -2.5,
      maxDrawdown: -6.2,
      stressTestResults: [
        {
          scenario: 'Geopolitical Crisis',
          portfolioImpact: -6.8,
          factorImpacts: [
            { factor: 'Oil Price', shock: 50, impact: -2.8, contribution: 41.2 },
            { factor: 'Emerging Markets', shock: -20, impact: -1.8, contribution: 26.5 },
            { factor: 'Safe Havens', shock: 15, impact: -1.2, contribution: 17.6 },
            { factor: 'Currency', shock: -12, impact: -1.0, contribution: 14.7 }
          ],
          recommendations: [
            'Reduce emerging market exposure',
            'Increase energy sector hedging',
            'Add safe haven assets',
            'Monitor currency risk'
          ]
        }
      ]
    },
    createdAt: new Date()
  }
];

const RiskManagementPage = () => {
  const [selectedScenario, setSelectedScenario] = useState<RiskScenario | null>(mockRiskScenarios[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedConfidence, setSelectedConfidence] = useState('95');
  const [isRunningScenario, setIsRunningScenario] = useState(false);
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

  const getRiskColor = (value: number) => {
    if (value >= -2) return 'text-green-600';
    if (value >= -5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (value: number) => {
    if (value >= -2) return 'Low';
    if (value >= -5) return 'Medium';
    return 'High';
  };

  const handleRunScenario = () => {
    setIsRunningScenario(true);
    toast({
      title: "Scenario Running",
      description: "Risk scenario analysis is being calculated...",
    });
    
    // Simulate scenario completion
    setTimeout(() => {
      setIsRunningScenario(false);
      toast({
        title: "Scenario Complete",
        description: "Risk analysis has been completed successfully.",
      });
    }, 3000);
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Risk management report has been exported to PDF",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
          <p className="text-muted-foreground">
            Advanced risk management, stress testing, and scenario analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" onClick={handleRunScenario} disabled={isRunningScenario}>
            {isRunningScenario ? (
              <Activity className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isRunningScenario ? 'Running...' : 'Run Scenario'}
          </Button>
        </div>
      </div>

      {/* Risk Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio VaR (95%)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(-2.1)}`}>
              {formatPercentage(-2.1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(-42000000)} at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Shortfall</CardTitle>
            <Gauge className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(-3.2)}`}>
              {formatPercentage(-3.2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Conditional VaR
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatPercentage(-8.5)}
            </div>
            <p className="text-xs text-muted-foreground">
              Historical maximum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getRiskLevel(-2.1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current assessment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Scenarios</CardTitle>
          <CardDescription>Select and configure risk analysis scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="scenario">Scenario</Label>
              <Select value={selectedScenario?.id} onValueChange={(value) => {
                const scenario = mockRiskScenarios.find(s => s.id === value);
                setSelectedScenario(scenario || null);
              }}>
                <SelectTrigger id="scenario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockRiskScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeframe">Time Horizon</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger id="timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence">Confidence Level</Label>
              <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                <SelectTrigger id="confidence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                  <SelectItem value="99.9">99.9%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis Results */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
            <CardDescription>Key risk indicators and measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedScenario && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">VaR</div>
                    <div className={`text-lg font-bold ${getRiskColor(selectedScenario.results.var)}`}>
                      {formatPercentage(selectedScenario.results.var)}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">CVaR</div>
                    <div className={`text-lg font-bold ${getRiskColor(selectedScenario.results.cvar)}`}>
                      {formatPercentage(selectedScenario.results.cvar)}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">Expected Shortfall</div>
                    <div className={`text-lg font-bold ${getRiskColor(selectedScenario.results.expectedShortfall)}`}>
                      {formatPercentage(selectedScenario.results.expectedShortfall)}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">Max Drawdown</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatPercentage(selectedScenario.results.maxDrawdown)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Scenario Parameters</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <span className="font-medium">{selectedScenario.parameters.confidenceLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Horizon:</span>
                      <span className="font-medium">{selectedScenario.parameters.timeHorizon} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scenarios:</span>
                      <span className="font-medium">{selectedScenario.parameters.scenarios.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factor Sensitivity</CardTitle>
            <CardDescription>Portfolio sensitivity to key risk factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedScenario?.results.stressTestResults[0]?.factorImpacts.map((factor) => (
                <div key={factor.factor} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{factor.factor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getRiskColor(factor.impact)}`}>
                      {formatPercentage(factor.impact)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {factor.contribution.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stress Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Stress Test Analysis</CardTitle>
          <CardDescription>Detailed stress test results and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {selectedScenario?.results.stressTestResults.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{test.scenario}</h3>
                  <Badge className={getRiskColor(test.portfolioImpact) === 'text-red-600' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {formatPercentage(test.portfolioImpact)} Impact
                  </Badge>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Factor Impacts</Label>
                    <div className="space-y-3">
                      {test.factorImpacts.map((factor, factorIndex) => (
                        <div key={factorIndex} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{factor.factor}</div>
                            <div className="text-xs text-muted-foreground">
                              Shock: {formatPercentage(factor.shock)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-sm ${getRiskColor(factor.impact)}`}>
                              {formatPercentage(factor.impact)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {factor.contribution.toFixed(1)}% contribution
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Recommendations</Label>
                    <div className="space-y-2">
                      {test.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="flex items-start space-x-2 p-2 border rounded">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Limits Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Limits & Monitoring</CardTitle>
          <CardDescription>Real-time risk limit monitoring and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">VaR Limit</span>
                <AlertCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">-2.1%</div>
              <div className="text-xs text-muted-foreground">
                Limit: -3.0% (70% utilized)
              </div>
              <Progress value={70} className="mt-2 h-2" />
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Leverage Ratio</span>
                <Gauge className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">1.4x</div>
              <div className="text-xs text-muted-foreground">
                Limit: 2.0x (70% utilized)
              </div>
              <Progress value={70} className="mt-2 h-2" />
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Concentration Risk</span>
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">15.2%</div>
              <div className="text-xs text-muted-foreground">
                Limit: 20% (76% utilized)
              </div>
              <Progress value={76} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagementPage; 