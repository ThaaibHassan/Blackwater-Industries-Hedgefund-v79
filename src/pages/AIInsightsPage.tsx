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
  Brain, 
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
  Zap,
  Cpu,
  Database,
  BarChart3,
  PieChart,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Lightbulb,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIInsight, TechnicalIndicator, AlternativeDataPoint, ModelPrediction } from '@/types';

// Mock AI insights data
const mockInsights: AIInsight[] = [
  {
    id: 'insight_001',
    type: 'market_signal',
    title: 'Strong Momentum Signal for Tech Sector',
    description: 'Technical indicators show strong momentum building in the technology sector, particularly in semiconductor stocks. RSI and MACD indicators suggest continued upward movement.',
    confidence: 85,
    impact: 'high',
    assetClass: 'equity',
    symbols: ['NVDA', 'AMD', 'TSM', 'INTC'],
    data: {
      technicalIndicators: [
        { name: 'RSI', value: 72, signal: 'buy', strength: 85 },
        { name: 'MACD', value: 0.15, signal: 'buy', strength: 78 },
        { name: 'Bollinger Bands', value: 0.8, signal: 'buy', strength: 82 }
      ],
      sentimentScore: 0.75,
      alternativeData: [
        { source: 'Social Media', metric: 'Mentions', value: 1250, change: 15.2, timestamp: new Date() },
        { source: 'News Sentiment', metric: 'Positive Ratio', value: 0.68, change: 8.5, timestamp: new Date() },
        { source: 'Earnings Calls', metric: 'Optimism Score', value: 0.72, change: 12.3, timestamp: new Date() }
      ],
      modelPredictions: [
        { modelName: 'LSTM Price Predictor', prediction: 0.08, confidence: 82, timeframe: '1M' },
        { modelName: 'Sentiment Classifier', prediction: 0.12, confidence: 78, timeframe: '2W' },
        { modelName: 'Technical Pattern Recognizer', prediction: 0.15, confidence: 85, timeframe: '1M' }
      ]
    },
    createdAt: new Date(),
    status: 'active'
  },
  {
    id: 'insight_002',
    type: 'risk_alert',
    title: 'Elevated Volatility in Energy Sector',
    description: 'Unusual volatility patterns detected in energy stocks. Risk models indicate potential downside risk due to geopolitical tensions and supply chain disruptions.',
    confidence: 92,
    impact: 'high',
    assetClass: 'equity',
    symbols: ['XOM', 'CVX', 'COP', 'EOG'],
    data: {
      technicalIndicators: [
        { name: 'Volatility Index', value: 28.5, signal: 'sell', strength: 92 },
        { name: 'ATR', value: 0.045, signal: 'sell', strength: 88 },
        { name: 'Put-Call Ratio', value: 1.8, signal: 'sell', strength: 85 }
      ],
      sentimentScore: -0.35,
      alternativeData: [
        { source: 'Oil Futures', metric: 'Contango', value: 0.12, change: -5.2, timestamp: new Date() },
        { source: 'Geopolitical Risk', metric: 'Risk Score', value: 0.78, change: 12.5, timestamp: new Date() },
        { source: 'Supply Chain', metric: 'Disruption Index', value: 0.65, change: 8.9, timestamp: new Date() }
      ],
      modelPredictions: [
        { modelName: 'Volatility Predictor', prediction: -0.12, confidence: 92, timeframe: '2W' },
        { modelName: 'Risk Model', prediction: -0.08, confidence: 88, timeframe: '1M' },
        { modelName: 'Sentiment Analyzer', prediction: -0.15, confidence: 85, timeframe: '1W' }
      ]
    },
    createdAt: new Date(),
    status: 'active'
  },
  {
    id: 'insight_003',
    type: 'opportunity',
    title: 'Undervalued Healthcare Stocks',
    description: 'ML models identify several healthcare stocks trading below their intrinsic value. Fundamental analysis combined with technical indicators suggests potential upside.',
    confidence: 78,
    impact: 'medium',
    assetClass: 'equity',
    symbols: ['JNJ', 'PFE', 'ABBV', 'UNH'],
    data: {
      technicalIndicators: [
        { name: 'P/E Ratio', value: 15.2, signal: 'buy', strength: 78 },
        { name: 'PEG Ratio', value: 0.85, signal: 'buy', strength: 82 },
        { name: 'DCF Model', value: 0.92, signal: 'buy', strength: 75 }
      ],
      sentimentScore: 0.45,
      alternativeData: [
        { source: 'Clinical Trials', metric: 'Success Rate', value: 0.68, change: 5.2, timestamp: new Date() },
        { source: 'FDA Approvals', metric: 'Approval Rate', value: 0.72, change: 8.1, timestamp: new Date() },
        { source: 'Patent Analysis', metric: 'Innovation Score', value: 0.65, change: 3.8, timestamp: new Date() }
      ],
      modelPredictions: [
        { modelName: 'Value Model', prediction: 0.18, confidence: 78, timeframe: '3M' },
        { modelName: 'Fundamental Analyzer', prediction: 0.12, confidence: 82, timeframe: '6M' },
        { modelName: 'Technical Screener', prediction: 0.08, confidence: 75, timeframe: '1M' }
      ]
    },
    createdAt: new Date(),
    status: 'active'
  }
];

