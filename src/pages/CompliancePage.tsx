import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
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
  Shield,
  FileText,
  Users,
  Settings,
  Bell,
  Flag,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

// Mock compliance data
const complianceTasks = [
  {
    id: 1,
    title: 'Annual Form ADV Filing',
    type: 'regulatory',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-03-31',
    assignedTo: 'Sarah Johnson',
    description: 'Annual Form ADV filing with SEC',
    riskLevel: 'low',
    lastUpdated: '2024-01-15T10:30:00Z',
    attachments: ['form_adv_2024.pdf', 'supporting_docs.zip']
  },
  {
    id: 2,
    title: 'Quarterly Risk Assessment',
    type: 'risk',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-02-15',
    assignedTo: 'Mike Chen',
    description: 'Quarterly portfolio risk assessment and reporting',
    riskLevel: 'medium',
    lastUpdated: '2024-01-14T14:15:00Z',
    attachments: ['risk_assessment_template.xlsx']
  },
  {
    id: 3,
    title: 'Cybersecurity Audit',
    type: 'security',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-31',
    assignedTo: 'David Kim',
    description: 'Annual cybersecurity audit and penetration testing',
    riskLevel: 'high',
    lastUpdated: '2024-01-13T09:45:00Z',
    attachments: ['security_audit_scope.pdf']
  },
  {
    id: 4,
    title: 'Anti-Money Laundering Review',
    type: 'aml',
    priority: 'medium',
    status: 'overdue',
    dueDate: '2024-01-10',
    assignedTo: 'Lisa Wang',
    description: 'AML compliance review and suspicious activity reporting',
    riskLevel: 'high',
    lastUpdated: '2024-01-12T11:20:00Z',
    attachments: ['aml_policy.pdf', 'suspicious_activity_log.xlsx']
  },
  {
    id: 5,
    title: 'Code of Ethics Training',
    type: 'training',
    priority: 'low',
    status: 'scheduled',
    dueDate: '2024-02-28',
    assignedTo: 'John Smith',
    description: 'Annual code of ethics training for all employees',
    riskLevel: 'low',
    lastUpdated: '2024-01-11T16:00:00Z',
    attachments: ['ethics_training_materials.pdf']
  }
];

const riskMetrics = [
  { name: 'Portfolio Concentration', value: 15.2, threshold: 20, status: 'normal' },
  { name: 'Leverage Ratio', value: 1.4, threshold: 2.0, status: 'normal' },
  { name: 'VaR (95%)', value: -2.1, threshold: -3.0, status: 'warning' },
  { name: 'Liquidity Coverage', value: 85, threshold: 80, status: 'normal' },
  { name: 'Counterparty Risk', value: 8.5, threshold: 10, status: 'normal' }
];

const auditLogs = [
  { id: 1, action: 'Trade executed', user: 'John Smith', timestamp: '2024-01-15T10:30:00Z', details: 'Bought 1000 AAPL @ $185.50', risk: 'low' },
  { id: 2, action: 'Position limit exceeded', user: 'System', timestamp: '2024-01-15T09:15:00Z', details: 'TSLA position at 105% of limit', risk: 'high' },
  { id: 3, action: 'Document uploaded', user: 'Sarah Johnson', timestamp: '2024-01-14T16:45:00Z', details: 'Form ADV supporting documents', risk: 'low' },
  { id: 4, action: 'Login attempt failed', user: 'Unknown', timestamp: '2024-01-14T14:20:00Z', details: 'Failed login from IP 192.168.1.100', risk: 'medium' },
  { id: 5, action: 'Risk threshold breached', user: 'System', timestamp: '2024-01-14T11:30:00Z', details: 'Portfolio VaR exceeded 2.5%', risk: 'high' }
];

const CompliancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredTasks = complianceTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesType = selectedType === 'all' || task.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'status':
        return a.status.localeCompare(b.status);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalTasks = complianceTasks.length;
  const completedTasks = complianceTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = complianceTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  const highRiskTasks = complianceTasks.filter(t => t.riskLevel === 'high').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  const getMetricStatus = (value: number, threshold: number) => {
    if (value >= threshold) return 'normal';
    if (value >= threshold * 0.8) return 'warning';
    return 'critical';
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">
            Regulatory compliance, risk monitoring, and audit trails
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${highRiskTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {highRiskTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical compliance items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Regulatory compliance rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics Dashboard</CardTitle>
          <CardDescription>Real-time risk monitoring and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {riskMetrics.map((metric) => (
              <div key={metric.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <Badge className={getRiskColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2">
                  {typeof metric.value === 'number' && metric.value < 0 ? '-' : ''}
                  {Math.abs(metric.value).toFixed(1)}
                  {metric.name.includes('Coverage') ? '%' : ''}
                </div>
                <div className="text-xs text-muted-foreground">
                  Threshold: {metric.threshold}
                  {metric.name.includes('Coverage') ? '%' : ''}
                </div>
                <Progress 
                  value={(Math.abs(metric.value) / Math.abs(metric.threshold)) * 100} 
                  className="mt-2 h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Task Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search tasks..."
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
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="scheduled">Scheduled</option>
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
                <option value="regulatory">Regulatory</option>
                <option value="risk">Risk</option>
                <option value="security">Security</option>
                <option value="aml">AML</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Tasks</CardTitle>
          <CardDescription>
            {filteredTasks.length} of {complianceTasks.length} tasks shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getRiskColor(task.riskLevel)}>
                        {task.riskLevel} risk
                      </Badge>
                      {isOverdue(task.dueDate) && task.status !== 'completed' && (
                        <Badge className="bg-red-100 text-red-800">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {formatDate(task.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.attachments.length > 0 && (
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                        {task.attachments.length}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
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

      {/* Audit Logs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
            <CardDescription>System activity and compliance events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getRiskColor(log.risk)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{log.user}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts</CardTitle>
            <CardDescription>Active alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">AML Review Overdue</p>
                  <p className="text-xs text-red-600">Due date: Jan 10, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">VaR Threshold Warning</p>
                  <p className="text-xs text-yellow-600">Portfolio VaR at 2.1%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Security Audit Scheduled</p>
                  <p className="text-xs text-blue-600">Due: Jan 31, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePage; 