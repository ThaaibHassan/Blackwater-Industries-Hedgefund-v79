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
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Users,
  Settings,
  Bell,
  Flag,
  Lock,
  Unlock,
  AlertCircle,
  PieChart,
  LineChart,
  Activity,
  RefreshCw,
  Shield
} from 'lucide-react';

// Mock reports data
const reports = [
  {
    id: 1,
    title: 'Monthly Performance Report',
    type: 'performance',
    status: 'generated',
    lastGenerated: '2024-01-15T10:30:00Z',
    nextScheduled: '2024-02-15T10:30:00Z',
    recipients: ['investors@blackwater.com', 'compliance@blackwater.com'],
    format: 'pdf',
    size: '2.4MB',
    description: 'Comprehensive monthly performance analysis including returns, risk metrics, and portfolio attribution',
    tags: ['monthly', 'performance', 'investors'],
    dataPoints: 1250,
    charts: 8
  },
  {
    id: 2,
    title: 'Quarterly Risk Assessment',
    type: 'risk',
    status: 'scheduled',
    lastGenerated: '2023-10-15T14:15:00Z',
    nextScheduled: '2024-01-15T14:15:00Z',
    recipients: ['risk@blackwater.com', 'management@blackwater.com'],
    format: 'excel',
    size: '1.8MB',
    description: 'Quarterly risk analysis with VaR, stress testing, and scenario analysis',
    tags: ['quarterly', 'risk', 'management'],
    dataPoints: 890,
    charts: 12
  },
  {
    id: 3,
    title: 'Daily Trading Summary',
    type: 'trading',
    status: 'generated',
    lastGenerated: '2024-01-15T18:00:00Z',
    nextScheduled: '2024-01-16T18:00:00Z',
    recipients: ['trading@blackwater.com'],
    format: 'pdf',
    size: '0.8MB',
    description: 'Daily trading activity summary with P&L, positions, and market commentary',
    tags: ['daily', 'trading', 'internal'],
    dataPoints: 156,
    charts: 3
  },
  {
    id: 4,
    title: 'Annual Investor Statement',
    type: 'investor',
    status: 'in_progress',
    lastGenerated: '2023-12-31T23:59:00Z',
    nextScheduled: '2024-12-31T23:59:00Z',
    recipients: ['all-investors@blackwater.com'],
    format: 'pdf',
    size: '5.2MB',
    description: 'Annual comprehensive investor statement with tax information',
    tags: ['annual', 'investor', 'tax'],
    dataPoints: 2100,
    charts: 15
  },
  {
    id: 5,
    title: 'Compliance Dashboard',
    type: 'compliance',
    status: 'failed',
    lastGenerated: '2024-01-14T09:00:00Z',
    nextScheduled: '2024-01-15T09:00:00Z',
    recipients: ['compliance@blackwater.com'],
    format: 'dashboard',
    size: 'N/A',
    description: 'Real-time compliance monitoring dashboard',
    tags: ['daily', 'compliance', 'monitoring'],
    dataPoints: 450,
    charts: 6
  }
];

const reportTemplates = [
  { name: 'Performance Report', type: 'performance', description: 'Standard performance analysis template', usage: 45 },
  { name: 'Risk Report', type: 'risk', description: 'Comprehensive risk assessment template', usage: 32 },
  { name: 'Trading Summary', type: 'trading', description: 'Daily trading activity template', usage: 128 },
  { name: 'Investor Statement', type: 'investor', description: 'Investor communication template', usage: 12 },
  { name: 'Compliance Report', type: 'compliance', description: 'Regulatory compliance template', usage: 28 }
];

const dataSources = [
  { name: 'Portfolio Database', status: 'connected', lastSync: '2 minutes ago', records: 1250000 },
  { name: 'Market Data Feed', status: 'connected', lastSync: '30 seconds ago', records: 890000 },
  { name: 'Risk Engine', status: 'connected', lastSync: '5 minutes ago', records: 450000 },
  { name: 'Compliance System', status: 'warning', lastSync: '15 minutes ago', records: 230000 },
  { name: 'Investor Portal', status: 'connected', lastSync: '1 minute ago', records: 180000 }
];

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('lastGenerated');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesFormat = selectedFormat === 'all' || report.format === selectedFormat;
    
    return matchesSearch && matchesStatus && matchesType && matchesFormat;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'lastGenerated':
        return new Date(b.lastGenerated).getTime() - new Date(a.lastGenerated).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalReports = reports.length;
  const generatedReports = reports.filter(r => r.status === 'generated').length;
  const scheduledReports = reports.filter(r => r.status === 'scheduled').length;
  const failedReports = reports.filter(r => r.status === 'failed').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Activity className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'risk': return <Shield className="w-4 h-4" />;
      case 'trading': return <BarChart3 className="w-4 h-4" />;
      case 'investor': return <Users className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDataSourceStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and manage comprehensive reports and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Reports Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {generatedReports} generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledReports}</div>
            <p className="text-xs text-muted-foreground">
              Auto-generated reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${failedReports > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {failedReports}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4/5</div>
            <p className="text-xs text-muted-foreground">
              Connected systems
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Status */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Real-time data connection status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((source) => (
              <div key={source.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{source.name}</span>
                  <Badge className={getDataSourceStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2">
                  {source.records.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Last sync: {source.lastSync}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search reports..."
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
                <option value="generated">Generated</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="performance">Performance</option>
                <option value="risk">Risk</option>
                <option value="trading">Trading</option>
                <option value="investor">Investor</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="dashboard">Dashboard</option>
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
                <option value="lastGenerated">Last Generated</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            {filteredReports.length} of {reports.length} reports shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(report.type)}
                      <h3 className="font-semibold">{report.title}</h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Last: {formatDate(report.lastGenerated)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Next: {formatDate(report.nextScheduled)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{report.size}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>{report.charts} charts</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Pre-built report templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template) => (
                <div key={template.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{template.usage}</div>
                    <div className="text-sm text-muted-foreground">uses</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Analytics</CardTitle>
            <CardDescription>Usage and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Avg Generation Time</span>
                <span className="text-sm font-medium">2.3 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium text-green-600">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Data Processed</span>
                <span className="text-sm font-medium">2.8M records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">45.2 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Recipients</span>
                <span className="text-sm font-medium">127</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage; 