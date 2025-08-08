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
  TrendingDownIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderBlotter, OrderApproval, ComplianceCheck, ExecutionDetail } from '@/types';

// Mock trading EMS data
const mockOrderBlotter: OrderBlotter[] = [
  {
    id: '1',
    symbol: 'AAPL',
    side: 'buy',
    quantity: 1000,
    price: 150.25,
    orderType: 'limit',
    status: 'pending',
    approvalLevel: 1,
    approvals: [
      { level: 1, approver: 'Jane Wilson', status: 'pending', timestamp: new Date('2024-01-15T09:30:00Z') }
    ],
    complianceChecks: [
      { rule: 'Position Limit', status: 'pass', details: 'Position within 5% limit' },
      { rule: 'Concentration Limit', status: 'pass', details: 'Sector concentration within limits' }
    ],
    createdAt: new Date('2024-01-15T09:30:00Z'),
    updatedAt: new Date('2024-01-15T09:35:00Z')
  },
  {
    id: '2',
    symbol: 'MSFT',
    side: 'sell',
    quantity: 500,
    price: 320.50,
    orderType: 'market',
    status: 'executed',
    approvalLevel: 2,
    approvals: [
      { level: 1, approver: 'Jane Wilson', status: 'approved', timestamp: new Date('2024-01-15T08:45:00Z') },
      { level: 2, approver: 'David Brown', status: 'approved', timestamp: new Date('2024-01-15T08:50:00Z') }
    ],
    complianceChecks: [
      { rule: 'Position Limit', status: 'pass', details: 'Position within 3% limit' },
      { rule: 'Concentration Limit', status: 'pass', details: 'Sector concentration within limits' }
    ],
    executionDetails: {
      broker: 'Morgan Stanley',
      venue: 'NASDAQ',
      executionPrice: 320.45,
      executionTime: new Date('2024-01-15T09:00:00Z'),
      slippage: -0.05,
      commission: 150,
      fees: 25
    },
    createdAt: new Date('2024-01-15T08:45:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: '3',
    symbol: 'TSLA',
    side: 'buy',
    quantity: 2000,
    price: 180.00,
    orderType: 'limit',
    status: 'rejected',
    approvalLevel: 1,
    approvals: [
      { level: 1, approver: 'Lisa Garcia', status: 'rejected', comments: 'Exceeds position limits', timestamp: new Date('2024-01-15T10:18:00Z') }
    ],
    complianceChecks: [
      { rule: 'Position Limit', status: 'fail', details: 'Position exceeds 5% limit' },
      { rule: 'Concentration Limit', status: 'pass', details: 'Sector concentration within limits' }
    ],
    createdAt: new Date('2024-01-15T10:15:00Z'),
    updatedAt: new Date('2024-01-15T10:20:00Z')
  }
];

const mockOrderApprovals: OrderApproval[] = [
  {
    level: 1,
    approver: 'Jane Wilson',
    status: 'approved',
    comments: 'Within limits, approved',
    timestamp: new Date('2024-01-15T09:32:00Z')
  },
  {
    level: 2,
    approver: 'David Brown',
    status: 'approved',
    comments: 'Risk assessment passed',
    timestamp: new Date('2024-01-15T08:50:00Z')
  },
  {
    level: 1,
    approver: 'Lisa Garcia',
    status: 'rejected',
    comments: 'Exceeds position limits',
    timestamp: new Date('2024-01-15T10:18:00Z')
  }
];

const mockComplianceChecks: ComplianceCheck[] = [
  {
    rule: 'Position Limit',
    status: 'pass',
    details: 'Position within 5% limit'
  },
  {
    rule: 'Concentration Limit',
    status: 'pass',
    details: 'Sector concentration within limits'
  },
  {
    rule: 'Position Limit',
    status: 'fail',
    details: 'Position exceeds 5% limit'
  }
];

const TradingEMSPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSide, setSelectedSide] = useState('all');
  const [selectedBroker, setSelectedBroker] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderBlotter | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const { toast } = useToast();

  const filteredOrders = mockOrderBlotter.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSide = selectedSide === 'all' || order.side === selectedSide;
    const matchesSearch = order.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSide && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveOrder = (orderId: string) => {
    toast({
      title: 'Order Approved',
      description: `Order ${orderId} has been approved successfully.`,
    });
  };

  const handleRejectOrder = (orderId: string) => {
    toast({
      title: 'Order Rejected',
      description: `Order ${orderId} has been rejected.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'Trading EMS report has been exported successfully.',
    });
  };

  const totalOrders = mockOrderBlotter.length;
  const executedOrders = mockOrderBlotter.filter(o => o.status === 'executed').length;
  const pendingOrders = mockOrderBlotter.filter(o => o.status === 'pending').length;
  const totalValue = mockOrderBlotter.reduce((sum, order) => sum + (order.quantity * order.price), 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading EMS</h1>
          <p className="text-muted-foreground">
            Real-time order management and execution analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Trading EMS Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
                  <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Executed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executedOrders}</div>
              <p className="text-xs text-muted-foreground">
                {((executedOrders / totalOrders) * 100).toFixed(1)}% execution rate
              </p>
            </CardContent>
          </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Order Filters</CardTitle>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="side">Side</Label>
            <Select value={selectedSide} onValueChange={setSelectedSide}>
              <SelectTrigger>
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sides</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Order Blotter */}
      <Card>
        <CardHeader>
          <CardTitle>Order Blotter</CardTitle>
          <CardDescription>
            Real-time order management and execution tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getSideColor(order.side)}>
                        {order.side.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{order.symbol}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.quantity.toLocaleString()} shares @ {formatCurrency(order.price)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      Level {order.approvalLevel}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order Type:</span>
                    <span className="ml-2 font-medium capitalize">{order.orderType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approvals:</span>
                    <span className="ml-2 font-medium">{order.approvals.length}/{order.approvalLevel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Compliance:</span>
                    <span className="ml-2 font-medium">{order.complianceChecks.filter(c => c.status === 'pass').length}/{order.complianceChecks.length}</span>
                  </div>
                </div>

                {order.status === 'executed' && order.executionDetails && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-800 mb-2">Execution Details</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Broker:</span>
                        <span className="ml-2 font-medium">{order.executionDetails.broker}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Venue:</span>
                        <span className="ml-2 font-medium">{order.executionDetails.venue}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Execution Price:</span>
                        <span className="ml-2 font-medium">{formatCurrency(order.executionDetails.executionPrice)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Slippage:</span>
                        <span className={`ml-2 font-medium ${order.executionDetails.slippage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(order.executionDetails.slippage)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleApproveOrder(order.id)}>
                          <CheckSquare className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectOrder(order.id)}>
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
          <CardDescription>
            Multi-level approval tracking and compliance checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrderApprovals.map((approval, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getComplianceColor(approval.status)}>
                        {approval.status.toUpperCase()}
                      </Badge>
                      <span className="font-medium">Level {approval.level} Approval</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {approval.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Approver:</span>
                  <span className="ml-2 font-medium">{approval.approver}</span>
                </div>
                {approval.comments && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Comments:</span>
                    <span className="ml-2">{approval.comments}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Checks</CardTitle>
          <CardDescription>
            Pre-trade and post-trade compliance validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockComplianceChecks.map((check, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getComplianceColor(check.status)}>
                        {check.status.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{check.rule}</span>
                    </div>
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

      {/* Execution Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Analytics</CardTitle>
          <CardDescription>
            Transaction cost analysis and execution performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Average Slippage</div>
              <div className="text-2xl font-bold text-green-600">-0.02%</div>
              <div className="text-xs text-muted-foreground">Better than market</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Average Spread</div>
              <div className="text-2xl font-bold">0.05%</div>
              <div className="text-xs text-muted-foreground">Within target</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Fill Rate</div>
              <div className="text-2xl font-bold">94.2%</div>
              <div className="text-xs text-muted-foreground">+2.1% vs last month</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Avg Execution Time</div>
              <div className="text-2xl font-bold">12.5s</div>
              <div className="text-xs text-muted-foreground">-3.2s vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEMSPage; 