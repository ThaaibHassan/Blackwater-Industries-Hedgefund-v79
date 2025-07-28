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
  Save,
  MoreHorizontal,
  Bookmark,
  Trash2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ResearchNote } from "@/types";
import { useData } from '@/context/DataContext';

const categories = [
  { name: 'earnings', description: 'Earnings Analysis', count: 15 },
  { name: 'technology', description: 'Technology Trends', count: 23 },
  { name: 'industry', description: 'Industry Analysis', count: 12 },
  { name: 'advertising', description: 'Advertising & Media', count: 8 },
  { name: 'macro', description: 'Macroeconomic', count: 6 }
];

const ResearchPage = () => {
  const { researchNotes } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const { toast } = useToast();
  const [selectedNote, setSelectedNote] = useState<ResearchNote | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    symbols: [] as string[],
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    dueDate: new Date(),
  });

  const filteredNotes = researchNotes
    .filter((note: ResearchNote) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.symbols.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" || note.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || note.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a: ResearchNote, b: ResearchNote) => {
      if (sortBy === "createdAt") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const totalNotes = researchNotes.length;
  const publishedNotes = researchNotes.filter(n => n.status === 'published').length;

  const formatDate = (date: Date) => date.toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (priority: string) => {
    switch (priority) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleViewNote = (note: ResearchNote) => {
    setSelectedNote(selectedNote?.id === note.id ? null : note);
  };

  const handleShareNote = (note: ResearchNote) => {
    const shareData = {
      title: note.title,
      text: `${note.content}\n\nSymbols: ${note.symbols.join(', ')}\nPriority: ${note.priority.toUpperCase()}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      const shareText = `${note.title}\n\n${note.content}\n\nSymbols: ${note.symbols.join(', ')}\nPriority: ${note.priority.toUpperCase()}\n\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Research Note Copied",
        description: "Research note details have been copied to clipboard.",
      });
    }
  };

  const handleRateNote = (note: ResearchNote, rating: number) => {
    // In a real app, this would call an API
    toast({
      title: "Rating Submitted",
      description: `You rated "${note.title}" ${rating} stars.`,
    });
  };

  const handleBookmarkNote = (note: ResearchNote) => {
    // In a real app, this would call an API
    toast({
      title: "Note Bookmarked",
      description: `"${note.title}" has been added to your bookmarks.`,
    });
  };

  const handleExportResearch = () => {
    const report =
      `Research Notes Report\n\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n` +
      `Total Notes: ${researchNotes.length}\n\n` +
      filteredNotes
        .map(
          (note) =>
            `${note.title}\n` +
            `Symbols: ${note.symbols.join(", ")}\n` +
            `Author: ${note.analystName}\n` +
            `Date: ${new Date(note.createdAt).toLocaleDateString()}\n` +
            `Status: ${note.status}\n` +
            `Priority: ${note.priority}\n` +
            `Content: ${note.content}\n\n`
        )
        .join("---\n\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `research_notes_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Research Exported",
      description: "Research notes have been exported to text file.",
    });
  };

  const handleAddNote = () => {
    setIsAddingNote(true);
    setEditingNoteId(null);
    setNewNote({
      title: "",
      content: "",
      symbols: [],
      priority: "medium",
      dueDate: new Date(),
    });
  };

  const handleSaveNote = () => {
    if (newNote.title && newNote.symbols.length > 0 && newNote.content) {
      const now = new Date();
      const createdNote: ResearchNote = {
        id: `research_${Date.now()}`,
        ...newNote,
        analystId: "user_001", // Mock current user
        analystName: "Current User",
        assetClass: 'equity',
        tags: [],
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        attachments: [],
        version: 1,
        isPublic: false,
        dueDate: newNote.dueDate ?? new Date(),
      };
      // researchNotes.push(createdNote);
      toast({
        title: "Research Note Added",
        description: `New research note "${newNote.title}" has been created.`,
      });
      setIsAddingNote(false);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: ResearchNote) => {
    setNewNote({
      title: note.title,
      symbols: note.symbols,
      content: note.content,
      priority: note.priority,
      dueDate: note.dueDate ?? new Date(),
    });
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleUpdateNote = () => {
    if (newNote.title && newNote.symbols.length > 0 && newNote.content) {
      // researchNotes.push(newNote);
      toast({
        title: "Research Note Updated",
        description: `Research note "${newNote.title}" has been updated.`,
      });
      setIsAddingNote(false);
      setEditingNoteId(null);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleCancelForm = () => {
    setIsAddingNote(false);
    setEditingNoteId(null);
    setNewNote({
      title: "",
      content: "",
      symbols: [],
      priority: "medium",
      dueDate: new Date(),
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
        <Card className="border-2 border-primary/20 bg-primary/5">
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
                  <Label htmlFor="symbols">Symbols * (comma-separated)</Label>
                  <Input
                    id="symbols"
                    value={newNote.symbols.join(",")}
                    onChange={(e) =>
                      setNewNote({
                        ...newNote,
                        symbols: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="e.g. AAPL, MSFT"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  placeholder="Enter research details..."
                  className="mt-1"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newNote.priority}
                    onValueChange={(
                      value: "low" | "medium" | "high" | "urgent"
                    ) => setNewNote({ ...newNote, priority: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newNote.dueDate ? newNote.dueDate.toISOString().split('T')[0] : ''}
                  onChange={e => setNewNote({ ...newNote, dueDate: new Date(e.target.value) })}
                  className="mt-1"
                />
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
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
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
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{note.symbols.join(', ')}</Badge>
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
                {note.content}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <span className="text-sm font-medium">{note.analystName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm">{formatDate(note.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge className={getRecommendationColor(note.priority)}>
                    {note.priority.toUpperCase()}
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