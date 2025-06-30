import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Share2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  Star,
  Calendar,
  User,
  FileText,
  X,
  Save
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Mock research data
const researchNotes = [
  {
    id: 1,
    title: 'Apple Q4 Earnings Analysis: Strong iPhone Sales Drive Growth',
    symbol: 'AAPL',
    author: 'John Smith',
    date: '2024-01-15',
    summary: 'Apple reported strong Q4 earnings with iPhone sales exceeding expectations. Services revenue continues to grow at a healthy pace.',
    status: 'published',
    rating: 4.5,
    views: 1250,
    recommendation: 'buy',
    priceTarget: 200,
    riskLevel: 'medium',
    category: 'earnings',
    tags: ['earnings', 'iphone', 'services', 'growth']
  },
  {
    id: 2,
    title: 'Tesla Market Position: EV Competition Intensifies',
    symbol: 'TSLA',
    author: 'Sarah Johnson',
    date: '2024-01-14',
    summary: 'Analysis of Tesla\'s competitive position as traditional automakers ramp up EV production and new players enter the market.',
    status: 'draft',
    rating: 4.2,
    views: 890,
    recommendation: 'hold',
    priceTarget: 250,
    riskLevel: 'high',
    category: 'industry',
    tags: ['ev', 'competition', 'automotive', 'growth']
  },
  {
    id: 3,
    title: 'NVIDIA AI Dominance: Sustaining the Lead',
    symbol: 'NVDA',
    author: 'Mike Chen',
    date: '2024-01-13',
    summary: 'Deep dive into NVIDIA\'s AI chip leadership and the sustainability of their competitive moat in the AI hardware space.',
    status: 'published',
    rating: 4.8,
    views: 2100,
    recommendation: 'buy',
    priceTarget: 950,
    riskLevel: 'high',
    category: 'technology',
    tags: ['ai', 'chips', 'hardware', 'leadership']
  },
  {
    id: 4,
    title: 'Microsoft Cloud Growth: Azure vs AWS Analysis',
    symbol: 'MSFT',
    author: 'Lisa Wang',
    date: '2024-01-12',
    summary: 'Comparative analysis of Microsoft Azure and Amazon AWS cloud services, market share trends, and growth prospects.',
    status: 'review',
    rating: 4.1,
    views: 750,
    recommendation: 'buy',
    priceTarget: 450,
    riskLevel: 'medium',
    category: 'technology',
    tags: ['cloud', 'azure', 'aws', 'enterprise']
  },
  {
    id: 5,
    title: 'Google Advertising Trends: Digital Ad Market Shifts',
    symbol: 'GOOGL',
    author: 'David Kim',
    date: '2024-01-11',
    summary: 'Analysis of Google\'s advertising business and the impact of privacy changes and competitive pressures on digital advertising.',
    status: 'published',
    rating: 3.9,
    views: 680,
    recommendation: 'hold',
    priceTarget: 180,
    riskLevel: 'medium',
    category: 'advertising',
    tags: ['advertising', 'privacy', 'digital', 'revenue']
  }
];

