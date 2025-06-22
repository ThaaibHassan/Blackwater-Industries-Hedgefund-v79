import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
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
  FileText,
  BookOpen,
  Lightbulb,
  Users,
  Star,
  Share2
} from 'lucide-react';

// Mock research data
const researchNotes = [
  {
    id: 1,
    title: 'Apple Q4 2024 Earnings Analysis',
    symbol: 'AAPL',
    author: 'John Smith',
    date: '2024-01-15T10:30:00Z',
    status: 'published',
    category: 'earnings',
    rating: 5,
    views: 1247,
    summary: 'Strong iPhone sales and services growth drive record Q4 results. AI integration in iOS 18 expected to boost ecosystem stickiness.',
    tags: ['earnings', 'technology', 'large-cap', 'ai'],
    content: 'Detailed analysis of Apple\'s Q4 2024 earnings...',
    priceTarget: 210,
    currentPrice: 185.75,
    recommendation: 'buy',
    riskLevel: 'low',
    timeHorizon: '12 months'
  },
  {
    id: 2,
    title: 'Tesla: EV Market Share Analysis',
    symbol: 'TSLA',
    author: 'Sarah Johnson',
    date: '2024-01-14T14:15:00Z',
    status: 'draft',
    category: 'industry',
    rating: 4,
    views: 892,
    summary: 'Tesla maintains market leadership but faces increasing competition from traditional automakers and Chinese EV manufacturers.',
    tags: ['ev', 'automotive', 'competition', 'china'],
    content: 'Comprehensive analysis of Tesla\'s market position...',
    priceTarget: 280,
    currentPrice: 245.75,
    recommendation: 'hold',
    riskLevel: 'high',
    timeHorizon: '6 months'
  },
  {
    id: 3,
    title: 'NVIDIA: AI Chip Demand Surge',
    symbol: 'NVDA',
    author: 'Mike Chen',
    date: '2024-01-13T09:45:00Z',
    status: 'published',
    category: 'technology',
    rating: 5,
    views: 2156,
    summary: 'AI infrastructure buildout continues to drive unprecedented demand for NVIDIA\'s data center GPUs.',
    tags: ['ai', 'semiconductor', 'data-center', 'growth'],
    content: 'Deep dive into NVIDIA\'s AI chip dominance...',
    priceTarget: 950,
    currentPrice: 890.25,
    recommendation: 'buy',
    riskLevel: 'medium',
    timeHorizon: '18 months'
  },
  {
    id: 4,
    title: 'Microsoft Cloud Growth Outlook',
    symbol: 'MSFT',
    author: 'Lisa Wang',
    date: '2024-01-12T11:20:00Z',
    status: 'review',
    category: 'technology',
    rating: 4,
    views: 567,
    summary: 'Azure continues to gain market share as enterprises accelerate cloud migration and AI adoption.',
    tags: ['cloud', 'enterprise', 'ai', 'migration'],
    content: 'Analysis of Microsoft\'s cloud strategy...',
    priceTarget: 450,
    currentPrice: 415.30,
    recommendation: 'buy',
    riskLevel: 'low',
    timeHorizon: '12 months'
  },
  {
    id: 5,
    title: 'Google: Advertising Market Recovery',
    symbol: 'GOOGL',
    author: 'David Kim',
    date: '2024-01-11T16:00:00Z',
    status: 'published',
    category: 'advertising',
    rating: 3,
    views: 734,
    summary: 'Digital advertising market shows signs of recovery, but Google faces regulatory headwinds.',
    tags: ['advertising', 'regulatory', 'recovery', 'digital'],
    content: 'Advertising market analysis and regulatory risks...',
    priceTarget: 180,
    currentPrice: 165.80,
    recommendation: 'hold',
    riskLevel: 'medium',
    timeHorizon: '9 months'
  }
];

const categories = [
  { name: 'earnings', description: 'Earnings Analysis', count: 12 },
  { name: 'technology', description: 'Technology Sector', count: 28 },
  { name: 'industry', description: 'Industry Analysis', count: 15 },
  { name: 'advertising', description: 'Advertising & Media', count: 8 },
  { name: 'macro', description: 'Macroeconomic', count: 6 }
];

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredNotes = researchNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || note.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesRecommendation = selectedRecommendation === 'all' || note.recommendation === selectedRecommendation;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesRecommendation;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'views':
        return b.views - a.views;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalNotes = researchNotes.length;
  const publishedNotes = researchNotes.filter(n => n.status === 'published').length;
  const avgRating = researchNotes.reduce((sum, n) => sum + n.rating, 0) / totalNotes;
  const totalViews = researchNotes.reduce((sum, n) => sum + n.views, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return 'bg-green-100 text-green-800';
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      case 'sell': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Management</h1>
          <p className="text-muted-foreground">
            Market analysis, investment research, and investment thesis tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Research
          </Button>
        </div>
      </div>

      {/* Research Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              {publishedNotes} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Research engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Analysts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Contributing analysts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Research Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search research..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
              </select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="earnings">Earnings</option>
                <option value="technology">Technology</option>
                <option value="industry">Industry</option>
                <option value="advertising">Advertising</option>
                <option value="macro">Macro</option>
              </select>
            </div>
            <div>
              <Label htmlFor="recommendation">Recommendation</Label>
              <select
                id="recommendation"
                value={selectedRecommendation}
                onChange={(e) => setSelectedRecommendation(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Recommendations</option>
                <option value="buy">Buy</option>
                <option value="hold">Hold</option>
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
                <option value="date">Date</option>
                <option value="rating">Rating</option>
                <option value="views">Views</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{note.symbol}</Badge>
                    <Badge className={getStatusColor(note.status)}>
                      {note.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {note.summary}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <span className="text-sm font-medium">{note.author}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm">{formatDate(note.date)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{note.rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Views</span>
                  <span className="text-sm">{note.views.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recommendation</span>
                  <Badge className={getRecommendationColor(note.recommendation)}>
                    {note.recommendation.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price Target</span>
                  <span className="text-sm font-medium">{formatCurrency(note.priceTarget)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <Badge className={getRiskColor(note.riskLevel)}>
                    {note.riskLevel}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Research Categories and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Research Categories</CardTitle>
            <CardDescription>Notes by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{category.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.count} notes
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Analytics</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Avg Time to Publish</span>
                <span className="text-sm font-medium">3.2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Research Quality Score</span>
                <span className="text-sm font-medium text-green-600">8.7/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Analyst Productivity</span>
                <span className="text-sm font-medium">2.1 notes/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Client Satisfaction</span>
                <span className="text-sm font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Research Impact Score</span>
                <span className="text-sm font-medium">7.8/10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResearchPage; 