const AIInsightsPage = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedAssetClass, setSelectedAssetClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isModelTraining, setIsModelTraining] = useState(false);
  const { toast } = useToast();

  const filteredInsights = mockInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || insight.type === selectedType;
    const matchesImpact = selectedImpact === 'all' || insight.impact === selectedImpact;
    const matchesAssetClass = selectedAssetClass === 'all' || insight.assetClass === selectedAssetClass;
    
    return matchesSearch && matchesType && matchesImpact && matchesAssetClass;
  });

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleModelTraining = () => {
    setIsModelTraining(true);
    toast({
      title: "Model Training Started",
      description: "Custom model training has been initiated. You'll receive a notification when complete.",
    });
    
    // Simulate training completion
    setTimeout(() => {
      setIsModelTraining(false);
      toast({
        title: "Model Training Complete",
        description: "Your custom model has been trained and is ready for use.",
      });
    }, 5000);
  };

  const handleBacktest = () => {
    toast({
      title: "Backtesting Started",
      description: "Model backtesting has been initiated. Results will be available shortly.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights & Quant Research</h1>
          <p className="text-muted-foreground">
            Machine learning insights, market signals, and quantitative research tools
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBacktest}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Backtest Models
          </Button>
          <Button size="sm" onClick={handleModelTraining} disabled={isModelTraining}>
            {isModelTraining ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Cpu className="w-4 h-4 mr-2" />
            )}
            {isModelTraining ? 'Training...' : 'Train Model'}
          </Button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockInsights.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time AI signals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockInsights.filter(i => i.impact === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical signals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(mockInsights.reduce((sum, i) => sum + i.confidence, 0) / mockInsights.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Model accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models Active</CardTitle>
            <Cpu className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              12
            </div>
            <p className="text-xs text-muted-foreground">
              ML models running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Insights</CardTitle>
          <CardDescription>Refine AI insights by type, impact, and asset class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="market_signal">Market Signal</SelectItem>
                  <SelectItem value="risk_alert">Risk Alert</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="impact">Impact</Label>
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger id="impact">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact Levels</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assetClass">Asset Class</Label>
              <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
                <SelectTrigger id="assetClass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Asset Classes</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="fixed_income">Fixed Income</SelectItem>
                  <SelectItem value="currencies">Currencies</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights List */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact}
                  </Badge>
                  <Badge variant="outline">
                    {insight.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{insight.title}</CardTitle>
              <CardDescription>{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Affected Symbols</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {insight.symbols.map((symbol) => (
                      <Badge key={symbol} variant="secondary" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Technical Indicators</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {insight.data.technicalIndicators.slice(0, 3).map((indicator) => (
                      <div key={indicator.name} className="text-xs">
                        <div className="font-medium">{indicator.name}</div>
                        <div className={`${indicator.signal === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {indicator.value.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Sentiment Score</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress 
                      value={insight.data.sentimentScore * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm font-medium">
                      {(insight.data.sentimentScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Training Section */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Model Training</CardTitle>
          <CardDescription>Train and deploy custom machine learning models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="modelName">Model Name</Label>
                <Input id="modelName" placeholder="Enter model name" />
              </div>
              <div>
                <Label htmlFor="modelType">Model Type</Label>
                <Select>
                  <SelectTrigger id="modelType">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lstm">LSTM Price Predictor</SelectItem>
                    <SelectItem value="sentiment">Sentiment Classifier</SelectItem>
                    <SelectItem value="technical">Technical Pattern Recognizer</SelectItem>
                    <SelectItem value="fundamental">Fundamental Analyzer</SelectItem>
                    <SelectItem value="risk">Risk Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trainingData">Training Data</Label>
                <Select>
                  <SelectTrigger id="trainingData">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Historical Price Data</SelectItem>
                    <SelectItem value="sentiment">Sentiment Data</SelectItem>
                    <SelectItem value="fundamental">Fundamental Data</SelectItem>
                    <SelectItem value="alternative">Alternative Data</SelectItem>
                    <SelectItem value="custom">Custom Dataset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parameters">Model Parameters</Label>
                <Textarea 
                  id="parameters" 
                  placeholder="Enter model parameters (JSON format)"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Model Performance</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-medium">87.5%</span>
                  </div>
                  <Progress value={87.5} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Precision</span>
                    <span className="font-medium">82.3%</span>
                  </div>
                  <Progress value={82.3} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Recall</span>
                    <span className="font-medium">89.1%</span>
                  </div>
                  <Progress value={89.1} className="h-2" />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Active Models</Label>
                <div className="space-y-2 mt-2">
                  {['LSTM Price Predictor', 'Sentiment Classifier', 'Technical Pattern Recognizer'].map((model) => (
                    <div key={model} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{model}</span>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPage; 