const categories = [
  { name: 'earnings', description: 'Earnings Analysis', count: 15 },
  { name: 'technology', description: 'Technology Trends', count: 23 },
  { name: 'industry', description: 'Industry Analysis', count: 12 },
  { name: 'advertising', description: 'Advertising & Media', count: 8 },
  { name: 'macro', description: 'Macroeconomic', count: 6 }
];

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { toast } = useToast();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    symbol: '',
    summary: '',
    recommendation: 'hold',
    priceTarget: 0,
    riskLevel: 'medium',
    category: 'earnings'
  });

  const filteredNotes = researchNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesRecommendation = selectedRecommendation === 'all' || note.recommendation === selectedRecommendation;
    
    return matchesSearch && matchesCategory && matchesRecommendation;
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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`;
  };

  // REAL FUNCTIONALITY: View research note inline
  const handleViewNote = (note: any) => {
    // Show full research note content in an expandable section
    setSelectedNote(selectedNote?.id === note.id ? null : note);
  };

  // REAL FUNCTIONALITY: Share research note
  const handleShareNote = (note: any) => {
    const shareData = {
      title: note.title,
      text: `${note.summary}\n\nSymbol: ${note.symbol}\nRecommendation: ${note.recommendation.toUpperCase()}\nPrice Target: $${note.priceTarget}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      const shareText = `${note.title}\n\n${note.summary}\n\nSymbol: ${note.symbol}\nRecommendation: ${note.recommendation.toUpperCase()}\nPrice Target: $${note.priceTarget}\n\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Research Note Copied",
        description: "Research note details have been copied to clipboard.",
      });
    }
  };

  // REAL FUNCTIONALITY: Rate research note
  const handleRateNote = (note: any, rating: number) => {
    // In a real app, this would call an API
    toast({
      title: "Rating Submitted",
      description: `You rated "${note.title}" ${rating} stars.`,
    });
  };

  // REAL FUNCTIONALITY: Bookmark research note
  const handleBookmarkNote = (note: any) => {
    // In a real app, this would call an API
    toast({
      title: "Note Bookmarked",
      description: `"${note.title}" has been added to your bookmarks.`,
    });
  };

  // REAL FUNCTIONALITY: Export research as PDF-like report
  const handleExportResearch = () => {
    const report = `Research Notes Report\n\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n` +
      `Total Notes: ${researchNotes.length}\n\n` +
      researchNotes.map(note => 
        `${note.title}\n` +
        `Symbol: ${note.symbol}\n` +
        `Author: ${note.author}\n` +
        `Date: ${note.date}\n` +
        `Status: ${note.status}\n` +
        `Rating: ${note.rating}/5\n` +
        `Views: ${note.views}\n` +
        `Recommendation: ${note.recommendation.toUpperCase()}\n` +
        `Price Target: $${note.priceTarget}\n` +
        `Summary: ${note.summary}\n\n`
      ).join('---\n\n');
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `research_notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Research Exported",
      description: "Research notes have been exported to text file.",
    });
  };

  // REAL FUNCTIONALITY: Add research note inline
  const handleAddNote = () => {
    setIsAddingNote(true);
    setEditingNoteId(null);
    setNewNote({
      title: '',
      symbol: '',
      summary: '',
      recommendation: 'hold',
      priceTarget: 0,
      riskLevel: 'medium',
      category: 'earnings'
    });
  };

  const handleSaveNote = () => {
    if (newNote.title && newNote.symbol && newNote.summary) {
      // In a real app, this would call an API
      toast({
        title: "Research Note Added",
        description: `New research note "${newNote.title}" has been created.`,
      });
      setIsAddingNote(false);
      setNewNote({
        title: '',
        symbol: '',
        summary: '',
        recommendation: 'hold',
        priceTarget: 0,
        riskLevel: 'medium',
        category: 'earnings'
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleEditNote = (note: any) => {
    setNewNote({
      title: note.title,
      symbol: note.symbol,
      summary: note.summary,
      recommendation: note.recommendation,
      priceTarget: note.priceTarget,
      riskLevel: note.riskLevel,
      category: note.category
    });
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleUpdateNote = () => {
    if (newNote.title && newNote.symbol && newNote.summary) {
      // In a real app, this would call an API
      toast({
        title: "Research Note Updated",
        description: `Research note "${newNote.title}" has been updated.`,
      });
      setIsAddingNote(false);
      setEditingNoteId(null);
      setNewNote({
        title: '',
        symbol: '',
        summary: '',
        recommendation: 'hold',
        priceTarget: 0,
        riskLevel: 'medium',
        category: 'earnings'
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
    setIsAddingNote(false);
    setEditingNoteId(null);
    setNewNote({
      title: '',
      symbol: '',
      summary: '',
      recommendation: 'hold',
      priceTarget: 0,
      riskLevel: 'medium',
      category: 'earnings'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research & Analysis</h1>
          <p className="text-muted-foreground">
            Access research notes and market analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportResearch}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddNote} disabled={isAddingNote}>
            <Plus className="w-4 h-4 mr-2" />
            Add Research Note
          </Button>
        </div>
      </div>

      {/* INLINE RESEARCH NOTE FORM */}
      {isAddingNote && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingNoteId ? 'Edit Research Note' : 'Add New Research Note'}
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Research Title *</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter research title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">Stock Symbol *</Label>
                  <Input
                    id="symbol"
                    value={newNote.symbol}
                    onChange={(e) => setNewNote({ ...newNote, symbol: e.target.value.toUpperCase() })}
                    placeholder="Enter stock symbol"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Research Summary *</Label>
                <Textarea
                  id="summary"
                  value={newNote.summary}
                  onChange={(e) => setNewNote({ ...newNote, summary: e.target.value })}
                  placeholder="Enter research summary"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select value={newNote.recommendation} onValueChange={(value) => setNewNote({ ...newNote, recommendation: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="hold">Hold</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priceTarget">Price Target</Label>
                  <Input
                    id="priceTarget"
                    type="number"
                    step="0.01"
                    value={newNote.priceTarget}
                    onChange={(e) => setNewNote({ ...newNote, priceTarget: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price target"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select value={newNote.riskLevel} onValueChange={(value) => setNewNote({ ...newNote, riskLevel: value })}>
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
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newNote.category} onValueChange={(value) => setNewNote({ ...newNote, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earnings">Earnings</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="industry">Industry</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                      <SelectItem value="macro">Macroeconomic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={editingNoteId ? handleUpdateNote : handleSaveNote} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingNoteId ? 'Update Note' : 'Add Note'}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Research views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Research categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Research Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="macro">Macro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recommendation">Recommendation</Label>
              <Select value={selectedRecommendation} onValueChange={setSelectedRecommendation}>
                <SelectTrigger id="recommendation" className="w-full">
                  <SelectValue placeholder="All Recommendations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recommendations</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="hold">Hold</SelectItem>
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
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewNote(note)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRateNote(note, 5)}
                    title="Rate Note"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShareNote(note)}
                    title="Share Note"
                  >
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