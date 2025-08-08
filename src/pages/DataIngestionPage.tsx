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
  Clock,
  Zap,
  Target,
  ArrowUpDown,
  Play,
  Pause,
  RefreshCw,
  Send,
  CheckSquare,
  Square,
  AlertOctagon,
  Info,
  Timer,
  Users,
  Building2,
  Route,
  Gauge,
  TrendingUpIcon,
  TrendingDownIcon,
  Database,
  Upload,
  Download as DownloadIcon,
  Wifi,
  HardDrive,
  FileSpreadsheet,
  Code,
  Server,
  Cpu,
  HardDriveIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataIngestionJob, DataQualityCheck } from '@/types';

// Mock data ingestion jobs
const mockDataIngestionJobs: DataIngestionJob[] = [
  {
    id: '1',
    name: 'Real-time Price Feed',
    type: 'price_feed',
    status: 'running',
    schedule: '*/1 * * * *', // Every minute
    source: {
      type: 'websocket',
      url: 'wss://market-data.example.com/feed',
      credentials: {
        apiKey: '***'
      }
    },
    destination: {
      collection: 'market_prices',
      format: 'json'
    },
    lastRun: new Date('2024-01-15T10:30:00Z'),
    nextRun: new Date('2024-01-15T10:31:00Z'),
    errorCount: 2,
    successCount: 1458,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    name: 'Index Data Sync',
    type: 'index_data',
    status: 'completed',
    schedule: '0 */4 * * *', // Every 4 hours
    source: {
      type: 'api',
      url: 'https://api.index-provider.com/v1/indices',
      credentials: {
        apiKey: '***'
      }
    },
    destination: {
      collection: 'index_data',
      format: 'json'
    },
    lastRun: new Date('2024-01-15T08:00:00Z'),
    nextRun: new Date('2024-01-15T12:00:00Z'),
    errorCount: 0,
    successCount: 180,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z')
  },
  {
    id: '3',
    name: 'Alternative Data Import',
    type: 'alternative_data',
    status: 'failed',
    schedule: '0 2 * * *', // Daily at 2 AM
    source: {
      type: 'csv_import',
      url: 's3://data-bucket/alternative-data/',
      credentials: {
        accessKey: '***',
        secretKey: '***'
      }
    },
    destination: {
      collection: 'alternative_data',
      format: 'csv'
    },
    lastRun: new Date('2024-01-15T02:00:00Z'),
    nextRun: new Date('2024-01-16T02:00:00Z'),
    errorCount: 5,
    successCount: 30,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T02:00:00Z')
  },
  {
    id: '4',
    name: 'Historical Data Reconciliation',
    type: 'csv_import',
    status: 'scheduled',
    schedule: '0 1 * * 0', // Weekly on Sunday at 1 AM
    source: {
      type: 'file_system',
      url: '/data/historical/',
      credentials: {}
    },
    destination: {
      collection: 'historical_data',
      format: 'parquet'
    },
    lastRun: new Date('2024-01-14T01:00:00Z'),
    nextRun: new Date('2024-01-21T01:00:00Z'),
    errorCount: 0,
    successCount: 52,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-14T01:00:00Z')
  }
];

const mockDataQualityChecks: DataQualityCheck[] = [
  {
    id: '1',
    jobId: '1',
    checkType: 'completeness',
    status: 'pass',
    details: 'All required fields present in 99.8% of records',
    timestamp: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    jobId: '1',
    checkType: 'accuracy',
    status: 'pass',
    details: 'Price data within expected ranges',
    timestamp: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '3',
    jobId: '2',
    checkType: 'consistency',
    status: 'pass',
    details: 'Index values consistent with previous snapshots',
    timestamp: new Date('2024-01-15T08:00:00Z')
  },
  {
    id: '4',
    jobId: '3',
    checkType: 'timeliness',
    status: 'fail',
    details: 'Data delayed by 2 hours from expected delivery time',
    timestamp: new Date('2024-01-15T02:00:00Z')
  }
];

const DataIngestionPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<DataIngestionJob | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const { toast } = useToast();

  const filteredJobs = mockDataIngestionJobs.filter(job => {
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const formatDate = (date: Date | undefined) => {
    return date ? date.toLocaleString() : 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price_feed': return <Wifi className="h-4 w-4" />;
      case 'index_data': return <BarChart3 className="h-4 w-4" />;
      case 'alternative_data': return <Database className="h-4 w-4" />;
      case 'csv_import': return <FileSpreadsheet className="h-4 w-4" />;
      case 'api_sync': return <Code className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getSuccessRate = (job: DataIngestionJob) => {
    const total = job.successCount + job.errorCount;
    return total > 0 ? (job.successCount / total) * 100 : 0;
  };

  const handleStartJob = (jobId: string) => {
    toast({
      title: 'Job Started',
      description: `Data ingestion job ${jobId} has been started successfully.`,
    });
  };

  const handleStopJob = (jobId: string) => {
    toast({
      title: 'Job Stopped',
      description: `Data ingestion job ${jobId} has been stopped.`,
    });
  };

  const handleRetryJob = (jobId: string) => {
    toast({
      title: 'Job Retried',
      description: `Data ingestion job ${jobId} has been retried.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'Data ingestion report has been exported successfully.',
    });
  };

  const totalJobs = mockDataIngestionJobs.length;
  const runningJobs = mockDataIngestionJobs.filter(j => j.status === 'running').length;
  const failedJobs = mockDataIngestionJobs.filter(j => j.status === 'failed').length;
  const totalSuccessRate = mockDataIngestionJobs.reduce((sum, job) => sum + getSuccessRate(job), 0) / totalJobs;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Ingestion & ETL</h1>
          <p className="text-muted-foreground">
            Real-time data ingestion and ETL pipeline management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={() => setIsCreatingJob(true)}>
            <Upload className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      {/* Data Ingestion Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Active data pipelines
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Job Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="price_feed">Price Feed</SelectItem>
                  <SelectItem value="index_data">Index Data</SelectItem>
                  <SelectItem value="alternative_data">Alternative Data</SelectItem>
                  <SelectItem value="csv_import">CSV Import</SelectItem>
                  <SelectItem value="api_sync">API Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Ingestion Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Data Ingestion Jobs</CardTitle>
          <CardDescription>
            Monitor and manage data ingestion pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(job.type)}
                      <span className="font-semibold">{job.name}</span>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                    {job.status === 'running' && (
                      <Button size="sm" variant="destructive" onClick={() => handleStopJob(job.id)}>
                        <Pause className="mr-1 h-3 w-3" />
                        Stop
                      </Button>
                    )}
                    {job.status === 'failed' && (
                      <Button size="sm" onClick={() => handleRetryJob(job.id)}>
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Retry
                      </Button>
                    )}
                    {job.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleStartJob(job.id)}>
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium capitalize">{job.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="ml-2 font-medium">{job.schedule}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="ml-2 font-medium">{getSuccessRate(job).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="ml-2 font-medium">{formatDate(job.nextRun)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span>{getSuccessRate(job).toFixed(1)}%</span>
                  </div>
                  <Progress value={getSuccessRate(job)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Success: {job.successCount}</span>
                    <span>Errors: {job.errorCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Last Run: {formatDate(job.lastRun)}
                  </div>
                  <div>
                    Source: {job.source.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Checks</CardTitle>
          <CardDescription>
            Monitor data quality and validation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDataQualityChecks.map((check, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        check.status === 'pass' ? 'bg-green-100 text-green-800' :
                        check.status === 'fail' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {check.status.toUpperCase()}
                      </Badge>
                      <span className="font-medium">Job {check.jobId}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {check.checkType.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {check.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Details:</span>
                  <span className="ml-2">{check.details}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Resources */}
      <Card>
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
          <CardDescription>
            Monitor system performance and resource usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">45%</div>
              <Progress value={45} className="h-2" />
              <div className="text-xs text-muted-foreground">Normal range</div>
            </div>
                         <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium">Memory Usage</span>
                 <HardDrive className="h-4 w-4 text-muted-foreground" />
               </div>
               <div className="text-2xl font-bold">62%</div>
               <Progress value={62} className="h-2" />
               <div className="text-xs text-muted-foreground">8.2GB / 13.2GB</div>
             </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disk Usage</span>
                <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">78%</div>
              <Progress value={78} className="h-2" />
              <div className="text-xs text-muted-foreground">1.2TB / 1.5TB</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network I/O</span>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">125 MB/s</div>
              <div className="text-xs text-muted-foreground">Active connections: 24</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataIngestionPage; 